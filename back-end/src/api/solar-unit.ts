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
    getAllsolarUnitssum
} from "../application/solar-unit";
import authenticationMiddleware from "./middlware/authentication-middlware";
import authorizationMiddleware from "./middlware/authorization-middlware";
const solarUnitRouter = express.Router();

// Temporarily remove authorization middleware for testing
solarUnitRouter.route("/").get(authenticationMiddleware,authorizationMiddleware,getAllsolarUnits).post(createSolarUnitValidator,creatSolarUnit);
solarUnitRouter.route("/me").get(authenticationMiddleware,getSolarUnitByClerkId);
solarUnitRouter.route("/stats").get(getSolarStatusStats);
solarUnitRouter.route("/total").get(getAllsolarUnitssum);
solarUnitRouter
    .route("/:id")
    .get(authenticationMiddleware,getsolarUnitById)
    .put(authenticationMiddleware,updatesolarUnit)
    .delete(authenticationMiddleware,deletesolarUnit);



export default solarUnitRouter;