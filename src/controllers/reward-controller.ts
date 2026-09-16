import type { Request, Response } from "express";
import { isValidObjectId, Types } from "mongoose";
import { rewardService } from "../services/reward-service.js";
import {
  type TRewardInput,
  validatePartialReward,
  validateReward,
} from "../validations/reward-validation.js";

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
      const input = req.body;
      const { success, error, data } = validateReward(input);

      if (!success) {
        return res.status(400).json({
          data: "Please complete all the fields",
          details: error.issues.map(({ code, message, path }) => ({
            path,
            code,
            message,
          })),
        });
      }

      const userId = req.headers.user_id as string;
      const newReward = await rewardService.create(
        data,
        new Types.ObjectId(userId),
      );

      return res.status(201).json(newReward);
    } catch {
      res.status(500).json({ message: "Something was wrong" });
    }
  }

  async modifyByUserCreatorId(req: Request, res: Response) {
    try {
      const input = req.body;
      const userId = req.headers.user_id as string;
      const { id } = req.params;

      const { success, error, data } = validatePartialReward(input);

      if (!success) {
        return res.status(400).json({
          data: "Please complete all the fields",
          details: error.issues.map(({ code, message, path }) => ({
            path,
            code,
            message,
          })),
        });
      }

      if (!isValidObjectId(id) || !isValidObjectId(userId)) {
        return res.status(400).json({ message: "Please send a valid id" });
      }

      const response = await rewardService.modifyByUserCreatorId(
        userId,
        id as string,
        data as Partial<TRewardInput>,
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

      if (!isValidObjectId(id) || !isValidObjectId(userId)) {
        return res.status(400).json({ message: "Please send a valid id" });
      }

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
