import express, { json } from "express";
import { connectToMongo } from "./lib/db.js";
import { authRouter } from "./routes/auth-route.js";
import { rewardRouter } from "./routes/reward-route.js";
import { userRouter } from "./routes/user-route.js";
import "dotenv/config";
import { validateToken } from "./middlewares/jwt-middleware.js";

const PORT = process.env.PORT ?? 3000;
const app = express();
app.use(json());

await connectToMongo();
app.use("/api/reward", rewardRouter);
app.use("/api/user", validateToken, userRouter);
app.use("/api/auth", authRouter);
app.listen(PORT);
