import type { NextFunction, Request, Response } from "express";
import { validateToken as validate } from "../utils/jwt-util.js";
import { userService } from "../services/user-service.js";
import jwt from "jsonwebtoken";

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
    const user = await userService.getById(data.id);

    if (!user || !user.active) {
      return res.status(401).json({
        error: "This account does not exist or is inactive",
      });
    }

    req.headers.user_id = data.id;
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: "TOKEN_EXPIRED",
        message: "The token was expired",
        expired_at: error.expiredAt,
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        error: "INVALID_TOKEN",
        message: "Token invalid",
      });
    }

    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
