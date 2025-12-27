import { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { User } from "../../../infrastructure/entities/User";
import { SolarUnit } from "../../../infrastructure/entities/SolarUnit";
import { EnergyGenerationRecord } from "../../../infrastructure/entities/EnergyGenerationRecode";
import { z } from "zod";

/**
 * Zod schema for Data API response
 */
export const dataApiRecordsSchema = z.array(
  z.object({
    _id: z.string(),
    serialNumber: z.string(),
    timestamp: z.string(),
    generatedEnergy: z.number(),
    intervalHours: z.number().optional(),
    __v: z.number().optional(),
  })
);

/**
 * Sync Middleware (SAFE VERSION)
 */
const syncMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 🚑 1. Skip health checks & unauthenticated requests
    const auth = getAuth(req);
    if (!auth.userId) {
      return next();
    }

    // 🚑 2. Only run for GET requests (avoid unnecessary sync)
    if (req.method !== "GET") {
      return next();
    }

    // 3. Find user
    const user = await User.findOne({ clerkUserId: auth.userId });
    if (!user) {
      return next(); // do NOT throw
    }

    // 4. Find solar units
    const solarUnits = await SolarUnit.find({ userId: user._id });
    if (!solarUnits || solarUnits.length === 0) {
      return next();
    }

    const serialNumber = solarUnits[0].serialNumber;

    // 🔴 IMPORTANT:
    // Prefer INTERNAL Railway URL if possible
    const DATA_API_URL =
      process.env.DATA_API_URL ||
      `https://fed-4-data-api-production-b9a0.up.railway.app/api/energy-generation-records/solar-unit/${serialNumber}`;

    // 🚑 5. Fetch with timeout + error handling
    let response;
    try {
      response = await fetch(DATA_API_URL, {
        signal: AbortSignal.timeout(4000), // 4s timeout
      });
    } catch (err) {
      console.warn("⚠️ Data API unreachable / sleeping, sync skipped");
      return next();
    }

    if (!response.ok) {
      console.warn(
        `⚠️ Data API responded with ${response.status}, sync skipped`
      );
      return next();
    }

    // 6. Validate response
    const apiData = await response.json();
    const latestRecords = dataApiRecordsSchema.parse(apiData);

    // 7. Get last synced record
    const lastSyncedRecord = await EnergyGenerationRecord.findOne({
      solarUnitId: solarUnits[0]._id,
    }).sort({ timestamp: -1 });

    // 8. Filter new records
    const newRecords = latestRecords.filter((record) => {
      if (!lastSyncedRecord) return true;
      return new Date(record.timestamp) > lastSyncedRecord.timestamp;
    });

    // 9. Insert new records
    if (newRecords.length > 0) {
      const recordsToInsert = newRecords.map((record) => ({
        solarUnitId: solarUnits[0]._id,
        timestamp: new Date(record.timestamp),
        generatedEnergy: record.generatedEnergy,
        intervalHours: record.intervalHours,
      }));

      await EnergyGenerationRecord.insertMany(recordsToInsert);

      console.log(
        `✅ Synced ${recordsToInsert.length} records for solar unit ${serialNumber}`
      );
    } else {
      console.log(`ℹ️ No new records to sync for ${serialNumber}`);
    }

    return next();
  } catch (error) {
    // 🚑 10. NEVER crash request
    console.error("❌ Error in sync middleware (ignored):", error);
    return next();
  }
};

export default syncMiddleware;
