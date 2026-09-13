import express, { json } from "express";
import { rewardRouter } from "./routes/reward-route.js";
import "dotenv/config";

const PORT = process.env.PORT ?? 3000;
const app = express();
app.use(json());

app.use("/api/reward", rewardRouter);
app.listen(PORT);
