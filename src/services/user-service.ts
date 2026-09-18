import { userRepository } from "../repositories/user-repository.js";
import type { TUser } from "../schemas/user-schema.js";
import type { TUserInput } from "../validations/user-validation.js";
import { encrypt } from "../utils/encrypt-util.js";

class UserService {
  async create(data: TUserInput) {
    try {
      const hashed = await encrypt(data.password);
      const user = { ...data, password: hashed };
      const newUser = await userRepository.create(user);

      return newUser;
    } catch (error) {
      throw new Error("Cannot get the user", { cause: error });
    }
  }

  async getById(id: string) {
    try {
      const deletedUser = await userRepository.getById(id);
      return deletedUser;
    } catch (error) {
      throw new Error("Cannot get the user", { cause: error });
    }
  }

  async getByEmail(email: string) {
    try {
      const user = await userRepository.getByEmail(email);
      return user;
    } catch (error) {
      throw new Error("Cannot get the user", { cause: error });
    }
  }

  async update(userId: string, user: Partial<TUser>) {
    try {
      const validatedUser = await userRepository.update(userId, { ...user });
      return validatedUser;
    } catch (error) {
      throw new Error("Cannot update the user", { cause: error });
    }
  }

  async validateUser(email: string) {
    try {
      const user = await userRepository.getByEmail(email);

      if (!user) {
        throw new Error("Can't get the user");
      }

      const updatedUser = await userRepository.update(user.id, {
        verified: true,
      });
      return updatedUser;
    } catch (error) {
      throw new Error("Cannot get the user", { cause: error });
    }
  }

  async softDeleteById(id: string) {
    try {
      const deletedUser = await userRepository.softDeleteById(id);
      return deletedUser;
    } catch (error) {
      throw new Error("Cannot delete the user", { cause: error });
    }
  }
}

export const userService = new UserService();
