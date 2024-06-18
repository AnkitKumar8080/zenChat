import axios from "axios";
import { LocalStorage } from "../utils";
// import FormData from "form-data";

// Axios instance for API requests
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  timeout: 120000,
});

apiClient.interceptors.request.use(
  (config) => {
    // retrieve user token from localStorage
    const token = LocalStorage.get("token");
    // set authorization header with bearer
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

export const loginUser = (data) => {
  return apiClient.post("/auth/login", data);
};

export const registerUser = (data) => {
  return apiClient.post("/auth/register", data);
};

export const logoutUser = () => {
  return apiClient.post("/auth/logout");
};

export const getAvailableUsers = (usernameOrEmail) => {
  return apiClient.get(`/api/chat/users?userId=${usernameOrEmail}`);
};

// create a new one to one chat
export const createOneToOneChat = (receiverId) => {
  return apiClient.post(`api/chat/c/${receiverId}`);
};

// get all the current user chats
export const getAllcurrentUserChats = () => {
  return apiClient.get("api/chat");
};

// get chat messages
export const getChatMessages = (chatId) => {
  return apiClient.get(`api/messages/${chatId}`);
};

// send a message
export const sendMessage = (chatId, content, attachments) => {
  const formData = new FormData();
  if (content) {
    formData.append("content", content);
  }

  if (attachments) {
    attachments?.map((file) => {
      formData.append("attachments", file);
    });
  }

  return apiClient.post(`api/messages/${chatId}`, formData);
};

// create group chat
export const createGroupChat = (name, participants) => {
  const body = {
    name,
    participants,
  };
  return apiClient.post("api/chat/group", body);
};

// delete a message
export const deleteMessage = (messageId) => {
  return apiClient.delete(`api/messages/${messageId}`);
};

// delete a chat
export const deleteChat = (chatId) => {
  return apiClient.delete(`api/chat/${chatId}`);
};

export default apiClient;
