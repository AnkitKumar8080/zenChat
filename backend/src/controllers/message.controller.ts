import { ProtectedRequest } from "../types/app-request";
import {
  AuthFailureError,
  BadRequestError,
  InternalError,
  NotFoundError,
} from "../core/ApiError";
import { SuccessMsgResponse, SuccessResponse } from "../core/ApiResponse";
import { Request, Response } from "express";
import { Types } from "mongoose";
import chatRepo from "../database/repositories/chatRepo";
import messageRepo from "../database/repositories/messageRepo";
import asyncHandler from "../helpers/asyncHandler";
import {
  getLocalFilePath,
  getStaticFilePath,
  removeLocalFile,
} from "../helpers/utils";
import { emitSocketEvent } from "../socket";
import { ChatEventEnum } from "../constants";
import Chat from "../database/model/Chat";

export const getAllMessages = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { chatId } = req.params;
    const currentUser = req.user;

    // retrieve the chat of corresponding chatId
    const selectedChat = await chatRepo.getChatByChatId(
      new Types.ObjectId(chatId)
    );

    // if not chat found throw an error
    if (!selectedChat) {
      throw new NotFoundError("no chat found to retrieve messages");
    }

    // check for existance of current user in the chats
    if (selectedChat.participants?.includes(currentUser?._id)) {
      throw new AuthFailureError("you don't own the chat !");
    }

    // get all the messages in aggreated form
    const messages = await messageRepo.getAllMessagesAggregated(
      new Types.ObjectId(chatId)
    );

    if (!messages) {
      throw new InternalError("error while retrieving messages");
    }

    return new SuccessResponse(
      "messages retrieved successfully",
      messages
    ).send(res);
  }
);

// send a message
export const sendMessage = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { content } = req.body;
    const { chatId } = req.params;

    const currentUserId = req.user?._id;
    const files = (req.files as { attachments?: Express.Multer.File[] }) || {
      attachments: [],
    };

    if (!chatId) {
      throw new BadRequestError("no chat  id provided");
    }

    if (!content && !files.attachments?.length) {
      throw new BadRequestError("no content provided");
    }

    const selectedChat = await chatRepo.getChatByChatId(
      new Types.ObjectId(chatId)
    );

    if (!selectedChat) {
      throw new NotFoundError("No  chat found");
    }

    // hold the files sent by user and creating url to access to it
    const attachmentFiles: { url: string; localPath: string }[] = [];

    files.attachments?.forEach((attachment) => {
      attachmentFiles.push({
        url: getStaticFilePath(attachment.filename),
        localPath: getLocalFilePath(attachment.filename),
      });
    });

    // create a new message with attachmentsFiles
    const message = await messageRepo.createMessage(
      new Types.ObjectId(currentUserId),
      new Types.ObjectId(chatId),
      content || "",
      attachmentFiles
    );

    // updating the last message of the chat
    const updatedChat = await chatRepo.updateChatFields(
      new Types.ObjectId(chatId),
      { lastMessage: message._id }
    );

    // structure the message
    const structuredMessage = await messageRepo.getStructuredMessages(
      message._id
    );

    if (!structuredMessage.length) {
      throw new InternalError("error creating message: " + message._id);
    }

    // emit socket event to all user to receive current messsage
    updatedChat.participants.forEach((participantId: Types.ObjectId) => {
      if (participantId.toString() === currentUserId.toString()) return;

      emitSocketEvent(
        req,
        participantId.toString(),
        ChatEventEnum.MESSAGE_RECEIVED_EVENT,
        structuredMessage[0]
      );
    });

    return new SuccessResponse(
      "message sent successfully",
      structuredMessage[0]
    ).send(res);
  }
);

// delete message
export const deleteMessage = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { messageId } = req.params;
    const currentUserId = req.user?._id;

    if (!messageId) {
      throw new BadRequestError("no message id provided");
    }

    const existingMessage = await messageRepo.getMessageById(
      new Types.ObjectId(messageId)
    );

    if (!existingMessage)
      throw new BadRequestError("invalid message id, message not found");

    // fetch the existing chat
    const existingChat = await chatRepo.getChatByChatId(existingMessage?.chat);

    if (!existingChat)
      throw new InternalError("Internal Error: chat not found");

    // if the existing chat participants includes the current userId
    if (
      !existingChat?.participants?.some(
        (participantId) => participantId.toString() === currentUserId.toString()
      )
    ) {
      throw new AuthFailureError("you don't own the message");
    }

    // check if for currentUserId presence in the message sender
    if (!(existingMessage.sender.toString() === currentUserId.toString()))
      throw new AuthFailureError("you don't own the message ");

    // delete the attachments of the message from the local folder
    if (
      existingMessage &&
      existingMessage.attachments &&
      existingMessage.attachments.length > 0
    ) {
      existingMessage.attachments.forEach(({ localPath }) => {
        removeLocalFile(localPath);
      });
    }

    // delete the message from database
    const deletedMsg = await messageRepo.deleteMessageById(existingMessage._id);

    if (!deletedMsg)
      throw new InternalError("Internal Error: Couldn't delete message");

    // update the last message of the chat
    let lastMessage: any;
    if (
      existingChat?.lastMessage?.toString() === existingMessage._id.toString()
    ) {
      lastMessage = await messageRepo.getLastMessage(existingChat._id);

      await chatRepo.updateChatFields(existingChat._id, {
        $set: {
          lastMessage: lastMessage?._id,
        },
      });
    }

    // emit delete message event to all users
    existingChat.participants.forEach((participantId: Types.ObjectId) => {
      if (participantId.toString() === currentUserId.toString()) return;

      emitSocketEvent(
        req,
        participantId.toString(),
        ChatEventEnum.MESSAGE_DELETE_EVENT,
        {
          messageId: existingMessage._id,
          // chatLastMessage: lastMessage.content || "attachment",
        }
      );
    });

    return new SuccessMsgResponse("message deleted successfully").send(res);
  }
);
