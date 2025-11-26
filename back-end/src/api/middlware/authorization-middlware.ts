import { UnauthorizedError,ForbiddenError } from "../../domen/error/Error";
import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { publicMetadata } from "../../domen/type.js";

const authorizationMiddleware = (
    req: Request, 
    res: Response, 
    next: NextFunction) => {
    
        const auth = getAuth(req);
        if(!auth.userId){
            throw new UnauthorizedError("Unauthorized - No valid session token found");
        }

        const publicMetadata=auth.sessionClaims?.metadata as publicMetadata;
        if(publicMetadata.role !== "admin"){
            throw new ForbiddenError("Forbidden - You do not have permission to access this resource");
        }
        next();
}
export default authorizationMiddleware;
