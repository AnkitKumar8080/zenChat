import { sign, verify } from "jsonwebtoken";
import { BadTokenError, InternalError, TokenExpiredError } from "./ApiError";
import { tokenInfo } from "../config";

export class JwtPayload {
  aud: string;
  sub: string;
  iss: string;
  iat: number;
  exp: number;

  constructor(
    issuer: string,
    audience: string,
    subject: string,
    validity: number
  ) {
    this.iss = issuer;
    this.aud = audience;
    this.sub = subject;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + validity;
  }
}

// create token from jwt
const generateToken = async (payload: JwtPayload): Promise<string> => {
  if (!tokenInfo.jwtSecretKey)
    throw new InternalError("required jwt secret key");

  return new Promise<string>((resolve, reject) => {
    sign({ ...payload }, tokenInfo.jwtSecretKey, (err, token) => {
      if (err) reject(err);
      resolve(token as string);
    });
  });
};

// verify and return the decoded token payload
const validateToken = async (token: string): Promise<JwtPayload> => {
  if (!token) throw new InternalError("no token provided");
  try {
    return new Promise<JwtPayload>((resolve, reject) => {
      verify(token, tokenInfo.jwtSecretKey, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded as JwtPayload);
      });
    });
  } catch (e: any) {
    if (e && e.name === "TokenExpiredError") throw new TokenExpiredError();
    // throws error if other error occurs
    throw new BadTokenError();
  }
};

// return the decoded token payload even if token is expired
const decodeToken = async (token: string): Promise<JwtPayload> => {
  if (!token) throw new InternalError("no token provided");

  try {
    const options = {
      ignoreExpiration: true,
    };
    return new Promise<JwtPayload>((resolve, reject) => {
      verify(token, tokenInfo.jwtSecretKey, options, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded as JwtPayload);
      });
    });
  } catch (error) {
    throw new BadTokenError();
  }
};

export default {
  generateToken,
  validateToken,
  decodeToken,
};
