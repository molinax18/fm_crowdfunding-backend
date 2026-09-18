import { signToken, validateToken } from "../../../src/utils/jwt-util.js";

describe("Token validations ", () => {
  it("Generate a user token", async () => {
    const user = {
      id: "123456",
      email: "test@test.com",
    };
    const token = signToken(user);

    expect(token).not.toBe(user);
  });

  it("Return the user email who created the token", async () => {
    const user = {
      id: "123456",
      email: "test@test.com",
    };
    const { token } = signToken(user);
    const { email } = await validateToken(token);

    expect(email).toBe(user.email);
  });
});
