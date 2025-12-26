import express from "express";
import "dotenv/config";
import solarUnitRouter from "./api/solar-unit";
import {connectDB} from "./infrastructure/db";
import energyGenerationRecordRouter from "./api/EnergyGenerationRecode";
import loggerMiddleware from "./api/middlware/Logger-middlware";
import globalErrorHandler from "./api/middlware/global-error-handling-middleware";
import cors from "cors";
import webhookRouter from "./api/Webhook";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./api/User";
import { invoiceRouter, adminInvoiceRouter } from "./api/invoice";
import { startInvoiceScheduler } from "./application/background/generate-invoices";
import paymentRouter from "./api/payment";
import { handleStripeWebhook } from "./application/payment";

const server = express();

// CORS setup for both local dev and deployed Netlify frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://fed-4-front-end-sanjanafernando.netlify.app"
];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

// --- FIX 1: Express 5 Compatibility ---
server.use(cors(corsOptions));
// Changed "*" to "(.*)" because Express 5 crashes on "*"
server.options("(.*)", cors(corsOptions)); 

server.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

server.use(loggerMiddleware);
const PORT = parseInt(process.env.PORT || "8000", 10);

// --- FIX 2: Health Check Route ---
// Railway needs a root route to check if the server is alive
server.get("/", (req, res) => {
  res.status(200).send("Solar API is running");
});

// Webhook must come before clerkMiddleware and express.json() for raw body access
server.use("/api/webhooks", webhookRouter);
server.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

// Clerk middleware should be early in the chain
server.use(clerkMiddleware());
server.use(express.json());

server.use("/api/solar-units", solarUnitRouter);
server.use("/api/energy-generation-records", energyGenerationRecordRouter);
server.use("/api/users", userRouter);
server.use("/api/invoices", invoiceRouter);
server.use("/api/admin/invoices", adminInvoiceRouter);
server.use("/api/payments", paymentRouter);

server.use(globalErrorHandler);

connectDB();
startInvoiceScheduler();

// --- FIX 3: Bind to 0.0.0.0 ---
// Required for Railway/Docker to expose the port externally
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});