import { UnauthorizedError, ForbiddenError } from "../../domen/error/Error";
import { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express"; 

export type ClerkPublicMetadata = {
  role?: "admin" | "staff";
}
const authorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized - No valid session token found");
    }

    const user = await clerkClient.users.getUser(auth.userId);
    
    const metadata = user.publicMetadata as ClerkPublicMetadata;

    console.log("Fetched User Metadata directly:", metadata); 

    if (!metadata || !metadata.role) {
      throw new ForbiddenError("Forbidden - No role metadata found");
    }

    if (metadata.role !== "admin") {
      throw new ForbiddenError("Forbidden - You do not have permission to access this resource");
    }

    next();
  } catch (error) {
    next(error); 
  }
};

export default authorizationMiddleware;