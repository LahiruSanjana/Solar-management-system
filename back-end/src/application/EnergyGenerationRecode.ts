import { EnergyGenerationRecord } from "../infrastructure/entities/EnergyGenerationRecode";
import { Request, Response } from "express";

export const getAllEnergyGenerationRecordsSolarUnit = async (req: Request, res: Response) => {
  try {
    const { solarUnitId } = req.params; // ✅ no dot after params
    console.log(solarUnitId)
    const records = await EnergyGenerationRecord.find({ solarUnitId });
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching energy generation records:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
