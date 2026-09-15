import { model, Schema, type Document } from "mongoose";

export type TReward = {
  title: string;
  description: string;
  min_pledge: number;
  remaining: number;
  isActive: boolean;
};

export interface IRewardSchema extends TReward, Document {}

const rewardSchema = new Schema<IRewardSchema>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    min_pledge: {
      type: Number,
      required: true,
      min: 0,
    },
    remaining: {
      type: Number,
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Reward = model<IRewardSchema>("reward", rewardSchema);
