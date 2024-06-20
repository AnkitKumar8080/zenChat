import { Response } from "express";
import { environment } from "../config";
import {
  AccessTokenErrorResponse,
  AuthFailureResponse,
  BadRequestResponse,
  InternalErrorResponse,
  NotFoundResponse,
  RateLimitResponse,
} from "./ApiResponse";

export enum ErrorType {
  BAD_TOKEN = "BadTokenError",
  TOKEN_EXPIRED = "TokenExpiredError",
  UNAUTHORIZED = "AuthFailureError",
  ACCESS_TOKEN = "AccessTokenError",
  INTERNAL = "InternalError",
  NOT_FOUND = "NotFoundError",
  NO_ENTRY = "NoEntryError",
  NO_DATA = "NoDataError",
  BAD_REQUEST = "BadRequestError",
  RATE_LIMIT = "RateLimitError",
  FORBIDDEN = "ForbiddenError",
}

export abstract class ApiError extends Error {
  constructor(
    public type: ErrorType,
    public message: string = "error",
    public stack = ""
  ) {
    super(type);
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public static handle(err: ApiError, res: Response): Response {
    switch (err.type) {
      case ErrorType.INTERNAL:
        return new InternalErrorResponse(err.message).send(res);

      case ErrorType.BAD_REQUEST:
        return new BadRequestResponse(err.message).send(res);

      case ErrorType.ACCESS_TOKEN:
        return new AccessTokenErrorResponse(err.message).send(res);

      case ErrorType.NOT_FOUND:
      case ErrorType.NO_ENTRY:
      case ErrorType.NO_DATA:
        return new NotFoundResponse(err.message).send(res);

      case ErrorType.TOKEN_EXPIRED:
      case ErrorType.BAD_TOKEN:
      case ErrorType.UNAUTHORIZED:
        return new AuthFailureResponse(err.message).send(res);

      case ErrorType.RATE_LIMIT:
        return new RateLimitResponse(err.message).send(res);

      // do not send failure message in production as it may send sensitive data
      default: {
        let message = err.message;
        if (environment === "production") message = "something went wrong";
        return new InternalErrorResponse(message).send(res);
      }
    }
  }
}

export class InternalError extends ApiError {
  constructor(message: string = "Internal Error") {
    super(ErrorType.INTERNAL, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = "Bad Request Error") {
    super(ErrorType.BAD_REQUEST, message);
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = "Rate Limit Error") {
    super(ErrorType.RATE_LIMIT, message);
  }
}

export class AuthFailureError extends ApiError {
  constructor(message: string = "invalid credentials") {
    super(ErrorType.UNAUTHORIZED, message);
  }
}

export class BadTokenError extends ApiError {
  constructor(message: string = "Bad Token Error") {
    super(ErrorType.BAD_TOKEN, message);
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message: string = "Token Expired Error") {
    super(ErrorType.TOKEN_EXPIRED, message);
  }
}

export class NoDataError extends ApiError {
  constructor(message: string = "No Data Error") {
    super(ErrorType.NO_DATA, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Not Found") {
    super(ErrorType.NOT_FOUND, message);
  }
}

export class AccessTokenError extends ApiError {
  constructor(message: string = "Access Token Error") {
    super(ErrorType.ACCESS_TOKEN, message);
  }
}
