import type { Request, Response } from "express";
import { authService } from "../services/auth-service.js";
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
}

export const authController = new AuthController();
