import express from "express";
import "dotenv/config";
import solarUnitRouter from "./api/solar-unit.js";
import {connectDB} from "./infrastructure/db.js";
import energyGenerationRecordRouter from "./api/EnergyGenerationRecode.js";

const server=express();
server.use(express.json());
const PORT=8000;
server.use("/api/solar-units",solarUnitRouter);
server.use("/api/energy-generation-records", energyGenerationRecordRouter);
connectDB();

server.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`);
})