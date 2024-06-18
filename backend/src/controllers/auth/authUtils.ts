import { Types } from "mongoose";
import { tokenInfo } from "../../config";
import { AuthFailureError, InternalError } from "../../core/ApiError";
import JWT, { JwtPayload } from "../../core/JWT";
import User from "../../database/model/User";

export const splitAccessToken = (token: string) => {
  if (!token) throw new AuthFailureError("missing authorization token");

  if (!token.startsWith("Bearer "))
    throw new AuthFailureError("inalid authorization token");

  return token.split(" ")[1];
};

export const createTokens = async (
  user: User
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = await JWT.generateToken(
    new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      tokenInfo.accessTokenValidity
    )
  );

  if (!accessToken) throw new InternalError("Error creating access token");

  const refreshToken = await JWT.generateToken(
    new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      tokenInfo.refreshTokenValidity
    )
  );

  if (!refreshToken) throw new Error("Error creating refresh token");

  return {
    accessToken,
    refreshToken,
  };
};

export const validateTokenData = (payload: JwtPayload): boolean => {
  if (
    !payload ||
    !payload.iss ||
    !payload.aud ||
    !payload.sub ||
    payload.iss !== tokenInfo.issuer ||
    payload.aud !== tokenInfo.audience ||
    !Types.ObjectId.isValid(payload.sub)
  )
    throw new AuthFailureError("invalid access token");

  return true;
};
