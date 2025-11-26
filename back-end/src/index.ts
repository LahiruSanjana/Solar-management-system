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

const server=express();
server.use(cors({origin: "*"}));
server.use(loggerMiddleware);
const PORT=8000;

// Webhook must come before clerkMiddleware and express.json() for raw body access
server.use("/api/webhooks", webhookRouter);

// Clerk middleware should be early in the chain
server.use(clerkMiddleware());
server.use(express.json());

server.use("/api/solar-units",solarUnitRouter);
server.use("/api/energy-generation-records", energyGenerationRecordRouter);
server.use(globalErrorHandler);

connectDB();

server.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`);
})