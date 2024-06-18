import express, { Request, Response, NextFunction } from "express";
import { login, logout, signUp } from "../controllers/user.controller";
import {
  userLoginValidator,
  userRegisterValidator,
} from "../validators/user.validators";
import { validate } from "../validators/validate";

const router = express.Router();

router.post("/register", userRegisterValidator(), validate, signUp);
router.post("/login", userLoginValidator(), validate, login);
router.post("/logout", logout);

export default router;
