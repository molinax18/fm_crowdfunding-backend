import { Router } from "express";
import { otpController } from "../controllers/otp-controller.js";

export const otpRouter = Router();

otpRouter.get("/", otpController.getAll);
