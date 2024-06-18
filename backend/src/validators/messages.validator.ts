import { body } from "express-validator";

export const messagesValidator = () => {
  return [
    body("content")
      .trim()
      .optional()
      .notEmpty()
      .withMessage("content is required"),
  ];
};
