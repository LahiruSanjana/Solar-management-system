import { solarunits } from "../infrastructure/data.js";
import { v4 as uuidv4 } from "uuid";

export const getAllsolarUnits=async(req,res)=>{
    res.status(200).json(solarunits);
}

export const creatSolarUnit=async(req,res)=>{
    const{userId, serialNumber, installationDate, capacity, status }=req.body;

    const newsolarUnit={
        _id:uuidv4(),
        userId,
        serialNumber,
        installationDate,
        capacity,
        status,
    };

    solarunits.push(newsolarUnit);
    res.status(201).json(solarunits);
}

export const getsolarUnitById=async(req,res)=>{
    const {id} =req.params;
    const solarunit=solarunits.find((solarunit)=>solarunit._id===id);

    if(!solarunit){
        return res.status(404).json({message:"Solar unit not found."})
    }
    res.status(201).json(solarunit);
};

export const updatesolarUnit=async(req,res)=>{
    const {id} =req.params;
    const {userId, serialNumber, installationDate, capacity, status }=req.body; 
    const solarunitIndex=solarunits.findIndex((solarunit).solarunit._id===id);

    if(solarunitIndex===-1){
        return res.status(404).json({message:"Solar unit not found."})
    }

    solarunits[solarunitIndex]={
        _id:id,
        userId,
        serialNumber,
        installationDate,
        capacity,
        status
    };
    res.status(200).json(solarunits[solarunitIndex]);
};
export const deletesolarUnit=async(req,res)=>{
    const {id} =req.params;
    const solarunitIndex=solarunits.findIndex((solarunit)=>solarunit._id===id);

    if(solarunitIndex===-1){
        return res.status(404).json({message:"Solar unit not found."})
    }

    solarunits.splice(solarunitIndex, 1);
    res.status(204).send();
};

