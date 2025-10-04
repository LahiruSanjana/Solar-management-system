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