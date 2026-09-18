import type { Response, Request } from "express";
import { otpService } from "../services/otp-service.js";

class OtpController {
  async getAll(_req: Request, res: Response) {
    try {
      const otps = await otpService.getAll();

      res.status(200).json({ result: otps });
    } catch {
      res.status(500).json({ message: "Something was wrong" });
    }
  }
}

export const otpController = new OtpController();
