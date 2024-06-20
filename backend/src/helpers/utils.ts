import User from "../database/model/User";
import _ from "lodash";
import fs from "fs";
import colorsUtils from "./colorsUtils";
import { serverUrl } from "../config";

export async function filterUserData(user: User) {
  const data = _.pick(user, ["_id", "username", "roles", "avatarUrl"]);
  return data;
}

export const getStaticFilePath = (fileName: string): string => {
  return `${serverUrl}/public/images/${fileName}`;
};

export const getLocalFilePath = (fileName: string): string => {
  return `public/images/${fileName}`;
};

// function to remove the local attachment files from the server
export const removeLocalFile = (path: string) => {
  fs.unlink(path, (err) => {
    if (err) colorsUtils.log("error", "failed to remove file - path : " + path);
    colorsUtils.log("success", "file removed path: " + path);
  });
};
