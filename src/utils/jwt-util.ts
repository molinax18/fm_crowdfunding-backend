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

export function validateToken(token: string): Promise<IUserToken> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getSecretKey(), (err, decoded) => {
      if (err) {
        return reject(err);
      }

      resolve(decoded as IUserToken);
    });
  });
}
