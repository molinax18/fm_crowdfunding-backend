import { connectToMongo } from "../lib/db.js";
import { Reward } from "../schemas/reward-schema.js";

await connectToMongo();

class RewardRepository {
  async getAll() {
    try {
      const rewards = await Reward.find({}).exec();
      return rewards;
    } catch (error) {
      throw new Error("Cannot access to the resource", { cause: error });
    }
  }

  async deleteById(id: string) {
    try {
      const deletedReward = await Reward.findByIdAndDelete(id, {
        returnDocument: "before",
      });
      return deletedReward;
    } catch (error) {
      throw new Error("Cannot delete the resource", { cause: error });
    }
  }
}

export const rewardRepository = new RewardRepository();
