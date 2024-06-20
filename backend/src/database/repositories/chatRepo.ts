import { PipelineStage, Types } from "mongoose";
import User from "../model/User";
import Chat, { ChatModel, UpdateChatFields } from "../model/Chat";
// common aggregation pipeline functions to construct chat schema with common lookups
const commonChatAggregation = (): PipelineStage[] => {
  return [
    {
      // lookup for the participants present
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "participants",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
              status: 0,
              createdAt: 0,
              updatedAt: 0,
              roles: 0,
            },
          },
        ],
      },
    },
    {
      // lookup for the group chats
      $lookup: {
        from: "messages",
        foreignField: "_id",
        localField: "lastMessage",
        as: "lastMessage",
        pipeline: [
          {
            // get details of the sender
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "sender",
              as: "sender",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    avatarUrl: 1,
                    email: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              sender: { $first: "$sender" },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        lastMessage: { $first: "$lastMessage" },
      },
    },
  ];
};

// function retrieves an existing one-to-one chat between two users.

const getExistingOneToOneChat = async (
  userId: Types.ObjectId,
  receiverId: Types.ObjectId
): Promise<any> => {
  return await ChatModel.aggregate([
    {
      $match: {
        isGroupChat: false,
        $and: [
          {
            participants: { $elemMatch: { $eq: userId } },
          },
          {
            participants: { $elemMatch: { $eq: receiverId } },
          },
        ],
      },
    },
    ...commonChatAggregation(),
  ]);
};

// create a new one to one chat
const createNewOneToOneChat = (
  userId: Types.ObjectId,
  receiverId: Types.ObjectId
): Promise<any> => {
  return ChatModel.create({
    name: "One on one chat",
    participants: [userId, receiverId], // add user and receiver id to the participants
    admin: userId,
  });
};

// create a new group chat
const createNewGroupChat = (
  currentUserId: Types.ObjectId,
  groupName: string,
  members: Types.ObjectId[]
): Promise<any> => {
  return ChatModel.create({
    name: groupName,
    isGroupChat: true,
    participants: members,
    admin: currentUserId,
  });
};

// retrieve chat by chatId
const getChatByChatId = (chatId: Types.ObjectId) => {
  return ChatModel.findById(chatId).lean();
};

// retrieve a chat by chatId
const getChatByChatIdAggregated = (chatId: Types.ObjectId): Promise<any> => {
  return ChatModel.aggregate([
    {
      $match: {
        _id: chatId,
      },
    },
    ...commonChatAggregation(),
  ]);
};

// get current user chats
const getCurrentUserAllChats = (
  currentUserId: Types.ObjectId
): Promise<any> => {
  return ChatModel.aggregate([
    {
      $match: {
        participants: { $elemMatch: { $eq: currentUserId } }, // get all the chats of the current user
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
    ...commonChatAggregation(),
  ]);
};

// get aggregated groupChat
const getAggregatedGroupChat = (chatId: Types.ObjectId): Promise<any> => {
  return ChatModel.aggregate([
    {
      $match: {
        _id: chatId,
        isGroupChat: true,
      },
    },
    ...commonChatAggregation(),
  ]);
};

// update the fields in the chat
const updateChatFields = (
  chatId: Types.ObjectId,
  queryFields: object
): Promise<any> => {
  return ChatModel.findByIdAndUpdate(chatId, queryFields, { new: true });
};

// delete a chat by id
const deleteChatById = (chatId: Types.ObjectId): Promise<any> => {
  return ChatModel.findByIdAndDelete(chatId);
};

export default {
  commonChatAggregation,
  getExistingOneToOneChat,
  createNewOneToOneChat,
  createNewGroupChat,
  getChatByChatId,
  getChatByChatIdAggregated,
  getCurrentUserAllChats,
  getAggregatedGroupChat,
  updateChatFields,
  deleteChatById,
};
