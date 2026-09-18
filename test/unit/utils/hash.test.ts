import { encrypt, compare } from "../../../src/utils/encrypt-util.js";

describe("Hashing test cases", () => {
  it("Not plain password", async () => {
    const value = "123456";
    const hash = await encrypt(value);

    expect(hash).not.toBe(value);
  });

  it("Compare the value with hashed password to validate it", async () => {
    const value = "123456";
    const hash = await encrypt(value);

    expect(await compare(value, hash)).toBe(true);
  });
});
