import { Request } from "express";
import { body } from "express-validator";

const userRegisterValidator = (): any => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("invalid email address"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLowercase()
      .withMessage("username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("username must contain at least 3 characters"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 4 })
      .withMessage("password must contain at least 4 characters"),
  ];
};

const userLoginValidator = (): any => {
  return [
    body("userId").trim().notEmpty().withMessage("userId is required"),
    body("password").trim().notEmpty().withMessage("password is required"),
  ];
};

export { userRegisterValidator, userLoginValidator };
