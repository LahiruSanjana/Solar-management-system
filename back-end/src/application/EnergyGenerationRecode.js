import { EnergyGenerationRecord } from "../infrastructure/entities/EnergyGenerationRecode.js";

export const getAllEnergyGenerationRecordsSolarUnit = async (req, res) => {
  try {
    const { solarUnitId } = req.params;
    const records = await EnergyGenerationRecord.find({ solarUnitId });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
