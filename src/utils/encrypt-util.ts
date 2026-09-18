import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function encrypt(val: string) {
  const hash = await bcrypt.hash(val, SALT_ROUNDS);
  return hash;
}

export async function compare(val: string, hash: string) {
  const result = await bcrypt.compare(val, hash);
  return result;
}
