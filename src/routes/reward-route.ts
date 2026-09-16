import { Router } from "express";
import { rewardController } from "../controllers/reward-controller.js";
import { validateToken } from "../middlewares/jwt-middleware.js";

export const rewardRouter = Router();

rewardRouter.get("/", rewardController.getAll);
rewardRouter.post("/", validateToken, rewardController.create);
rewardRouter.delete("/:id", rewardController.deleteById);
