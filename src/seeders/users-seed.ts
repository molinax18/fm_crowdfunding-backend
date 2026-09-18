import { Types } from "mongoose";
import type { TUser } from "../schemas/user-schema.js";

type TSeedUser = TUser & {
  _id: Types.ObjectId;
};

export const users: TSeedUser[] = [
  {
    _id: new Types.ObjectId("6aa9a0d07a2ba281c1770877"),
    name: "Ariel Molina",
    email: "arielmolina8953@gmail.com",
    password: "$2b$10$K622mYM9A72WBe5nqHeTruLNxCbFR8d0FvGJp21YKhACGcZEsZcI6",
    active: true,
    verified: false,
  },
];
