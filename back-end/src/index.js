import express from "express";
import "dotenv/config";
import solarUnitRouter from "./api/solar-unit.js";
import {connectDB} from "./infrastructure/db.js";

const server=express();
server.use(express.json());
const PORT=8000;
server.use("/api/solar-units",solarUnitRouter);
connectDB();

server.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`);
})