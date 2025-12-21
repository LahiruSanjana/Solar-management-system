import { EnergyGenerationRecord } from "../infrastructure/entities/EnergyGenerationRecode";
import { Request, Response, NextFunction } from "express";


export const getAllEnergyGenerationRecordsBySerialNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { serialNumber } = req.params;
    const energyGenerationRecords = await EnergyGenerationRecord.find({ serialNumber: serialNumber }).sort({ timestamp: 1 });
    res.status(200).json(energyGenerationRecords);
  } catch (error) {
    next(error);
  }
};
