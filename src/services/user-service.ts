import { userRepository } from "../repositories/user-repository.js";

class UserService {
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
