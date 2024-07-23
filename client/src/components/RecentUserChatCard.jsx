import moment from "moment";
import { profile } from "../assets";
import { useAuth } from "../context/AuthContext";
import { getChatObjectMetadata, limitChar } from "../utils";

export default function RecentUserChatCard({ chat, onClick, isActive }) {
  // usercontext
  const { user } = useAuth();

  const filteredChat = getChatObjectMetadata(chat, user); // filter the chat object metadata

  return (
    <div
      onClick={() => onClick(chat)}
      className={`flex gap-2 p-4 my-1 rounded-md hover:bg-backgroundLight3  dark:hover:bg-backgroundDark1 ${
        isActive ? "bg-backgroundLight3 dark:bg-backgroundDark1 " : ""
      } items-center w-full cursor-pointer`}
    >
      {chat.isGroupChat ? (
        <div className="w-12 relative h-12 mr-2 flex-shrink-0 flex justify-start items-center flex-nowrap">
          {chat.participants.slice(0, 3).map((participant, i) => {
            return (
              <img
                key={participant._id}
                src={participant.avatarUrl}
                loading="lazy"
                className={`w-10 h-10  border-white rounded-full absolute outline outline-3 outline-black ${
                  i === 0
                    ? "left-0 z-30"
                    : i === 1
                    ? "left-2 z-20"
                    : i === 2
                    ? "left-4 z-10"
                    : ""
                }`}
              />
            );
          })}
        </div>
      ) : (
        <img
          className="size-12 rounded-full object-cover"
          src={filteredChat.avatar}
          alt=""
          loading="lazy"
        />
      )}

      <div className=" w-full">
        <div
          className="flex items-center
        justify-between"
        >
          <div>
            <p className="font-medium text-base text-slate-700 dark:text-slate-100">
              {filteredChat.title}
            </p>
          </div>
          <div className="font-light text-xs text-slate-500 dark:text-slate-400">
            {chat.lastMessage
              ? moment(chat.lastMessage?.createdAt)
                  .add("TIME_ZONE", "hours")
                  .fromNow(true) + " ago"
              : ""}{" "}
          </div>
        </div>
        <div className=" w-full flex items-center justify-between">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {limitChar(filteredChat.lastMessage, 25)}
          </div>
          {/* <span className="rounded-full size-5 text-center content-center text-xs bg-secondary bg-opacity-20 shadow-md dark:text-white">
            3
          </span> */}
        </div>
      </div>
    </div>
  );
}
