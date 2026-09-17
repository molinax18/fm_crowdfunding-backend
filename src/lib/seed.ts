import mongoose from "mongoose";
import { connectToMongo } from "./db.js";
import { Reward } from "../schemas/reward-schema.js";
import { User } from "../schemas/user-schema.js";
import { rewards } from "../seeders/rewards.js";
import { users } from "../seeders/users-reward.js";

try {
  await connectToMongo();

  await Reward.deleteMany().exec();
  await User.deleteMany().exec();

  await User.insertMany(users);
  await Reward.insertMany(rewards);
} catch (error) {
  throw new Error("Something is wrong with the seed database", {
    cause: error,
  });
} finally {
  await mongoose.disconnect();
}
