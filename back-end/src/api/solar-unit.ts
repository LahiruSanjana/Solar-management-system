import express from "express";
import {
    getAllsolarUnits,
    creatSolarUnit,
    getsolarUnitById,
    getSolarUnitByClerkId,
    updatesolarUnit,
    deletesolarUnit,
    createSolarUnitValidator,
} from "../application/solar-unit";
import authenticationMiddleware from "./middlware/authentication-middlware";
import authorizationMiddleware from "./middlware/authorization-middlware";
const solarUnitRouter = express.Router();

solarUnitRouter.route("/").get(authorizationMiddleware,authenticationMiddleware,getAllsolarUnits).post(createSolarUnitValidator).post(creatSolarUnit);
solarUnitRouter.route("/me").get(authenticationMiddleware,getSolarUnitByClerkId);
solarUnitRouter
    .route("/:id")
    .get(authorizationMiddleware,authenticationMiddleware,getsolarUnitById)
    .put(authorizationMiddleware,authenticationMiddleware,updatesolarUnit)
    .delete(authorizationMiddleware,authenticationMiddleware,deletesolarUnit);


     
export default solarUnitRouter;