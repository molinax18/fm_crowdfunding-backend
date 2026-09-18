import { Otp, type TOtp } from "../schemas/otp-schema.js";

class OtpRepository {
  async getAll() {
    try {
      const otps = await Otp.find({}).exec();
      return otps;
    } catch (error) {
      throw new Error("Cannot access the resource", { cause: error });
    }
  }

  async create(otp: TOtp) {
    try {
      const newOtp = await Otp.create({ ...otp });
      return newOtp;
    } catch (error) {
      throw new Error("Cannot create the resource", { cause: error });
    }
  }

  async getByEmail(email: string) {
    try {
      const findedOtp = await Otp.findOne({ email }).exec();
      return findedOtp;
    } catch (error) {
      throw new Error("Cannot access the resource", { cause: error });
    }
  }
}

export const otpRepository = new OtpRepository();
