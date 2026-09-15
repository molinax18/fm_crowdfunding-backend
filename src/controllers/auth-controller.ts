import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { authService } from "../services/auth-service.js";
import { validateToken, type IUserToken } from "../utils/jwt-util.js";
import { validateUser } from "../validations/user-validation.js";
import { validateAuthUser } from "../validations/auth-validation.js";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const input = req.body;
      const { success, error, data } = validateUser(input);

      if (!success) {
        return res.status(400).json({
          data: "Please complete all the fields",
          details: error.issues.map(({ code, message, path }) => ({
            path,
            code,
            message,
          })),
        });
      }

      const user = await authService.register(data);

      if (!user) {
        return res.status(409).json({
          message: "The account is already registered",
        });
      }

      return res.status(201).json(user);
    } catch {
      res.status(500).json({ message: "Something was wrong" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const input = req.body;
      const { success, error, data } = validateAuthUser(input);

      if (!success) {
        return res.status(400).json({
          data: "Please send a valid fields",
          details: error.issues.map(({ code, message, path }) => ({
            path,
            code,
            message,
          })),
        });
      }

      const token = await authService.login(data);

      if (!token) {
        return res.status(401).json({ result: "Invalid email or password" });
      }

      return res.status(200).json({
        message: "Logged successfully",
        accessToken: token,
      });
    } catch {
      res.status(500).json({ message: "Something was wrong" });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const authHeader = req.get("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ error: "Missing or malformed Authorization header" });
      }

      const oldToken = authHeader.split(" ")[1] ?? "";
      const { refreshToken } = req.body;
      const { actualToken } = (await validateToken(refreshToken)) as JwtPayload;
      const user = (await validateToken(actualToken)) as IUserToken;

      if (oldToken !== actualToken) {
        return res.status(403).json({ mesage: "Token doesn't match" });
      }

      await authService.refreshToken({ id: user.id, email: user.email });
      res.status(200).json({ token: "New token generated" });
    } catch {
      res.status(500).json({ message: "Something was wrong" });
    }
  }
}

export const authController = new AuthController();
