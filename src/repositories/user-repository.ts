import type { TUserInput } from "../validations/user-validation.js";
import { User, type TUser } from "../schemas/user-schema.js";

class UserRepository {
  async create(user: TUserInput) {
    try {
      const newUser = await User.create({ ...user });
      return newUser;
    } catch (error) {
      throw new Error("Cannot create the resource", { cause: error });
    }
  }

  async update(userId: string, user: Partial<TUser>) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: userId,
          active: true,
        },
        {
          $set: { ...user },
        },
      ).exec();
      return updatedUser;
    } catch (error) {
      throw new Error("Cannot access to the resource", { cause: error });
    }
  }

  async getByEmail(email: string) {
    try {
      const user = await User.findOne({ email, active: true }).exec();
      return user;
    } catch (error) {
      throw new Error("Cannot access to the resource", { cause: error });
    }
  }

  async getById(id: string) {
    try {
      const user = await User.findOne({ _id: id, active: true }).exec();
      return user;
    } catch (error) {
      throw new Error("Cannot access to the resource", { cause: error });
    }
  }

  async softDeleteById(id: string) {
    try {
      const deletedUser = await User.findOneAndUpdate(
        { _id: id, active: true },
        { active: false },
      ).exec();
      return deletedUser;
    } catch (error) {
      throw new Error("Cannot delete the resource", { cause: error });
    }
  }
}

export const userRepository = new UserRepository();
