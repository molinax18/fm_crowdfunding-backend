import type { JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { validateToken as validate } from "../utils/jwt-util.js";
import { userRepository } from "../repositories/user-repository.js";

export async function validateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or malformed Authorization header" });
  }

  const token = authHeader.split(" ")[1];
  const data = (await validate(token ?? "")) as JwtPayload;
  const user = await userRepository.getById(data.id);

  if (!data || !user?.active) {
    return res.status(401).json({ error: "Unauthenticated user" });
  }

  req.headers.user_id = data.id;
  next();
}
