import { model, Schema, Types } from "mongoose";
import Role from "./Role";

export const DOCUMENT_NAME = "User";

export default interface User {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  bio?: string;
  status?: boolean;
  roles: Role[];
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<User>({
  username: {
    type: Schema.Types.String,
    unique: true,
    required: true,
    trim: true,
    maxlength: 200,
  },

  email: {
    type: Schema.Types.String,
    unique: true,
    required: true,
    trim: true,
    maxlength: 200,
  },

  password: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    // minlength: 6,
    select: false,
    maxlength: 200,
  },

  avatarUrl: {
    type: Schema.Types.String,
    trim: true,
  },

  bio: {
    type: Schema.Types.String,
    trim: true,
    maxlength: 200,
  },

  status: {
    type: Schema.Types.Boolean,
    default: true,
  },

  roles: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    required: true,
    select: false,
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

// future version add indexing

export const UserModel = model<User>(DOCUMENT_NAME, schema);
