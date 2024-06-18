import { Aggregate, PipelineStage, Types } from "mongoose";
import User, { UserModel } from "../model/User";
import { RoleModel } from "../model/Role";
import { InternalError } from "../../core/ApiError";

// search for existing users
const exists = async (id: Types.ObjectId): Promise<boolean> => {
  const user = await UserModel.exists({ _id: id, status: true });
  return user !== null;
};

// find profile by id
const findById = (id: Types.ObjectId): Promise<User | null> => {
  return UserModel.findOne(id)
    .populate({
      path: "roles",
      match: { status: true },
      select: { code: 1 },
    })
    .lean();
};

// find profile by username
const findByUsername = (username: string): Promise<User | null> => {
  return UserModel.findOne({ username: username })
    .populate({
      path: "roles",
      match: { status: true },
      select: { code: 1 },
    })
    .lean();
};

// find profile by email
const findByEmail = (email: string): Promise<User | null> => {
  return UserModel.findOne({ email: email })
    .populate({
      path: "roles",
      match: { status: true },
      select: { code: 1 },
    })
    .lean();
};

const findByEmailOrUsername = (id: string): Promise<User | null> => {
  // temp
  const user = UserModel.findOne({
    $or: [{ email: id }, { username: id }],
  })
    .select("+password")
    .populate({
      path: "roles",
      match: { status: true },
      select: { code: 1, _id: 0 },
    })
    .lean()
    .exec();
  return user;
};

// fetch only selective fields by id
const findFieldsById = (
  id: Types.ObjectId,
  ...fields: string[]
): Promise<User | null> => {
  return UserModel.findOne({ _id: id, status: true })
    .select(fields.join(" "))
    .lean();
};

// create a new user with their keystore
const create = async (user: User, roleCode: string): Promise<User> => {
  const role = await RoleModel.findOne({ code: roleCode })
    .select("+code")
    .lean();
  if (!role) throw new InternalError("role must be specified");

  user.roles = [role];

  const createdUser = await UserModel.create(user);

  return createdUser.toObject();
};

// update user profile
const update = async (
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string
): Promise<{ user: User }> => {
  user.updatedAt = new Date();
  await UserModel.findByIdAndUpdate(
    user._id,
    { $set: { ...user } },
    { new: true }
  ).lean();

  return { user };
};

// update user info only
const updateInfo = (user: User): Promise<any> => {
  user.updatedAt = new Date();
  return UserModel.findByIdAndUpdate(
    user._id,
    { $set: { ...user } },
    { new: true }
  ).lean();
};

// search available users
const searchAvailableUsers = (
  currentUser: User,
  searchTermUsernameOrEmail: string
): Aggregate<any> => {
  return UserModel.aggregate([
    {
      $match: {
        _id: {
          $ne: currentUser._id, // skip the logged in user
        },
        status: true,
        $or: [
          { username: { $regex: searchTermUsernameOrEmail, $options: "i" } },
          { email: { $regex: searchTermUsernameOrEmail, $options: "i" } },
        ],
      },
    },
    {
      $project: {
        avatarUrl: 1,
        username: 1,
        email: 1,
      },
    },
  ]);
};

export default {
  exists,
  findById,
  findByUsername,
  findByEmail,
  findByEmailOrUsername,
  findFieldsById,
  create,
  update,
  updateInfo,
  searchAvailableUsers,
};
