import { group } from 'console';
import {z} from 'zod';

export const CreateSolarUnit = z.object({
    serialNumber: z.string().min(1),
    installationDate: z.string().datetime(),
    capacity: z.number().positive(),
    status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]).default("ACTIVE"),
});

export const UpdateSolarUnit = z.object({
    serialNumber: z.string().min(1).optional(),
    installationDate: z.string().datetime().optional(),
    capacity: z.number().positive().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]).optional(),
});

export const deletesolarUnit=z.object({
    id:z.string().min(1),
});

export const GetAllEnergyGenerationRecordsSolarUnitDto = z.object({
    groupBy: z.enum(["date"]).optional(),
    limit: z.string().min(1).optional(),
});
export const GetEnergyGenerationRecordBy24hoursDataDto = z.object({
    groupBy: z.enum(["date", "time", "datetime"]).optional(),
    limit: z.string().min(1).optional(),
});
