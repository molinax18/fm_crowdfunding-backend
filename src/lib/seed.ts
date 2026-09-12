import mongoose from "mongoose";
import { connectToMongo } from "./db.js";
import { Reward } from "../schemas/reward-schema.js";
import { rewards } from "../seeders/rewards.js";

try {
  await connectToMongo();
  await Reward.deleteMany().exec();
  await Reward.insertMany(rewards);
} catch (error) {
  throw new Error("Something is wrong with the seed database", {
    cause: error,
  });
} finally {
  await mongoose.disconnect();
}
