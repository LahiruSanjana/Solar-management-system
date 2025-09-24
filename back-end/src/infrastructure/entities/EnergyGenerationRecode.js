import mongoose from "mongoose";

const energyGenerationRecordSchema = new mongoose.Schema({
  solarUnitId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SolarUnit', required: true 
},
  generatedEnergy: { 
    type: Number, 
    required: true 
},
  timestamp: { 
    type: Date, 
    default: Date.now 
   }
});

export const EnergyGenerationRecord = mongoose.model("EnergyGenerationRecord", energyGenerationRecordSchema);