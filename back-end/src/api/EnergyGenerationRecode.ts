import express from 'express';
import {
   getAllEnergyGenerationRecordsSolarUnit,
   getLast24HoursEnergyData
} from '../application/EnergyGenerationRecode';
import authenticationMiddleware from './middlware/authentication-middlware';

const energyGenerationRecordRouter  = express.Router();

energyGenerationRecordRouter.route("/solar-unit/:solarUnitId").get(authenticationMiddleware, getAllEnergyGenerationRecordsSolarUnit);
energyGenerationRecordRouter.route("/solar-unit/:solarUnitId/last24").get(authenticationMiddleware, getLast24HoursEnergyData);

export default energyGenerationRecordRouter;
