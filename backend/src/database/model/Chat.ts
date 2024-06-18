import { Schema, Types, model } from "mongoose";

export const DOCUMENT_NAME = "Chat";

export default interface Chat {
  _id: Types.ObjectId;
  name: string;
  isGroupChat: boolean;
  lastMessage?: Types.ObjectId;
  participants: Types.ObjectId[];
  admin: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// make the the chat interface partial so we  can update selective fields
export type UpdateChatFields = Partial<Chat>;

// define the schema for corresponding document interface
const schema = new Schema<Chat>({
  name: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    maxlength: 200,
  },

  isGroupChat: {
    type: Schema.Types.Boolean,
    default: false,
    required: true,
  },

  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },

  participants: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    required: true,
  },

  admin: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },

  updatedAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

export const ChatModel = model<Chat>(DOCUMENT_NAME, schema);
