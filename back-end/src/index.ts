import express from "express";
import "dotenv/config";
import solarUnitRouter from "./api/solar-unit";
import { connectDB } from "./infrastructure/db";
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

const allowedOrigins = [
  "http://localhost:5173",
  "https://fed-4-front-end-sanjanafernando.netlify.app"
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

server.use(cors(corsOptions));

server.use(loggerMiddleware);

// Health check endpoint
server.get("/", (req, res) => {
  res.status(200).send("Solar Management System Backend is running");
});

// Webhook must come before clerkMiddleware and express.json() for raw body access
server.use("/api/webhooks", webhookRouter);
console.log("Webhook router mounted at /api/webhooks");

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

const startServer = async () => {
  try {
    await connectDB();
    startInvoiceScheduler();

    const PORT = process.env.PORT || 8000;
    server.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();