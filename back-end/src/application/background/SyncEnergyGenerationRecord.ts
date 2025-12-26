import { NextFunction, Request, Response } from "express";
import { SolarUnit } from "../../infrastructure/entities/SolarUnit";
import { EnergyGenerationRecord } from "../../infrastructure/entities/EnergyGenerationRecode";
import { z } from "zod";

export const DataAPIEnergyGenerationRecordDto = z.object({
    _id: z.string(),
    serialNumber: z.string(),
    energyGenerated: z.number(),
    timestamp: z.string(),
    intervalHours: z.number(),
    __v: z.number(),
});

export const SyncEnergyGenerationRecord = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const solarUnits = await SolarUnit.find();

        for (const solarUnit of solarUnits) {
            const lastSyncedRecord = await EnergyGenerationRecord
                .findOne({ solarUnitId: solarUnit._id })
                .sort({ timestamp: -1 });
            const baseUrl = `https://fed-4-data-api-production.up.railway.app/api/energy-generation-records/solar-unit/${solarUnit.serialNumber}`;
            const url = new URL(baseUrl);
            if (lastSyncedRecord?.timestamp) {
                url.searchParams.append(
                    "sinceTimestamp",
                    lastSyncedRecord.timestamp.toISOString()
                );
            }
            const apiResponse = await fetch(url.toString());
            if (!apiResponse.ok) {
                console.error(
                    ` Failed to fetch data for solar unit ${solarUnit.serialNumber}`
                );
                continue;
            }
            const newRecords = DataAPIEnergyGenerationRecordDto
                .array()
                .parse(await apiResponse.json());

            if (newRecords.length > 0) {

                const recordsToInsert = newRecords.map(record => ({
                    solarUnitId: solarUnit._id,
                    energyGenerated: record.energyGenerated,
                    timestamp: new Date(record.timestamp),
                    intervalHours: record.intervalHours,
                }));

                await EnergyGenerationRecord.insertMany(recordsToInsert);

                console.log(
                    ` Synced ${recordsToInsert.length} new records for ${solarUnit.serialNumber}`
                );
            } else {
                console.log(
                    ` No new records for ${solarUnit.serialNumber}`
                );
            }
        }

        next();

    } catch (error) {
        console.error("Error in sync middleware:", error);
        next(error);
    }
};

