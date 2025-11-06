import mongoose from "mongoose";
import { SolarUnit } from "./entities/SolarUnit";
import { EnergyGenerationRecord } from "./entities/EnergyGenerationRecode";
import { User } from "./entities/User";
import dotenv from "dotenv";
import { connectDB } from "./db";
import moment from "moment-timezone";

dotenv.config();

async function seed() {
  try {
    // Connect to DB
    await connectDB();

    // Clear existing data
    await EnergyGenerationRecord.deleteMany({});
    await SolarUnit.deleteMany({});
    await User.deleteMany({});

    // Create a new user
    const user = await User.create({
      name: "Alice Example",
      email: "alice@example.com",
    });

    // Create a new solar unit linked to the user
    const solarUnit = await SolarUnit.create({
      userId: user._id,
      serialNumber: "SU-0001",
      installationDate: moment.tz("2025-08-01", "Asia/Colombo").toDate(),
      capacity: 5000,
      status: "ACTIVE",
    });

    // Create historical energy generation records from Aug 1, 2025 8pm UTC (Sri Lanka local time)
    const records = [];
    const startDate = moment.tz("2025-08-01T08:00:00Z", "Asia/Colombo");
    const endDate = moment.tz("2025-10-30T18:00:00Z", "Asia/Colombo");

    let currentDate = startDate.clone();
    let recordCount = 0;

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      const hour = currentDate.hour(); // Sri Lanka local hour
      const month = currentDate.month(); // 0-11

      // Base energy generation (seasonal adjustment)
      let baseEnergy = 3000;
      if (month >= 5 && month <= 7) {
        baseEnergy = 4000; // June-August
      } else if (month >= 2 && month <= 4) {
        baseEnergy = 3500; // March-May
      } else if (month >= 8 && month <= 10) {
        baseEnergy = 2500; // Sept-Nov
      } else {
        baseEnergy = 2000; // Dec-Feb
      }

      // Time-of-day adjustment
      let timeMultiplier = 1;
      if (hour >= 6 && hour <= 18) {
        timeMultiplier = 1.2;
        if (hour >= 10 && hour <= 14) {
          timeMultiplier = 1.5; // Peak sun hours
        }
      } else {
        timeMultiplier = 0; // Night time
      }

      // Random variation ±20%
      const variation = 0.8 + Math.random() * 0.4;
      const energyGenerated = Math.round(baseEnergy * timeMultiplier * variation);

      records.push({
        solarUnitId: solarUnit._id,
        timestamp: currentDate.toDate(), // Sri Lanka local time
        generatedEnergy: energyGenerated,
      });

      // Move to next 2-hour interval
      currentDate.add(2, "hours");
      recordCount++;
    }

    await EnergyGenerationRecord.insertMany(records);

    console.log(
      `Database seeded successfully. Generated ${recordCount} energy generation records from ${startDate.format(
        "YYYY-MM-DD HH:mm"
      )} to ${endDate.format("YYYY-MM-DD HH:mm")} (Sri Lanka time).`
    );
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
