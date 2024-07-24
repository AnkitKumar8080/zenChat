import React, { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useConnectWebRtc } from "../context/WebRtcContext";

export default function IncomingCall({ active, incomingOffer }) {
  const [offererUser, setOffererUser] = useState(null);
  const { currentUserChats } = useChat();
  const { handleAnswerOffer, handleHangup, audioRef } = useConnectWebRtc();
  useEffect(() => {
    const res = currentUserChats?.flatMap((chat) =>
      chat.participants?.filter((p) => p._id === incomingOffer?.offererUserId)
    )[0];
    setOffererUser(res);
  }, [incomingOffer]);

  return (
    <div
      className={`${
        active ? "" : "hidden"
      }fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50`}
    >
      <div className="bg-white dark:bg-backgroundDark3 dark:text-slate-200 rounded-lg p-6 shadow-2xl text-center">
        <h2 className="text-2xl font-normal mb-4">Incoming video call from</h2>
        <div className="flex flex-col items-center justify-center">
          <img
            className="size-24 rounded-full"
            src={offererUser?.avatarUrl}
            loading="lazy"
            alt=""
          />
          <p className="text-2xl font-semibold my-1">{offererUser?.username}</p>
        </div>
        <div className="flex justify-around gap-2 mt-2">
          <button
            onClick={() => handleAnswerOffer(incomingOffer)}
            className="bg-primary  hover:bg-primary_hover text-white text-md py-2 px-4 rounded-md"
          >
            Accept
          </button>
          <button
            onClick={handleHangup}
            className="bg-red-500 text-white text-md py-2 px-4 rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
