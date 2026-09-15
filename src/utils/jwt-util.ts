import jwt from "jsonwebtoken";
import "dotenv/config";

export interface IUserToken {
  email: string;
  id: string;
}

function getSecretKey() {
  const key = process.env.JWT_SECRET;

  if (!key) {
    throw new Error("JWT_SECRET is not configured");
  }

  return key;
}

export function signToken(val: IUserToken) {
  const token = jwt.sign(val, getSecretKey(), {
    expiresIn: "30m",
    algorithm: "HS256",
  });
  const refreshToken = jwt.sign({ token }, getSecretKey(), {
    expiresIn: "7d",
    algorithm: "HS256",
  });

  return {
    token,
    refreshToken,
  };
}

export async function validateToken(token: string) {
  try {
    const decoded = jwt.verify(token, getSecretKey());
    return decoded;
  } catch (error) {
    throw new Error("Error with the token validation", { cause: error });
  }
}
