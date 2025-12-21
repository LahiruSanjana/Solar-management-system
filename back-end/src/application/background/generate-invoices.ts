import cron from "node-cron";
import mongoose from "mongoose";
import { SolarUnit } from "../../infrastructure/entities/SolarUnit";
import { Invoice } from "../../infrastructure/entities/Invoice";
import { EnergyGenerationRecord } from "../../infrastructure/entities/EnergyGenerationRecode"; 
import { endOfDay, startOfDay, subMonths, getDate } from "date-fns";

const generateInvoices = async () => {
    console.log(" CRON START: Checking for invoices to generate...");
    
    try {
        const activeUnits = await SolarUnit.find({ status: "ACTIVE" });
        console.log(`Found ${activeUnits.length} active units.`);
        
        const now = new Date();
        const currentDay = getDate(now); 

        for (const unit of activeUnits) {
            if (!unit.installationDate) {
                continue;
            }

            const installationDay = getDate(new Date(unit.installationDate));
            if (currentDay === installationDay) {
                const periodEnd = endOfDay(now);
                const periodStart = startOfDay(subMonths(now, 1));
                const existingInvoice = await Invoice.findOne({
                    solarUnitId: unit._id,
                    billingPeriodStart: periodStart 
                });
                if (existingInvoice) {
                    console.log(`⚠️ SKIPPING: Invoice already exists for Unit ${unit.serialNumber} (Period: ${periodStart.toISOString()})`);
                    continue; 
                }

                console.log(`🚀 Processing New Invoice for Unit: ${unit.serialNumber}`);
                const aggregation = await EnergyGenerationRecord.aggregate([
                    { 
                        $match: {
                            solarUnitId: unit._id,
                            timestamp: { $gte: periodStart, $lte: periodEnd } 
                        }
                    },
                    { 
                        $group: {
                            _id: null,
                            totalEnergy: { $sum: { $divide: [ "$generatedEnergy", 1000 ] } } 
                        }
                    }
                ]);

                const totalKwh = aggregation.length > 0 ? aggregation[0].totalEnergy : 0;
                await Invoice.create({
                    solarUnitId: unit._id,
                    userId: unit.userId,
                    billingPeriodStart: periodStart,
                    billingPeriodEnd: periodEnd,
                    totalEnergyGenerated: totalKwh,
                    amount: totalKwh * 40, 
                    paymentStatus: "PENDING"
                });

                console.log(`✅ SUCCESS: Invoice Created for Unit ${unit.serialNumber}`);
            }
        }
    } catch (error) {
        console.error("❌ CRON ERROR: Failed to generate invoices", error);
    }
};

export const startInvoiceScheduler = () => {
    cron.schedule("0 0 * * *", generateInvoices);
    
    console.log("🕒 Invoice Generation Job Scheduled");
};