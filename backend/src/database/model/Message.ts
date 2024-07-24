import { Schema, Types, model } from "mongoose";

export const DOCUMENT_NAME = "Message";

export default interface Message {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  content?: string;
  attachments?: {
    url: string;
    localPath: string;
  }[];
  chat: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// define the schema for corresponding document interface
const schema = new Schema<Message>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  content: {
    type: Schema.Types.String,
    trim: false,
    maxlength: 100000,
  },

  attachments: {
    type: [
      {
        url: {
          type: Schema.Types.String,
          trim: true,
        },
        localPath: {
          type: Schema.Types.String,
          trim: true,
        },
      },
    ],
    default: [],
    // maxlength: 30, // max length to send a limited attachment
  },

  chat: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
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

export const MessageModel = model<Message>(DOCUMENT_NAME, schema);
