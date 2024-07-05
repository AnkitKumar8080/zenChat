import { createContext, useContext, useEffect, useState } from "react";
import { LocalStorage } from "../utils";
import socketio from "socket.io-client";

// method to establish a socket connection
const getSocket = () => {
  const token = LocalStorage.get("token"); // get token from local storage

  // create a socket connection with the provided URI and authentication
  return socketio(import.meta.env.VITE_SOCKET_URI, {
    withCredentials: true,
    auth: { token },
  });
};

const SocketContext = createContext({ socket: null });

// custom hook to access socket instance from context
const useSocket = () => useContext(SocketContext);

const socketEvents = {
  CONNECTED_EVENT: "connected",
  DISCONNECT_EVENT: "disconnect",
  JOIN_CHAT_EVENT: "joinChat",
  NEW_CHAT_EVENT: "newChat",
  TYPING_EVENT: "typing",
  STOP_TYPING_EVENT: "stopTyping",
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  LEAVE_CHAT_EVENT: "leaveChat",
  UPDATE_GROUP_NAME_EVENT: "updateGroupName",
  MESSAGE_DELETE_EVENT: "messageDeleted",
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    // disconnect socket when component in unmounted
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, socketEvents }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
