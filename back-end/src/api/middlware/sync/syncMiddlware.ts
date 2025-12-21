import { NextFunction,Request,Response } from "express";
import { getAuth } from "@clerk/express";
import { NotFoundError } from "../../../domen/error/Error";
import { User } from "../../../infrastructure/entities/User";
import { SolarUnit } from "../../../infrastructure/entities/SolarUnit";
import { EnergyGenerationRecord } from "../../../infrastructure/entities/EnergyGenerationRecode";
import {z} from "zod";

export const dataApiRecordsSchema = z.array(z.object({
    _id: z.string(),
    serialNumber: z.string(),
    timestamp: z.string(),
    generatedEnergy: z.number(),
    intervalHours: z.number().optional(),
    __v: z.number().optional(),
}));

const syncMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = getAuth(req);
    const user=await User.findOne({clerkUserId:auth.userId});
    if (!user) {
      return next(new NotFoundError("User not found"));
    }
    const solarUnits = await SolarUnit.find({ userId: user._id });
    if (!solarUnits || solarUnits.length === 0) {
        return next();
    }

    const dataApiRecords = await fetch(
        `http://localhost:8001/api/energy-generation-records/solar-unit/${solarUnits[0].serialNumber}`,
    );
    if (!dataApiRecords.ok) {
        throw new Error("Failed to fetch data from Data API");
    }

    const latestRecords = dataApiRecordsSchema.parse(await dataApiRecords.json());
 
    const lastSyncedRecord = await EnergyGenerationRecord.findOne({ solarUnitId: solarUnits[0]._id })
      .sort({ timestamp: -1 });

    const newRecords = latestRecords.filter(apirecord => {
        if (!lastSyncedRecord) return true;
        return new Date(apirecord.timestamp) > lastSyncedRecord.timestamp;
    });

    if (newRecords.length > 0) {
        const recordsToInsert = newRecords.map(record => ({
            solarUnitId: solarUnits[0]._id,
            timestamp: new Date(record.timestamp),
            generatedEnergy: record.generatedEnergy,
            intervalHours: record.intervalHours,
        }));
        await EnergyGenerationRecord.insertMany(recordsToInsert);
        console.log(`Inserted ${recordsToInsert.length} new records for solar unit ${solarUnits[0].serialNumber}`);
    }else {
        console.log(`No new records to sync for solar unit ${solarUnits[0].serialNumber}`);
    }
    next();
}catch (error) {
    console.error("Error in sync middleware:", error);
    next(error);
}
};
export default syncMiddleware;