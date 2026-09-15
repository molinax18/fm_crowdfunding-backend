import { Router } from "express";
import { validateToken } from "../middlewares/jwt-middleware.js";
import { userController } from "../controllers/user-controller.js";

export const userRouter = Router();

userRouter.delete("/", validateToken, userController.softDeleteById);
