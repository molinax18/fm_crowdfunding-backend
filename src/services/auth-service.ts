import type { TUserInput } from "../validations/user-validation.js";
import type { TUserAuthInput } from "../validations/auth-validation.js";
import { userRepository } from "../repositories/user-repository.js";
import { compare } from "../utils/encrypt-util.js";
import { signToken, type IUserToken } from "../utils/jwt-util.js";
import { otpService } from "./otp-service.js";
import { userService } from "./user-service.js";

class AuthService {
  async register(data: TUserInput) {
    try {
      const userExists = await userService.getByEmail(data.email);

      if (userExists) {
        return null;
      }

      const user = await userService.create(data);
      await otpService.create(user.email);

      return user;
    } catch (error) {
      throw new Error("Cannot register the user", { cause: error });
    }
  }

  async login(data: TUserAuthInput) {
    const user = await userRepository.getByEmail(data.email);

    if (!user) {
      return null;
    }

    const isValidPassword = await compare(data.password, user.password);

    if (!isValidPassword) {
      return null;
    }

    const newToken = signToken({
      email: user.email,
      id: user._id.toString(),
    });

    return newToken;
  }

  async refreshToken(val: IUserToken) {
    return signToken(val);
  }
}

export const authService = new AuthService();
