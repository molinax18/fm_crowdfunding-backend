import { Schema, model, type Document } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  password: string;
  active: boolean;
  verified: boolean;
};

export interface IUserSchema extends TUser, Document {}

const userSchema = new Schema<IUserSchema>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    active: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const User = model<IUserSchema>("user", userSchema);
