import { Request, Response } from "express";
import asyncHandler from "../helpers/asyncHandler";
import userRepo from "../database/repositories/userRepo";
import {
  AuthFailureError,
  BadRequestError,
  InternalError,
  NoDataError,
  NotFoundError,
} from "../core/ApiError";
import chatRepo from "../database/repositories/chatRepo";
import { SuccessMsgResponse, SuccessResponse } from "../core/ApiResponse";
import { Types } from "mongoose";
import { emitSocketEvent } from "../socket";
import { ChatEventEnum } from "../constants";
import User from "../database/model/User";
import { ProtectedRequest } from "../types/app-request";
import { removeLocalFile } from "../helpers/utils";
import messageRepo from "../database/repositories/messageRepo";

// search available users
const searchAvailableusers = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const userId = req.query.userId as string; // the search param can include either a username or email of the user to be searched

    if (!userId)
      throw new BadRequestError("invalid search, provide a username or email");

    const users = await userRepo.searchAvailableUsers(req.user, userId);

    if (!users.length) {
      throw new NoDataError("no users found");
    }

    return new SuccessResponse("found Users", {
      users,
    }).send(res);
  }
);

// Get existing oneToOne chat

// method to create or return existing chat
const createOrGetExistingChat = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { receiverId } = req.params;

    const currentUserId = req.user?._id;

    // check for valid receiver id;
    const receiver = await userRepo.findById(new Types.ObjectId(receiverId));

    if (!receiver) {
      throw new BadRequestError("receiver does not exist");
    }

    // check whether a user is requesting to chat with himself or not
    if (receiver._id.toString() === currentUserId.toString()) {
      throw new BadRequestError("you cannot chat with yourself");
    }

    // search a chats with partipants including user and receiver id
    const chat = await chatRepo.getExistingOneToOneChat(
      currentUserId,
      new Types.ObjectId(receiverId)
    );

    // if chat found return it
    if (chat.length) {
      return new SuccessResponse("chat retrieved successfully", {
        existing: true,
        ...chat[0],
      }).send(res);
    }

    // else create a new chat
    const newChatInstance = await chatRepo.createNewOneToOneChat(
      currentUserId,
      new Types.ObjectId(receiverId)
    );

    // chat of the created chat to get the chat instance data
    const newChatId = newChatInstance._id;

    // structure the chat as per common aggregation
    const createdChat = await chatRepo.getChatByChatIdAggregated(newChatId);

    if (!createdChat.length) {
      throw new InternalError(
        "unable to create a chat one to one chat instance"
      );
    }

    // logic to emit socket event about the new chat added to participants
    createdChat[0]?.participants?.forEach((participant: User) => {
      if (participant._id?.toString() === req.user?._id.toString()) return; // no need to emit event for current user

      // emit socket event to other participants execpt the user
      emitSocketEvent(
        req,
        participant._id?.toString(),
        ChatEventEnum.NEW_CHAT_EVENT,
        createdChat[0]
      );
    });

    // send a successful response of created chat
    return new SuccessResponse("chat created successfully", {
      existing: false,
      ...createdChat[0],
    }).send(res);
  }
);

// get all chat of logged in user
const getCurrentUserChats = async (req: ProtectedRequest, res: Response) => {
  const currentUserId = req.user?._id;
  const chats = await chatRepo.getCurrentUserAllChats(currentUserId);

  return new SuccessResponse(
    "user chats fetched successfully",
    chats || []
  ).send(res);
};

// create a group chat
const createGroupChat = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { name, participants } = req.body;
    const currentUserId = req.user?._id;

    // check participants for current user
    if (participants?.includes(currentUserId.toString())) {
      throw new BadRequestError(
        "invalid participants, container the current user"
      );
    }

    // check for duplicate participants
    const members = [...new Set([...participants, req.user._id.toString()])];

    // check for valid participants
    if (members.length < 3) {
      throw new BadRequestError("invalid participants length");
    }

    // create a new group chat
    const createdGroupChat = await chatRepo.createNewGroupChat(
      currentUserId,
      name,
      members
    );

    // get the aggregated chat
    const chatRes = await chatRepo.getAggregatedGroupChat(createdGroupChat._id);

    // aggreate method return results in an array
    const groupChat = chatRes[0];

    // emit socket to all participants about the new group chat
    groupChat?.participants?.forEach((participant: any) => {
      // don't emit event to the current user
      if (participant._id?.toString() === currentUserId?.toString()) return;

      // emit to rest of all the participants
      emitSocketEvent(
        req,
        participant._id?.toString(),
        ChatEventEnum.NEW_CHAT_EVENT,
        groupChat
      );
    });

    // return a success response
    return new SuccessResponse(
      "group chat created successfully",
      groupChat
    ).send(res);
  }
);

const getGroupChatDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId } = req.params;

    const chatRes = await chatRepo.getAggregatedGroupChat(
      new Types.ObjectId(chatId)
    );

    const groupChatDetails = chatRes[0];

    if (!groupChatDetails) {
      throw new NoDataError("group chat not found!");
    }

    return new SuccessResponse(
      "group chat fetched successfully",
      groupChatDetails
    ).send(res);
  }
);

// add new user to the group chat
const addNewUserToGroup = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { chatId } = req.params;
    const { newParticipantId } = req.body;
    const currentUserId = req.user?._id;
    if (!chatId) {
      throw new BadRequestError("no chatId provided");
    }

    // check if groupchat exists
    const existingGroupChat = await chatRepo.getChatByChatId(
      new Types.ObjectId(chatId)
    );

    if (!existingGroupChat) {
      throw new NotFoundError("no group chat found ");
    }

    // check if the adder is admin
    if (existingGroupChat.admin?.toString() !== currentUserId?.toString()) {
      throw new BadRequestError("only admin's can add new user");
    }

    const existingParticipants = existingGroupChat.participants;

    // check if new participants exists in the group
    if (
      existingParticipants.some(
        (participant) => participant.toString() === newParticipantId
      )
    ) {
      throw new BadRequestError("user already exists in the group");
    }
    // add the new user
    await chatRepo.updateChatFields(new Types.ObjectId(chatId), {
      $push: { participants: newParticipantId },
    });

    // get the aggregated chat
    const aggregatedChat = await chatRepo.getAggregatedGroupChat(
      new Types.ObjectId(chatId)
    );

    const updatedChat = aggregatedChat[0];

    if (!updatedChat) {
      throw new InternalError("Internal Server Error");
    }

    return new SuccessResponse(
      "participant added successfully",
      updatedChat
    ).send(res);
  }
);

// delete oneToOne chat
const deleteChat = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const { chatId } = req.params;
    const currentUserId = req.user?._id;

    // check if chatId exists
    const existingChat = await chatRepo.getChatByChatId(
      new Types.ObjectId(chatId)
    );

    if (!existingChat) {
      throw new NotFoundError("chat not found");
    }

    // check if chat is group chat if group chat only admins can delete it
    if (!existingChat.isGroupChat) {
      if (existingChat.admin.toString() !== currentUserId.toString()) {
        throw new AuthFailureError("only admins can delete the group ");
      }
    }

    if (
      !existingChat?.participants?.some(
        (participantId) => participantId.toString() === currentUserId.toString()
      )
    ) {
      throw new AuthFailureError("you cannot delete other's chat");
    }

    // delete the chat
    await chatRepo.deleteChatById(existingChat._id);

    // get all the messages and delete the attachments and messages
    const existingMessages = await messageRepo.getMessagesOfChatId(
      existingChat._id
    );

    let attachments: { url: string; localPath: string }[][] = [];

    // Get the attachments from each message object
    existingMessages.forEach((message: any) => {
      if (message.attachments && message.attachments.length > 0) {
        attachments.push(message.attachments);
      }
    });

    // delete the attachments from the local folder
    attachments.forEach((attachment) => {
      attachment.forEach(({ localPath }) => {
        removeLocalFile(localPath);
      });
    });

    // delete all the messages
    await messageRepo.deleteAllMessagesOfChatId(existingChat._id);

    // emit socket events to all participants of current deleted chat
    existingChat.participants.forEach((participantId) => {
      if (participantId.toString() === currentUserId.toString()) return;

      // emit socket event to rest of the users
      emitSocketEvent(
        req,
        participantId.toString(),
        ChatEventEnum.LEAVE_CHAT_EVENT,
        existingChat
      );
    });

    return new SuccessMsgResponse("chat delete successfully").send(res);
  }
);

export {
  searchAvailableusers,
  createOrGetExistingChat,
  getCurrentUserChats,
  createGroupChat,
  getGroupChatDetails,
  addNewUserToGroup,
  deleteChat,
};
