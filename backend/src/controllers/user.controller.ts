import { Request, Response } from "express";
import asyncHandler from "../helpers/asyncHandler";
import userRepo from "../database/repositories/userRepo";
import { AuthFailureError, BadRequestError } from "../core/ApiError";
import { RoleCode } from "../database/model/Role";
import User from "../database/model/User";
import bcrypt from "bcrypt";
import { createTokens } from "./auth/authUtils";
import { filterUserData } from "../helpers/utils";
import { SuccessResponse } from "../core/ApiResponse";
import { cookieValidity, environment, tokenInfo } from "../config";

const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  const existingUserEmail = await userRepo.findByEmail(email);
  if (existingUserEmail) {
    throw new BadRequestError("email already exists");
  }

  const existingUserUsername = await userRepo.findByUsername(username);
  if (existingUserUsername) {
    throw new BadRequestError("username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // create a new user
  const user = await userRepo.create(
    {
      username,
      email,
      password: hashedPassword,
      avatarUrl: `https://s3bucket.bytenode.xyz/staticbucketstorage/public/images/avatar${
        // random number between 0 and 40
        Math.floor(Math.random() * (40 - 1 + 1)) + 1
      }.avif`,
    } as User,
    RoleCode.USER
  );

  const tokens = await createTokens(user);
  const userData = await filterUserData(user);

  new SuccessResponse("signup successful", {
    user: userData,
    tokens,
  }).send(res);
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { userId, password } = req.body;

  const user = await userRepo.findByEmailOrUsername(userId);
  if (!user) throw new BadRequestError("invalid email/username");

  if (!password) throw new BadRequestError("no credentials provided");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AuthFailureError("Invalid credentials");

  // just renamed the password to pass "password" var is used before
  const { password: pass, status, ...filteredUser } = user;

  const tokens = await createTokens(user);

  const options = {
    httpOnly: true,
    secure: environment === "production",
  };

  // attach the cookies to res object
  res
    .cookie("accessToken", tokens.accessToken, options)
    .cookie("refreshToken", tokens.refreshToken, options);

  new SuccessResponse("login successful", {
    user: filteredUser,
    tokens,
  }).send(res);
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  const options = {
    httpOnly: true,
    secure: environment === "production",
  };

  res.clearCookie("accessToken", options).clearCookie("refreshToken", options);

  new SuccessResponse("logout successful", {}).send(res, {});
});

export { signUp, login, logout };
