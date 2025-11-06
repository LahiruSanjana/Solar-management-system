import { EnergyGenerationRecord } from "../infrastructure/entities/EnergyGenerationRecode";
import { Request, Response ,NextFunction} from "express";
import {GetAllEnergyGenerationRecordsSolarUnitDto} from "../domen/dto/Solar-unit";
import { ValidationError } from "../domen/error/Error";
import mongoose from "mongoose";


export const getLast24HoursEnergyData = async (req: Request, res: Response) => {
  try {
    const { solarUnitId } = req.params;
    console.log("Fetching last 24 hours data for solar unit ID:", solarUnitId);

    // Calculate 24 hours ago
    const now = new Date("2025-10-23T12:00:00.000Z");
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    const records = await EnergyGenerationRecord.find({
      solarUnitId: new mongoose.Types.ObjectId(solarUnitId),
      timestamp: { $gte: last24Hours } // only last 24 hours
    })
    .sort({ timestamp: -1 }) // newest first
    .limit(12); // optional: limit to 12 records
    console.log(`Found ${records.length} records for solar unit ID:`, solarUnitId);
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching last 24 hours data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getAllEnergyGenerationRecordsSolarUnit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = GetAllEnergyGenerationRecordsSolarUnitDto.safeParse(req.query);
    if (!result.success) {
      return new ValidationError(result.error.message);
    }
    const { groupBy, limit } = req.query;
    if (!groupBy) {
       const records = await EnergyGenerationRecord.find({ solarUnitId:id }).sort({ timestamp: -1 });
      res.status(200).json(records);
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
