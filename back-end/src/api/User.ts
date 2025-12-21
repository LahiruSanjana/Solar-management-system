import express  from "express";
import { getAllUsers } from "../application/User";
import authenticationMiddleware from "./middlware/authentication-middlware";
import authorizationMiddleware from "./middlware/authorization-middlware";
import solarUnitRouter from "./solar-unit";
const userRouter=express.Router();

userRouter.route("/").get(authorizationMiddleware,authenticationMiddleware,getAllUsers);

export default userRouter;