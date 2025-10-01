import express from 'express';
import {
   getAllEnergyGenerationRecordsSolarUnit
} from '../application/EnergyGenerationRecode';

const energyGenerationRecordRouter  = express.Router();

energyGenerationRecordRouter.route("/solar-unit/:solarUnitId").get( getAllEnergyGenerationRecordsSolarUnit);

export default energyGenerationRecordRouter;
