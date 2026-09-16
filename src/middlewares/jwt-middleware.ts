import type { NextFunction, Request, Response } from "express";
import { validateToken as validate } from "../utils/jwt-util.js";
import { userService } from "../services/user-service.js";

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

  try {
    const token = authHeader.slice(7);
    const data = await validate(token);

    if (!data || !("id" in data)) {
      return res.status(401).json({
        error: "Invalid or expired token",
      });
    }

    const user = await userService.getById(data.id);

    if (!user || !user.active) {
      return res.status(401).json({
        error: "This account does not exist or is inactive",
      });
    }

    req.headers.user_id = data.id;
    return next();
  } catch {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
