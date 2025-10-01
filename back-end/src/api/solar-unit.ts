import express from "express";
import {
    getAllsolarUnits,
    creatSolarUnit,
    getsolarUnitById,
    updatesolarUnit,
    deletesolarUnit
} from "../application/solar-unit";

const solarUnitRouter = express.Router();

solarUnitRouter.route("/").get(getAllsolarUnits).post(creatSolarUnit);

solarUnitRouter
    .route("/:id")
    .get(getsolarUnitById)
    .put(updatesolarUnit)
    .delete(deletesolarUnit);
     
export default solarUnitRouter;