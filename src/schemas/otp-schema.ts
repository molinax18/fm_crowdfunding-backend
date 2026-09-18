import { Schema, model, type Document } from "mongoose";
import "dotenv/config";

export type TOtp = {
  email: string;
  code: string;
};

const EXP_SECONDS = Number(process.env.OTP_EXP_SECONDS ?? 300);

export interface IOtp extends TOtp, Document {
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
    },
    code: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: EXP_SECONDS,
    },
  },
  {
    timestamps: true,
  },
);

export const Otp = model<IOtp>("otp", otpSchema);
