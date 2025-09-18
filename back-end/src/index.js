import express from "express";
import solarUnitRouter from "./api/solar-unit.js";

const server=express();
server.use(express.json());
const PORT=8000;
server.use("/api/solar-units",solarUnitRouter);

server.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`);
})