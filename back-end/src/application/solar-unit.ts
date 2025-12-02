import { v4 as uuidv4 } from "uuid";
import { SolarUnit } from "../infrastructure/entities/SolarUnit";
import e, { Request, Response, NextFunction } from "express";
import { z } from 'zod';
import { CreateSolarUnit, UpdateSolarUnit } from "../domen/dto/Solar-unit";
import { NotFoundError, ValidationError } from "../domen/error/Error";
import { User } from "../infrastructure/entities/User";
import { getAuth } from "@clerk/express";

export const getAllsolarUnits = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const solarunits = await SolarUnit.find();
        res.status(200).json(solarunits);
    } catch (error) {
        next(error);
    }
}
export const createSolarUnitValidator = (req: Request, res: Response, next: NextFunction) => {
    const result = CreateSolarUnit.safeParse(req.body);
    if (!result.success) {
        return next(new ValidationError(result.error.message));
    }
    next();
}

export const creatSolarUnit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: z.infer<typeof CreateSolarUnit> = req.body;
        const { serialNumber, installationDate, capacity, status } = data;

        const newsolarUnit = {
            serialNumber: data.serialNumber,
            installationDate: new Date(data.installationDate),
            capacity: data.capacity,
            status: data.status,
        };

        const creatSolarUnit = await SolarUnit.create(newsolarUnit);
        res.status(201).json(creatSolarUnit);
    } catch (error) {
        next(error);
    }
}

export const getsolarUnitById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const solarunit = await SolarUnit.findById(id);

        if (!solarunit) {
            return res.status(404).json({ message: "Solar unit not found." })
        }
        res.status(201).json(solarunit);
    } catch (error) {
        next(error);
    }
}
export const getSolarUnitByClerkId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth=getAuth(req);
        const clerkUserId=auth.userId;
        const solarUnits = await User.findOne({ clerkUserId });
        if (!solarUnits) {
            throw new NotFoundError("User not found.");
        }
        const solarunits = await SolarUnit.find({ userId: solarUnits._id });
        res.status(200).json(solarunits[0]);
    }
    catch (error) {
        next(error);
    }
}
export const updatesolarUnitValidator = (req: Request, res: Response, next: NextFunction) => {
    const result = UpdateSolarUnit.safeParse(req.body);
    if (!result.success) {
        return next(new ValidationError(result.error.message));
    }
    next();
}
export const updatesolarUnit = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data: z.infer<typeof UpdateSolarUnit> = req.body;
    const { serialNumber, installationDate, capacity, status } = data;
    const solarUnit = await SolarUnit.findById(id);

    if (!solarUnit) {
        return res.status(404).json({ message: "Solar unit not found." })
    }

    const updatesolarUnit = await SolarUnit.findByIdAndUpdate(id, {
        serialNumber: data.serialNumber,
        installationDate: data.installationDate,
        capacity: data.capacity,
        status: data.status,
    });
    res.status(200).json(updatesolarUnit);
};
export const deletesolarUnit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const solarunit = await SolarUnit.findById(id);

        if (!solarunit) {
            return res.status(404).json({ message: "Solar unit not found." })
        }
        await SolarUnit.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
export const getSolarStatusStats = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const stats = await SolarUnit.aggregate([
            {
                $group:{
                    _id:"$status",
                    count:{$sum:1}
                }
            }
        ]);
        const result: { [key: string]: number } = {
            active: 0,
            inactive: 0,
            maintenance: 0
        };
        
        stats.forEach(stat => {
            const status = stat._id.toLowerCase();
            if (status in result) {
                result[status] = stat.count;
            }
        });
        
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
export const getAllsolarUnitssum = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const solarunits = await SolarUnit.aggregate([
            {
                $count: "totalSolarUnits"
            }
        ]);
        const total = solarunits.length > 0 ? solarunits[0].totalSolarUnits : 0;
        res.status(200).json({ totalSolarUnits: total });
    }catch (error) {
        next(error);
    }
};