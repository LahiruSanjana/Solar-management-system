import express from 'express';
import {
   getAllEnergyGenerationRecordsSolarUnit,
   getLast24HoursEnergyData
} from '../application/EnergyGenerationRecode';

const energyGenerationRecordRouter  = express.Router();

energyGenerationRecordRouter.route("/solar-unit/:solarUnitId").get( getAllEnergyGenerationRecordsSolarUnit);
energyGenerationRecordRouter.route("/solar-unit/:solarUnitId/last24").get(getLast24HoursEnergyData);

export default energyGenerationRecordRouter;
