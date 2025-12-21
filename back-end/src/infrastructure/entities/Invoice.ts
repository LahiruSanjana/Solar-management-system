import { time } from "console";
import mongoose from "mongoose";
import { de } from "zod/v4/locales";

const invoiceSchema = new mongoose.Schema({
    solarUnitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SolarUnit",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    billingPeriodStart: {
        type: Date,
        required: true,
    },
    billingPeriodEnd: {
        type: Date,
        required: true,
    },
    totalEnergyGenerated:{
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["PAID", "UNPAID", "PENDING"],
        default: "PENDING",
    },
    paidAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

export const Invoice = mongoose.model("Invoice", invoiceSchema);