import { v4 as uuidv4 } from "uuid";
import {SolarUnit} from "../infrastructure/entities/SolarUnit.js";

export const getAllsolarUnits=async(req,res)=>{
    try {
        const solarunits = await SolarUnit.find();
        res.status(200).json(solarunits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const creatSolarUnit=async(req,res)=>{
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
        res.status(500).json({ message: error.message });
    }
}

export const getsolarUnitById=async(req,res)=>{
    try {
        const {id} =req.params;
        const solarunit=await solarunit.findById(id);

        if(!solarunit){
            return res.status(404).json({message:"Solar unit not found."})
        }
    res.status(201).json(solarunit);
}catch (error) {
    res.status(500).json({ message: error.message });
}
}
export const updatesolarUnit=async(req,res)=>{
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
    res.status(200).json(SolarUnit[solarunitIndex]);
};
export const deletesolarUnit=async(req,res)=>{
    try {
        const {id} =req.params;
        const solarunit=await SolarUnit.findById(id);

    if(!solarunit){
        return res.status(404).json({message:"Solar unit not found."})
    }
    await SolarUnit.findByIdAndDelete(id);
    res.status(204).send();
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};