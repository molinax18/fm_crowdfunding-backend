import type { Types } from "mongoose";
import type { TRewardInput } from "../validations/reward-validation.js";
import { Reward } from "../schemas/reward-schema.js";

class RewardRepository {
  async create(reward: TRewardInput, userId: Types.ObjectId) {
    try {
      const newReward = await Reward.create({ ...reward, created_by: userId });
      return newReward;
    } catch (error) {
      throw new Error("Cannot create the resource", { cause: error });
    }
  }

  async modifyByUserCreatorId(
    userId: string,
    rewardId: string,
    reward: Partial<TRewardInput>,
  ) {
    try {
      return Reward.findOneAndUpdate(
        {
          _id: rewardId,
          created_by: userId,
        },
        {
          $set: { ...reward },
        },
        {
          returnDocument: "after",
          runValidators: true,
        },
      )
        .populate("created_by")
        .exec();
    } catch (error) {
      throw new Error("Cannot modify the resource", { cause: error });
    }
  }

  async hardDeleteByUserCreatorId(userId: string, rewardId: string) {
    try {
      return Reward.findOneAndDelete({
        _id: rewardId,
        created_by: userId,
      })
        .populate("created_by")
        .exec();
    } catch (error) {
      throw new Error("Cannot delete the resource", { cause: error });
    }
  }

  async getAll() {
    try {
      const rewards = await Reward.find({})
        .populate("created_by", "-_id name email")
        .exec();
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
