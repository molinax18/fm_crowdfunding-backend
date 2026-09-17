import type { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";

export function validateObjectId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Please send a valid id" });
  }

  return next();
}
