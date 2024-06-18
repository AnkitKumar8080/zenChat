import { Schema, Types, model } from "mongoose";

export const DOCUMENT_NAME = "Role";

export enum RoleCode {
  ADMIN = "ADMIN",
  USER = "USER",
}

export default interface Role {
  _id: Types.ObjectId;
  code: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Role>({
  code: {
    type: Schema.Types.String,
    required: true,
    enum: Object.values(RoleCode),
  },
  status: { type: Schema.Types.Boolean, default: true },
  createdAt: { type: Schema.Types.Date, default: Date.now },
  updatedAt: { type: Schema.Types.Date, default: Date.now },
});

// future version add indexing

export const RoleModel = model<Role>(DOCUMENT_NAME, schema);
