import express from "express";
import {
    getAllsolarUnits,
    creatSolarUnit,
    getsolarUnitById,
    updatesolarUnit,
    deletesolarUnit,
    createSolarUnitValidator
} from "../application/solar-unit";

const solarUnitRouter = express.Router();

solarUnitRouter.route("/").get(getAllsolarUnits).post(createSolarUnitValidator).post(creatSolarUnit);

solarUnitRouter
    .route("/:id")
    .get(getsolarUnitById)
    .put(updatesolarUnit)
    .delete(deletesolarUnit);
     
export default solarUnitRouter;