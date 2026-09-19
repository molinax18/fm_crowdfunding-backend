import type { Types } from "mongoose";
import type { TRewardInput } from "../validations/reward-validation.js";
import { rewardRepository } from "../repositories/reward-repository.js";
import { redisServer } from "../lib/redis-cache.js";

class RewardService {
  async getAll() {
    try {
      const value = await redisServer.client.get("rewards");

      if (value) {
        return JSON.parse(value);
      }

      const rewards = await rewardRepository.getAll();
      await redisServer.client.set("rewards", JSON.stringify(rewards));

      return rewards;
    } catch (error) {
      throw new Error("Cannot resolve the service", { cause: error });
    }
  }

  async modifyByUserCreatorId(
    userId: string,
    rewardId: string,
    reward: Partial<TRewardInput>,
  ) {
    try {
      const modifiedReward = await rewardRepository.modifyByUserCreatorId(
        userId,
        rewardId,
        reward,
      );
      await redisServer.client.del("rewards");

      return modifiedReward;
    } catch (error) {
      throw new Error("Cannot resolve the service", { cause: error });
    }
  }

  async hardDeleteByUserCreatorId(userId: string, rewardId: string) {
    try {
      const deletedReward = await rewardRepository.hardDeleteByUserCreatorId(
        userId,
        rewardId,
      );
      await redisServer.client.del("rewards");

      return deletedReward;
    } catch (error) {
      throw new Error("Cannot resolve the service", { cause: error });
    }
  }

  async create(reward: TRewardInput, userId: Types.ObjectId) {
    try {
      const newReward = await rewardRepository.create(reward, userId);
      await redisServer.client.del("rewards");

      return newReward;
    } catch (error) {
      throw new Error("Cannot resolve the service", { cause: error });
    }
  }
}

export const rewardService = new RewardService();
