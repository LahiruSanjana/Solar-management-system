import mongoose from "mongoose";
import { resolve } from "path";

const userSchema = new mongoose.Schema({
   firstname: {
  },
  lastname: {
    type: String,
  },
  role:{
    type: String,
    enum: ["admin", "staff"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
  },
});

export const User = mongoose.model("User", userSchema);