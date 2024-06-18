import asyncHandler from "../helpers/asyncHandler";
import {
  AccessTokenError,
  AuthFailureError,
  BadTokenError,
  TokenExpiredError,
} from "../core/ApiError";
import JWT from "../core/JWT";
import userRepo from "../database/repositories/userRepo";
import { Types } from "mongoose";
import { ProtectedRequest } from "../types/app-request";
import { Response, NextFunction } from "express";

export const verifyJWT = asyncHandler(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new BadTokenError("No token provided");
    }

    try {
      const decodedToken = await JWT.decodeToken(token);
      const userData = await userRepo.findById(
        new Types.ObjectId(decodedToken.sub) // get the user details by passing userId(sub) from decoded token
      );

      if (!userData) {
        throw new AuthFailureError();
      }

      req.user = userData;

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new AccessTokenError(error.message);
      throw error;
    }
  }
);
