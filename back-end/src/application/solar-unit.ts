import { v4 as uuidv4 } from "uuid";
import {SolarUnit} from "../infrastructure/entities/SolarUnit";
import {Request,Response} from "express";

export const getAllsolarUnits=async(req:Request,res:Response)=>{
    try {
        const solarunits = await SolarUnit.find();
        res.status(200).json(solarunits);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export const creatSolarUnit=async(req:Request,res:Response)=>{
    try {
        const{serialNumber, installationDate, capacity, status }=req.body;
        
        const newsolarUnit={
        serialNumber,
        installationDate,
        capacity,
        status,
    };

    const creatSolarUnit=await SolarUnit.create(newsolarUnit);
    res.status(201).json(creatSolarUnit);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

export const getsolarUnitById=async(req:Request,res:Response)=>{
    try {
        const {id} =req.params;
        const solarunit=await SolarUnit.findById(id);

        if(!solarunit){
            return res.status(404).json({message:"Solar unit not found."})
        }
    res.status(201).json(solarunit);
}catch (error) {
    res.status(500).json({ message: (error as Error).message });
}
}
export const updatesolarUnit=async(req:Request,res:Response)=>{
    const {id} =req.params;
    const { serialNumber, installationDate, capacity, status }=req.body; 
    const solarUnit=await SolarUnit.findById(id);

    if(!solarUnit){
        return res.status(404).json({message:"Solar unit not found."})
    }

    const updatesolarUnit=await SolarUnit.findByIdAndUpdate(id,{
        serialNumber,
        installationDate,
        capacity,
        status,
    });
    res.status(200).json(updatesolarUnit);
};
export const deletesolarUnit=async(req:Request,res:Response)=>{
    try {
        const {id} =req.params;
        const solarunit=await SolarUnit.findById(id);

    if(!solarunit){
        return res.status(404).json({message:"Solar unit not found."})
    }
    await SolarUnit.findByIdAndDelete(id);
    res.status(204).send();
    }catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};