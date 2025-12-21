import express from "express";
import {
    getAllsolarUnits,
    creatSolarUnit,
    getsolarUnitById,
    getSolarUnitByClerkId,
    updatesolarUnit,
    deletesolarUnit,
    createSolarUnitValidator,
    getSolarStatusStats,
    getAllsolarUnitssum,
    updateSolarUnitValidator
} from "../application/solar-unit";
import authenticationMiddleware from "./middlware/authentication-middlware";
import authorizationMiddleware from "./middlware/authorization-middlware";
import syncMiddleware from "./middlware/sync/syncMiddlware";
const solarUnitRouter = express.Router();

solarUnitRouter.route("/").get(authenticationMiddleware,authorizationMiddleware,getAllsolarUnits).post(createSolarUnitValidator,creatSolarUnit);
solarUnitRouter.route("/me").get(authenticationMiddleware,syncMiddleware,getSolarUnitByClerkId);
solarUnitRouter.route("/stats").get(getSolarStatusStats);
solarUnitRouter.route("/total").get(getAllsolarUnitssum);
solarUnitRouter
    .route("/:id")
    .get(authenticationMiddleware,authorizationMiddleware,getsolarUnitById)
    .put(authenticationMiddleware,authorizationMiddleware,updateSolarUnitValidator,updatesolarUnit)
    .delete(authenticationMiddleware,authorizationMiddleware,deletesolarUnit);



export default solarUnitRouter;