import { EnergyGenerationRecord } from "../infrastructure/entities/EnergyGenerationRecode";
import { Request, Response } from "express";

export const getAllEnergyGenerationRecordsSolarUnit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {groupBy} = req.query;
    
    if (!groupBy ) {
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
      res.status(200).json(records);
    }
  } catch (error) {
    console.error("Error fetching energy generation records:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
