import { Types } from "mongoose";
import type { TReward } from "../schemas/reward-schema.js";

type TSeedReward = TReward & {
  created_by: Types.ObjectId;
};

export const rewards: TSeedReward[] = [
  {
    created_by: new Types.ObjectId("6aa9a0d07a2ba281c1770877"),
    title: "Bamboo Stand Ultimate Ultimate Edition",
    description: "An ergonomic stand made of natural bamboo.",
    min_pledge: 999,
    remaining: 2,
    active: true,
  },
];
