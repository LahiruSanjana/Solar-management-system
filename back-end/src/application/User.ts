import { Request,Response,NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { User } from "../infrastructure/entities/User";
import { updatedUser } from "../domen/dto/User";
import { ValidationError } from "../domen/error/Error";
import { z } from "zod";

export const getAllUsers=async(
    req:Request,
    res:Response,
    next:NextFunction
) =>{
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}
export const updateUserValidator=(
    req:Request,
    res:Response,
    next:NextFunction
) =>{
    const result = updatedUser.safeParse(req.body);
    if (!result.success) {
        return next(new ValidationError(result.error.message));
    }
    next();
}
export const updateUser=async(
    req:Request,
    res:Response,
    next:NextFunction
) =>{
    try {
        const {userId} = req.params;
        const updateData:z.infer<typeof updatedUser>=req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (updateData.userId) {
            const userWithSameClerkId = await User.findOne({ clerkUserId: updateData.userId });
            if (userWithSameClerkId && userWithSameClerkId._id.toString() !== userId) {
                return res.status(400).json({ message: "clerkUserId already in use" });
            }
            user.clerkUserId = updateData.userId;
        }

        if (req.body.role) {
            const auth = getAuth(req);
            const role = (auth.sessionClaims?.meteadata as any)?.role;
            if (role !== "admin") {
                return res.status(403).json({ message: "Only admins can update roles" });
            }
            user.role = updateData.role;
        }

        user.firstname = updateData.firstname;
        user.lastname = updateData.lastname;
        user.phoneNo = updateData.phoneNo;
        user.address = updateData.address;
        user.email = updateData.email;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const deleteUser=async(  
    req:Request,
    res:Response,
    next:NextFunction
) =>{
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }   
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
}