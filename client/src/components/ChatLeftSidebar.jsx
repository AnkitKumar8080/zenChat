import React from "react";
import ProfileSidebar from "./ProfileSidebar";
import RecentChatsSidebar from "./RecentChatsSidebar";
import SearchUserSidebar from "./SearchUserSidebar";

export default function ChatLeftSidebar({ activeLeftSidebar }) {
  const renderLeftSidebar = () => {
    switch (activeLeftSidebar) {
      case "profile":
        return <ProfileSidebar />;
      case "recentChats":
        return <RecentChatsSidebar />;
      case "searchUser":
        return <SearchUserSidebar />;
      default:
        return <ProfileSidebar />;
    }
  };

  return (
    <div className="w-[380px] h-full bg-backgroundLight2 dark:bg-backgroundDark2 border-r-2 dark:border-none">
      {renderLeftSidebar()}
    </div>
  );
}
