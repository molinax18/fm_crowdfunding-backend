import express, { json } from "express";
import { authRouter } from "../src/routes/auth-route.js";
import { rewardRouter } from "../src/routes/reward-route.js";
import { userRouter } from "../src/routes/user-route.js";
import { validateToken } from "../src/middlewares/jwt-middleware.js";
import { otpRouter } from "../src/routes/otp-route.js";
import { limiter } from "../src/utils/rate_limit-util.js";

export const app = express();
app.use(limiter);
app.use(json());

app.use("/api/reward", rewardRouter);
app.use("/api/user", validateToken, userRouter);
app.use("/api/auth", authRouter);
app.use("/api/otp", otpRouter);
