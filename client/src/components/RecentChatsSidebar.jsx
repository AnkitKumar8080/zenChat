import React, { useEffect, useState } from "react";
import { BiSearch } from "../assets";
import { LocalStorage } from "../utils";
import { useChat } from "../context/ChatContext";
import RecentUserChatCard from "./RecentUserChatCard";
import Loading from "./Loading";
import { useAuth } from "../context/AuthContext";

export default function RecentChatsSidebar() {
  const {
    currentUserChats,
    loadingChats,
    getCurrentUserChats,
    setMessages,
    getMessages,
    currentSelectedChat,
    isChatSelected,
    setIsChatSelected,
  } = useChat();
  const { user } = useAuth();

  const [filteredRecentUserChats, setFilteredRecentUserChats] = useState(null);

  const getFilteredRecentChats = (e) => {
    const { value } = e.target;
    const usernameRegex = new RegExp(value, "i");

    if (value.trim() === "") {
      setFilteredRecentUserChats(currentUserChats);
    } else {
      setFilteredRecentUserChats(
        currentUserChats.filter((chat) => {
          if (chat?.isGroupChat) {
            return usernameRegex.test(chat.name);
          } else {
            return chat.participants.some((participant) => {
              if (participant._id === user._id) return false;

              return usernameRegex.test(participant.username);
            });
          }
        })
      );
    }
  };

  useEffect(() => {
    setFilteredRecentUserChats(currentUserChats);
  }, [currentUserChats]);

  useEffect(() => {
    // fetch the current user chats
    getCurrentUserChats();
  }, []);

  return (
    <div
      className={` px-5 py-6 md:p-2 w-full h-full md:${
        isChatSelected ? "hidden" : "block"
      }`}
    >
      <div className="top">
        <h1 className="text-black font-medium text-xl dark:text-white">
          Recent chats
        </h1>
        <div
          className="flex
          items-center gap-1 bg-backgroundLight3 dark:bg-backgroundDark1 dark:text-slate-300 p-3 rounded-md my-5"
        >
          <div className="text-xl">
            <BiSearch />
          </div>
          <input
            type="text"
            onChange={getFilteredRecentChats}
            className="bg-transparent outline-none px-2 w-[90%]"
            placeholder="Search for chats..."
          />
        </div>

        {loadingChats ? (
          <div className="flex justify-center items-center h-[calc(100vh-170px)]">
            <Loading />
          </div>
        ) : currentUserChats?.length === 0 ? (
          <div className="flex justify-center items-center h-52">
            <h1 className="text-2xl text-slate-400 dark:text-slate-500">
              No Recent chats
            </h1>
          </div>
        ) : (
          <div className="recentUserChats overflow-auto max-h-[calc(100vh-170px)] md:h-[calc(100vh-280px)]">
            {filteredRecentUserChats?.map((chat) => (
              <RecentUserChatCard
                key={chat._id}
                chat={chat}
                isActive={currentSelectedChat.current?._id === chat._id}
                onClick={(chat) => {
                  if (
                    currentSelectedChat.current?._id &&
                    currentSelectedChat.current?._id === chat?._id
                  )
                    return;
                  LocalStorage.set("currentSelectedChat", chat);
                  currentSelectedChat.current = chat;
                  setIsChatSelected(true);
                  setMessages([]);
                  getMessages(currentSelectedChat.current?._id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
