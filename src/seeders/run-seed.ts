import mongoose from "mongoose";
import { connectToMongo } from "../lib/db.js";
import { seedDatabase } from "./seed.js";

try {
  await connectToMongo();
  await seedDatabase();
} finally {
  await mongoose.disconnect();
}
