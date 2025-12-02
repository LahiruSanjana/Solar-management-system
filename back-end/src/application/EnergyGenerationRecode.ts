import { EnergyGenerationRecord } from "../infrastructure/entities/EnergyGenerationRecode";
import { Request, Response ,NextFunction} from "express";
import {GetAllEnergyGenerationRecordsSolarUnitDto,GetEnergyGenerationRecordBy24hoursDataDto} from "../domen/dto/Solar-unit";
import { ValidationError } from "../domen/error/Error";
import mongoose from "mongoose";
import { User } from "../infrastructure/entities/User";
import { SolarUnit } from "../infrastructure/entities/SolarUnit";


// export const getLast24HoursEnergyData = async (req: Request, res: Response) => {
//   try {
//     const { solarUnitId } = req.params; 
//     const result = GetEnergyGenerationRecordBy24hoursDataDto.safeParse(req.query);
//     if (!result.success) {
//       return new ValidationError(result.error.message);
//     }
//     const { groupBy, limit } = req.query;
//     if (!groupBy) {
//       const records = await EnergyGenerationRecord.find({ userId: solarUnitId }).sort({ timestamp: -1 }).limit(12);
//       return res.status(200).json(records);
//     }

//     if (groupBy === "date" || groupBy === "time" || groupBy === "datetime") {
//         const records = await EnergyGenerationRecord.aggregate([
//           {$group:{
//               _id: {
//                   date: { 
//                     $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
//                   },
//               },
//               totalEnergy: { $sum: { $divide: [ "$generatedEnergy", 1000 ] } },
//           }},
//           { $sort: {  "_id.date": -1 }}
//       ]);
//       if (!limit) {
//         return res.status(200).json(records);
//       }
//       return res.status(200).json(records.slice(0, parseInt(limit as string))); 
//           }}
//     catch (error) {
//     console.error("Error fetching last 24 hours energy data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
export const getLast24HoursEnergyData = async (req: Request, res: Response) => {
  try {
    const { solarUnitId } = req.params;

    const limit = Number(req.query.limit) || 12;  // default 12

    const records = await EnergyGenerationRecord.find({
      solarUnitId: solarUnitId,
    })
      .sort({ timestamp: -1 }) // latest first
      .limit(limit);

    return res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching last 24 hours energy data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllEnergyGenerationRecordsSolarUnit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = GetAllEnergyGenerationRecordsSolarUnitDto.safeParse(req.query);
    if (!result.success) {
      return new ValidationError(result.error.message);
    }
    const { groupBy, limit } = result.data;
    if (!groupBy) {
      const energyGenerationRecords=await EnergyGenerationRecord.find({
        solarUnitId: id,
      }).sort({ timestamp: -1 });
      return res.status(200).json(energyGenerationRecords);
    }

    if (groupBy === "date") {  
        const records = await EnergyGenerationRecord.aggregate([
          { $group: {
              _id: {
                  date: { 
                    $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
              },
              },
              totalEnergy: { $sum: { $divide: [ "$generatedEnergy", 1000 ] } },
            },
        },
          { $sort: {  "_id.date": -1 }}
      ]);
      if (!limit) {
        return res.status(200).json(records);
      }
      res.status(200).json(records.slice(0, parseInt(limit as string)));
    }
  } catch (error) {
    console.error("Error fetching energy generation records:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
