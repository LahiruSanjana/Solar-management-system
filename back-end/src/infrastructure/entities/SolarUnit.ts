import mongoose from "mongoose";

const solarUnitSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    serialNumber: { 
        type: String, 
        unique: true, 
        required: true 
    },
    installationDate: { 
        type: Date, 
        required: true 
    },
    capacity: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["ACTIVE", "INACTIVE", "MAINTENANCE"], 
        default: "INACTIVE" 
    },
});

export const SolarUnit = mongoose.model("SolarUnit", solarUnitSchema);
 