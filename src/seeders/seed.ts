import { rewards } from "./rewards.js";
import { Reward } from "../schemas/reward-schema.js";

export async function seedDatabase() {
  try {
    await Reward.deleteMany().exec();
    await Reward.insertMany(rewards);
  } catch (error) {
    throw new Error("Something is wrong with the seed database", {
      cause: error,
    });
  }
}
