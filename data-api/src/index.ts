import express from "express";
import "dotenv/config";
import {connectDB} from "./infrastructure/db";
import energyGenerationRecordRouter from "./api/EnergyGenerationRecode";
import loggerMiddleware from "./api/middlware/Logger-middlware";
import globalErrorHandler from "./api/middlware/global-error-handling-middleware";
import cors from "cors";

const server=express();
server.use(cors({origin: "*"}));
server.use(loggerMiddleware);
server.use(express.json());

server.use("/api/energy-generation-records", energyGenerationRecordRouter);
server.use(globalErrorHandler);

connectDB();

const PORT=process.env.PORT||8001;
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});