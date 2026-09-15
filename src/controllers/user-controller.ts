import type { Response, Request } from "express";
import { userService } from "../services/user-service.js";

class UserController {
  async softDeleteById(req: Request, res: Response) {
    try {
      const userId = req.headers.user_id as string;
      await userService.softDeleteById(userId);

      res.status(204).send();
    } catch {
      res.status(500).json({ message: "Something was wrong" });
    }
  }
}

export const userController = new UserController();
