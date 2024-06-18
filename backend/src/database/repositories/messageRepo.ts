import { Aggregate, Mongoose, PipelineStage, Types } from "mongoose";
import Chat, { ChatModel } from "../model/Chat";
import {
  NotFoundError,
  AuthFailureError,
  BadRequestError,
  InternalError,
} from "../../core/ApiError";
// import { getLocalFilePath, getStaticFilePath } from "helpers/utils";
// import { emitSocketEvent } from "socket";
// import { ProtectedRequest } from "types/app-request";
// import { ChatEventEnum } from "../../constants/index";
import Message, { MessageModel } from "../model/Message";

const chatMessageCommonAggregator = (): PipelineStage[] => {
  return [
    {
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
  ];
};

// find message by Id
const getMessageById = (id: Types.ObjectId): Promise<Message | null> => {
  return MessageModel.findById(id);
};

// get all messages of a particular Id
const getMessagesOfChatId = (
  chatId: Types.ObjectId
): Promise<Array<Message>> => {
  return MessageModel.find({ chatId });
};

const deleteMessageById = (id: Types.ObjectId): Promise<Message | null> => {
  return MessageModel.findByIdAndDelete(id);
};

const deleteAllMessagesOfChatId = (chatId: Types.ObjectId): Promise<any> => {
  return MessageModel.deleteMany({ chat: chatId });
};

// get all messages aggregated
const getAllMessagesAggregated = (chatId: Types.ObjectId): Aggregate<any> => {
  return MessageModel.aggregate([
    {
      $match: {
        chat: chatId,
      },
    },
    {
      $sort: {
        createdAt: 1,
      },
    },
    ...chatMessageCommonAggregator(),
  ]);
};

const getLastMessage = (chatId: Types.ObjectId): Promise<any> => {
  return MessageModel.findOne({ chat: chatId }).sort({ createdAt: -1 }).exec();
};

// create a new message
const createMessage = (
  userId: Types.ObjectId,
  chatId: Types.ObjectId,
  content: string,
  attachemntFiles: { url: string; localPath: string }[]
): Promise<any> => {
  return MessageModel.create({
    sender: userId,
    content: content,
    chat: chatId,
    attachments: attachemntFiles,
  });
};

// structure the messages
const getStructuredMessages = (messageId: Types.ObjectId) => {
  return MessageModel.aggregate([
    {
      $match: {
        _id: messageId,
      },
    },
    ...chatMessageCommonAggregator(),
  ]);
};

export default {
  getAllMessagesAggregated,
  createMessage,
  getStructuredMessages,
  getMessageById,
  getMessagesOfChatId,
  deleteMessageById,
  deleteAllMessagesOfChatId,
  getLastMessage,
};
