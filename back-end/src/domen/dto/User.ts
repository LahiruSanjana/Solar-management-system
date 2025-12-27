import { z } from "zod";
export const updatedUser=z.object({
    firstname:z.string().min(1),
    lastname:z.string().min(1),
    role:z.enum(["admin","staff"]),
    phoneNo:z.string().min(1),
    address:z.string().min(1),
    email:z.string().email(),
    userId:z.string().min(1).optional(),
});