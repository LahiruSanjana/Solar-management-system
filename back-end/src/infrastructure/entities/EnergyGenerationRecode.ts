import mongoose from "mongoose";

const energyGenerationRecordSchema = new mongoose.Schema({
  solarUnitId: { 
    type: mongoose.Schema.Types.ObjectId,   // reference to SolarUnit
    ref: "SolarUnit", 
    required: true 
  },
  generatedEnergy: { 
    type: Number, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now   // auto assigns when record created
  }
});

export const EnergyGenerationRecord = mongoose.model(
  "EnergyGenerationRecord", 
  energyGenerationRecordSchema
);
