import cron from 'node-cron';
import {SyncEnergyGenerationRecord} from '../application/background/SyncEnergyGenerationRecord';

export const initializeScheduler = () => {
  const schedule = process.env.SYNC_CRON_SCHEDULE || '0 0 * * *';

  cron.schedule(schedule, async () => {
    console.log(`[${new Date().toISOString()}] Starting daily energy generation records sync...`);
    try {
      await SyncEnergyGenerationRecord({} as any, {} as any, () => {});
      console.log(`[${new Date().toISOString()}] Daily sync completed successfully`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Daily sync failed:`, error);
    }
  });

  console.log(`[Scheduler] Energy generation records sync scheduled for: ${schedule}`);
};