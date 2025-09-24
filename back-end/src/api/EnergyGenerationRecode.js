import express from 'express';
import {
   getAllEnergyGenerationRecordsSolarUnit
} from '../application/EnergyGenerationRecode.js';

const router = express.Router();

router.get('/:solarUnitId/records', getAllEnergyGenerationRecordsSolarUnit);

export default router;
