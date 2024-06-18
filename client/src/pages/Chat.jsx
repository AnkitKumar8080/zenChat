import React, { useState } from "react";
import SideMenu from "../components/SideMenu";
import ChatLeftSidebar from "../components/ChatLeftSidebar";
import ChatsSection from "../components/ChatsSection";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { AddChat } from "../components/AddChat";
import { useChat } from "../context/ChatContext";

export default function Chat() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { currentSelectedChat, activeLeftSidebar, setActiveLeftSidebar } =
    useChat();

  return (
    <>
      <AddChat open={true} />

      <div className="w-full  h-screen flex dark:bg-backgroundDark3">
        <div className="h-full">
          <SideMenu
            setActiveLeftSidebar={setActiveLeftSidebar}
            activeLeftSidebar={activeLeftSidebar}
          />
        </div>
        <div>
          <ChatLeftSidebar activeLeftSidebar={activeLeftSidebar} />
        </div>
        <div className="w-full">
          {currentSelectedChat.current?._id ? (
            <ChatsSection />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-2xl text-slate-500">
              <h1>No chat selected</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
