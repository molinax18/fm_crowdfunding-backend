import { Router } from "express";
import { rewardController } from "../controllers/reward-controller.js";
import { validateToken } from "../middlewares/jwt-middleware.js";
import { validateBody } from "../middlewares/body-middleware.js";
import {
  compiledPartialReward,
  compiledReward,
} from "../validations/reward-validation.js";
import { validateObjectId } from "../middlewares/object_id-middleware.js";

export const rewardRouter = Router();

rewardRouter.get("/", rewardController.getAll);
rewardRouter.post(
  "/",
  validateToken,
  validateBody(compiledReward),
  rewardController.create,
);
rewardRouter.put(
  "/:id",
  validateToken,
  validateBody(compiledPartialReward),
  validateObjectId,
  rewardController.modifyByUserCreatorId,
);
rewardRouter.delete(
  "/:id",
  validateToken,
  validateObjectId,
  rewardController.hardDeleteByUserCreatorId,
);
