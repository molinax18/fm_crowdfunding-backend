import { rewardRepository } from "../repositories/reward-repository.js";

class RewardService {
  async getAll() {
    try {
      const rewards = await rewardRepository.getAll();
      return rewards;
    } catch (error) {
      throw new Error("Cannot resolve the service", { cause: error });
    }
  }

  async deleteById(id: string) {
    try {
      const rewards = await rewardRepository.deleteById(id);
      return rewards;
    } catch (error) {
      throw new Error("Cannot resolve the service", { cause: error });
    }
  }
}

export const rewardService = new RewardService();
