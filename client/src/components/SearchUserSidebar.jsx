import React, { useRef } from "react";
import { BiSearch, profile } from "../assets";
import { limitChar } from "../utils";
import { getAvailableUsers } from "../api";
import { useChat } from "../context/ChatContext";

const SearchedUsersResultCard = ({ user }) => {
  const { setOpenAddChat, setNewChatUser } = useChat();

  const handleCreateChatClick = () => {
    setNewChatUser(user);
    setOpenAddChat(true);
  };

  return (
    <div className="flex justify-between p-4 my-1 rounded-md bg-backgroundLight3 dark:bg-backgroundDark1 items-center w-full">
      <div className="flex gap-2 items-center w-max">
        <div>
          <img
            className="size-8 rounded-full object-cover"
            src={user.avatarUrl}
            alt={user.username}
            loading="lazy"
          />
        </div>

        <div>
          <h3 className="font-medium text-base text-slate-700 dark:text-slate-100">
            {user.username}
          </h3>
        </div>
      </div>
      <button
        onClick={handleCreateChatClick}
        className="bg-primary hover:bg-primary_hover  text-sm rounded-lg p-1 cursor-pointer"
      >
        + create chat
      </button>
    </div>
  );
};

export default function SearchUserSidebar() {
  const searchInputRef = useRef();

  // useChat hook
  const { searchedUsers, setSearchedUsers } = useChat();

  const searchUsers = async () => {
    const { data } = await getAvailableUsers(searchInputRef.current.value);
    setSearchedUsers(data.data?.users || []);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchUsers();
    }
    if (!searchInputRef.current.value.trim()) {
      setSearchedUsers(null);
    }
  };
  return (
    <div className="px-5 py-6 w-full h-full">
      <div className="top">
        <h1 className="text-black font-medium text-xl dark:text-white">
          Search Users
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
            className="bg-transparent outline-none px-2 w-[90%]"
            placeholder="Enter a Email or Username"
            ref={searchInputRef}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div>
          <h1 className="text-black font-medium text-xl dark:text-white">
            {searchUsers?.length ? "Search Results" : ""}
          </h1>
          <div className="recentUserChats h-[calc(100vh-170px)] md:h-[calc(100vh-280px)] overflow-auto ">
            {!searchedUsers ? (
              <h2 className="text-center text-lg dark:text-slate-300 text-slate-500">
                create a chat with friends by searching them !
              </h2>
            ) : !searchedUsers.length ? (
              <h2 className="text-center text-xl text-slate-400">
                No users found{" "}
              </h2>
            ) : (
              searchedUsers?.map((user) => (
                <SearchedUsersResultCard key={user._id} user={user} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
