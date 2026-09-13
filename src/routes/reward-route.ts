import { Router } from "express";
import { rewardController } from "../controllers/reward-controller.js";

export const rewardRouter = Router();

rewardRouter.get("/", rewardController.getAll);
rewardRouter.delete("/:id", rewardController.deleteById);
