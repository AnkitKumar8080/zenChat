import { validationResult, ValidationError } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../core/ApiError";

const validate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    // if no errors then return next
    if (errors.isEmpty()) {
      return next();
    }

    // if errors
    const extractedErrors: { [key: string]: string }[] = errors
      .array()
      // @ts-ignore
      .map((err: ValidationError) => ({ [err.param]: err.msg }));
    const errorMsg = extractedErrors
      .map((err) => Object.values(err).join(", "))
      .join(", ");

    next(new BadRequestError(errorMsg));
  } catch (error) {
    next(error);
  }
};

export { validate };
