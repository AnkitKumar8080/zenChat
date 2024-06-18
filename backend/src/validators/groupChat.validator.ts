import { body, param } from "express-validator";

export const createGroupChatValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("group name not provided"),
    body("participants")
      .isArray({
        min: 2,
        max: 100,
      })
      .withMessage(
        "participants must be between between 2 members and max of 100 participants"
      ),
  ];
};

export const updateGroupChatValidator = () => {
  return [
    param("chatId").notEmpty().withMessage("chatId not provided"),
    body("newParticipantId")
      .trim()
      .notEmpty()
      .withMessage("new participantId not provided"),
  ];
};
