import React, { useState } from "react";
import SideMenu from "../components/SideMenu";
import ChatLeftSidebar from "../components/ChatLeftSidebar";
import ChatsSection from "../components/ChatsSection";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { AddChat } from "../components/AddChat";
import { useChat } from "../context/ChatContext";
import VideoChat from "../components/VideoChat";
import { useConnectWebRtc } from "../context/WebRtcContext";
import IncomingCall from "../components/IncomingCall";

export default function Chat() {
  const {
    currentSelectedChat,
    activeLeftSidebar,
    setActiveLeftSidebar,
    isChatSelected,
  } = useChat();
  const { showVideoComp, incomingOffer } = useConnectWebRtc();

  return (
    <>
      <div className="h-full w-full ">
        <AddChat open={true} />
        {!!incomingOffer && (
          <IncomingCall
            incomingOffer={incomingOffer}
            active={!!incomingOffer}
          />
        )}

        <VideoChat show={showVideoComp} />
        <div className="w-full h-screen md:h-[calc(100vh-120px)] flex dark:bg-backgroundDark3 relative">
          <div className="h-full md:h-fit md:absolute md:bottom-0 md:w-full md:hidden">
            <SideMenu
              setActiveLeftSidebar={setActiveLeftSidebar}
              activeLeftSidebar={activeLeftSidebar}
            />
          </div>
          <div>
            <ChatLeftSidebar activeLeftSidebar={activeLeftSidebar} />
          </div>
          <div
            className={`w-full md:${
              isChatSelected && activeLeftSidebar === "recentChats"
                ? ""
                : "hidden"
            }`}
          >
            {currentSelectedChat.current?._id ? (
              <ChatsSection />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-2xl text-slate-500">
                <h1>No chat selected</h1>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="hidden md:block ">
        <SideMenu
          setActiveLeftSidebar={setActiveLeftSidebar}
          activeLeftSidebar={activeLeftSidebar}
        />
      </div>
    </>
  );
}
