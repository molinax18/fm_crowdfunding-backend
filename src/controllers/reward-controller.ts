import type { Request, Response } from "express";
import type { TRewardInput } from "../validations/reward-validation.js";
import { Types } from "mongoose";
import { rewardService } from "../services/reward-service.js";

class RewardController {
  async getAll(_req: Request, res: Response) {
    try {
      const rewards = await rewardService.getAll();
      res.status(200).json({ result: rewards });
    } catch {
      res.status(500).json({ message: "Something was wrong" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const reward = req.body;
      const userId = req.headers.user_id as string;
      const newReward = await rewardService.create(
        reward,
        new Types.ObjectId(userId),
      );

      return res.status(201).json(newReward);
    } catch {
      res.status(500).json({ message: "Something was wrong" });
    }
  }

  async modifyByUserCreatorId(req: Request, res: Response) {
    try {
      const reward = req.body;
      const userId = req.headers.user_id as string;
      const { id } = req.params;

      const response = await rewardService.modifyByUserCreatorId(
        userId,
        id as string,
        reward as Partial<TRewardInput>,
      );

      if (!response) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.status(200).json({ result: response });
    } catch {
      res.status(500).json({ message: "Something was wrong" });
    }
  }

  async hardDeleteByUserCreatorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.headers.user_id as string;

      const response = await rewardService.hardDeleteByUserCreatorId(
        userId,
        id as string,
      );

      if (!response) {
        return res.status(404).json({ message: "Resource not found" });
      }

      res.status(200).json({ result: response });
    } catch {
      res.status(500).json({ message: "Something was wrong" });
    }
  }
}

export const rewardController = new RewardController();
