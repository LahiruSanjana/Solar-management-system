import { v4 as uuidv4 } from "uuid";
import {SolarUnit} from "../infrastructure/entities/SolarUnit";
import {Request,Response,NextFunction} from "express";
import {z} from 'zod';
import { CreateSolarUnit,UpdateSolarUnit } from "../domen/dto/Solar-unit";
import { NotFoundError,ValidationError } from "../domen/error/Error";

export const getAllsolarUnits=async(req:Request,res:Response, next:NextFunction)=>{
    try {
        const solarunits = await SolarUnit.find();
        res.status(200).json(solarunits);
    } catch (error) {
        next(error);
    }
}

export const creatSolarUnit=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const data:z.infer<typeof CreateSolarUnit>=req.body;
        const{serialNumber, installationDate, capacity, status }=data;

        const newsolarUnit={
        serialNumber:data.serialNumber,
        installationDate:new Date(data.installationDate),
        capacity:data.capacity,
        status:data.status,
    };

    const creatSolarUnit=await SolarUnit.create(newsolarUnit);
    res.status(201).json(creatSolarUnit);
    } catch (error) {
        next(error);
    }
}

export const getsolarUnitById=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id} =req.params;
        const solarunit=await SolarUnit.findById(id);

        if(!solarunit){
            return res.status(404).json({message:"Solar unit not found."})
        }
    res.status(201).json(solarunit);
}catch (error) {
    next(error);
}
}
export const updatesolarUnit=async(req:Request,res:Response,next:NextFunction)=>{
    const {id} =req.params;
    const data:z.infer<typeof UpdateSolarUnit>=req.body;
    const { serialNumber, installationDate, capacity, status }=data; 
    const solarUnit=await SolarUnit.findById(id);

    if(!solarUnit){
        return res.status(404).json({message:"Solar unit not found."})
    }

    const updatesolarUnit=await SolarUnit.findByIdAndUpdate(id,{
        serialNumber:data.serialNumber,
        installationDate:data.installationDate,
        capacity:data.capacity,
        status:data.status,
    });
    res.status(200).json(updatesolarUnit);
};
export const deletesolarUnit=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id} =req.params;
        const solarunit=await SolarUnit.findById(id);

    if(!solarunit){
        return res.status(404).json({message:"Solar unit not found."})
    }
    await SolarUnit.findByIdAndDelete(id);
    res.status(204).send();
    }catch (error) {
        next(error);
    }
};