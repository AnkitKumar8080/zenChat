export enum ChatEventEnum {
  CONNECTED_EVENT = "connected",
  DISCONNECTED_EVENT = "disconnected",
  JOIN_CHAT_EVENT = "joinChat",
  LEAVE_CHAT_EVENT = "leaveChat",
  UPDATE_GROUP_NAME_EVENT = "updateGroupName",
  MESSAGE_RECEIVED_EVENT = "messageReceived",
  MESSAGE_DELETE_EVENT = "messageDeleted",
  NEW_CHAT_EVENT = "newChatEvent",
  SOCKET_ERROR_EVENT = "socketError",
  START_TYPING_EVENT = "startTyping",
  STOP_TYPING_EVENT = "stopTyping",
}
