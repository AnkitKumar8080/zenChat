import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  deleteChat,
  deleteMessage,
  getAllcurrentUserChats,
  getChatMessages,
  sendMessage,
} from "../api";
import { requestHandler } from "../utils";
import { useSocket } from "./SocketContext";

const chatContext = createContext();

// created a hook to use the chat context
export const useChat = () => useContext(chatContext);

export const ChatProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false); // state to store the socket connection status
  const [searchedUsers, setSearchedUsers] = useState(null); // state to store the stored users
  const [openAddChat, setOpenAddChat] = useState(false); // state to display the AddChat modal
  const [newChatUser, setNewChatUser] = useState(null); // storing the new user with chat is going to be created
  const [currentUserChats, setCurrentUserChats] = useState([]); // storing current user chats
  const [loadingChats, setLoadingChats] = useState(false); // state to manage loading while fetching the user chats
  const [loadingMessages, setLoadingMessages] = useState(false); // state to manage loading
  const [messages, setMessages] = useState([]); // state to store the chat messages
  const [message, setMessage] = useState(""); // state to store the current message
  const [attachments, setAttachments] = useState([]); // state to store files
  // state to manage the left menu activeSidebar has three values: ["profile", "recentChats", "searchUser"]
  const [activeLeftSidebar, setActiveLeftSidebar] = useState("recentChats");

  // state for mobile responsive
  const [isChatSelected, setIsChatSelected] = useState(false);

  // ref to maintain the current selected chat
  const currentSelectedChat = useRef();

  const { socket, socketEvents } = useSocket();

  // get the current user chats
  const getCurrentUserChats = () => {
    requestHandler(
      async () => getAllcurrentUserChats(),
      setLoadingChats,
      (res) => {
        const { data } = res;
        setCurrentUserChats(data || []);
      },
      alert
    );
  };

  // function to get current selected chat messages
  const getMessages = (chatId) => {
    if (!chatId) return alert("no chat selected");

    if (!socket) return alert("socket connection not available");

    // emit an event to join the current chat
    socket.emit(socketEvents.JOIN_CHAT_EVENT, chatId);

    requestHandler(
      async () => await getChatMessages(chatId),
      setLoadingMessages,
      (res) => {
        const { data } = res;
        setMessages(data || []);
      },
      alert
    );
  };

  // update last message of the current selected chat with new message
  const updateLastMessageOfCurrentChat = (chatId, message) => {
    const updatedChat = currentUserChats?.find((chat) => chat._id === chatId);

    if (!updatedChat) return;

    updatedChat.lastMessage = message;
    updatedChat.updatedAt = message?.updatedAt;

    setCurrentUserChats((prevChats) =>
      prevChats.map((chat) => (chat._id === chatId ? updatedChat : chat))
    );
  };

  // delete message
  const deleteChatMessage = async (messageId) => {
    setMessages((prevMsgs) =>
      prevMsgs.filter((msg) => msg._id.toString() !== messageId.toString())
    );
    await requestHandler(
      async () => await deleteMessage(messageId),
      null,
      (res) => {},
      alert
    );
  };

  // delete chats
  const deleteUserChat = async (chatId) => {
    // alert message to confirm delete chat
    if (
      !window.confirm(
        "Are you sure you want to delete this chat? This action cannot be undone"
      )
    )
      return;

    const currentSelectedChatId = currentSelectedChat.current?._id;
    // set the current selected chat to null
    currentSelectedChat.current = null;

    // remove the chat from the current user chats
    setCurrentUserChats((prevChats) =>
      prevChats.filter((chat) => chat._id !== currentSelectedChatId)
    );

    // remove the messages of the deleted chat
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.chat !== currentSelectedChatId)
    );

    // request the server to delete the sected chat
    await requestHandler(
      async () => await deleteChat(chatId),
      null,
      (res) => {},
      alert
    );
  };

  // send message
  const sendChatMessage = async () => {
    if (!socket || !currentSelectedChat.current?._id) return;

    await requestHandler(
      async () =>
        await sendMessage(
          currentSelectedChat.current?._id,
          message,
          attachments
        ),
      null,
      (res) => {
        setMessage("");
        setAttachments([]);
        setMessages((prevMsgs) => [...prevMsgs, res.data]);

        // update the last message of the chat
        updateLastMessageOfCurrentChat(
          currentSelectedChat.current?._id,
          res.data
        );
      },
      alert
    );
  };

  // handle on message received event from server
  // ie when a new message is sent to the server and the server sends a event to participants of chat with current message

  // const onMessageReceived = useCallback(message) => {
  const onMessageReceived = (message) => {
    // add the unread message count here
    // update the messages array when a new message event received from the server
    if (currentSelectedChat.current?._id === message.chat) {
      setMessages((prevMsgs) => [...prevMsgs, message]);
    }
    // update the last message of the current chat
    updateLastMessageOfCurrentChat(message.chat, message);
  };
  // ,
  // [messages, currentUserChats]

  // handle when a message is deleted
  const onMessageDeleted = useCallback(
    (payload) => {
      setMessages((prevMsgs) =>
        prevMsgs.filter(
          (msg) => msg._id.toString() !== payload.messageId.toString()
        )
      );
    },
    [messages, currentUserChats]
  );

  // handle searching users
  // const searchUsers = async (query) => {
  //   requestHandler(
  //     async () => await apiClient.get(`api/users/search/${query}`),
  //     null,
  //     (res) => {
  //       const { data } = res;
  //       setSearchedUsers(data || []);
  //     },
  //     alert
  //   );
  // };

  // handle removing file from attachments
  const removeFileFromAttachments = (index) => {
    setAttachments((prevAttachments) => [
      ...prevAttachments.slice(0, index),
      ...prevAttachments.slice(index + 1),
    ]);
  };

  useEffect(() => {
    if (!socket) return;

    // setup all the listeners for the socket events from server
    socket.on(socketEvents.CONNECTED_EVENT, () => setIsConnected(true));
    socket.on(socketEvents.DISCONNECT_EVENT, () => setIsConnected(false));
    socket.on(socketEvents.MESSAGE_RECEIVED_EVENT, onMessageReceived);
    socket.on(socketEvents.MESSAGE_DELETE_EVENT, onMessageDeleted);

    return () => {
      // remove all the listeners for the socket events
      socket.off(socketEvents.CONNECTED_EVENT);
      socket.off(socketEvents.DISCONNECT_EVENT);
      socket.off(socketEvents.MESSAGE_RECEIVED_EVENT, onMessageReceived);
      socket.off(socketEvents.MESSAGE_DELETE_EVENT, onMessageDeleted);
    };
  }, [socket, onMessageReceived]);

  return (
    <chatContext.Provider
      value={{
        searchedUsers,
        setSearchedUsers,
        openAddChat,
        setOpenAddChat,
        newChatUser,
        setNewChatUser,
        currentUserChats,
        setCurrentUserChats,
        loadingChats,
        setLoadingChats,
        getCurrentUserChats,
        messages,
        setMessages,
        loadingMessages,
        getMessages,
        currentSelectedChat,
        message,
        setMessage,
        attachments,
        setAttachments,
        sendChatMessage,
        removeFileFromAttachments,
        activeLeftSidebar,
        setActiveLeftSidebar,
        deleteChatMessage,
        deleteUserChat,
        isChatSelected,
        setIsChatSelected,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};
