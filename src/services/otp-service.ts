import { otpRepository } from "../repositories/otp-repository.js";
import { randomInt } from "crypto";
import { encrypt } from "../utils/encrypt-util.js";
import { emailService } from "./email-service.js";

class OtpService {
  async create(email: string) {
    try {
      const code = randomInt(100000, 999999).toString();
      const encriptedCode = await encrypt(code);
      const newOtp = await otpRepository.create({ email, code: encriptedCode });
      await emailService.sendEmail(email, code);

      return newOtp;
    } catch (error) {
      throw new Error("Cannot solve the resource", { cause: error });
    }
  }

  async getByEmail(email: string) {
    try {
      const findedOtp = await otpRepository.getByEmail(email);
      return findedOtp;
    } catch (error) {
      throw new Error("Cannot solve the resource", { cause: error });
    }
  }

  async getAll() {
    try {
      const otps = await otpRepository.getAll();
      return otps;
    } catch (error) {
      throw new Error("Cannot solve the resource", { cause: error });
    }
  }
}

export const otpService = new OtpService();
