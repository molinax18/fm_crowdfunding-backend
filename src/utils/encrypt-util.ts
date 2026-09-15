import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function encryptPassword(val: string) {
  const hash = await bcrypt.hash(val, SALT_ROUNDS);
  return hash;
}

export async function comparePassword(val: string, hash: string) {
  const result = await bcrypt.compare(val, hash);
  return result;
}
