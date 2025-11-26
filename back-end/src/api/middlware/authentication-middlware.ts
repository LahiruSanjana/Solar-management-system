import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../../domen/error/Error";

const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth=getAuth(req);
    if(!auth.userId){
        throw new UnauthorizedError("Unauthorized - No valid session token found");
    }
    next();
};

export default authenticationMiddleware;