import React from "react";
import { LuUser, PiChats, RiUserSearchLine, logo, profile } from "../assets";
import ThemeSwitchButton from "../components/ThemeSwitchButton";
import { useAuth } from "../context/AuthContext";
import { useConnectWebRtc } from "../context/WebRtcContext";
export default function SideMenu({ activeLeftSidebar, setActiveLeftSidebar }) {
  const sideMenuOptions = [
    { Icon: LuUser, name: "profile" },
    { Icon: PiChats, name: "recentChats" },
    { Icon: RiUserSearchLine, name: "searchUser" },
  ];

  const { logout, user } = useAuth();

  const { incomingOffer, handleAnswerOffer } = useConnectWebRtc();
  return (
    <div className="side-menu h-full w-[75px] flex flex-col items-center justify-between py-5 border-r-2 dark:border-none dark:bg-backgroundDark1 ">
      <div className=" w-10">
        <img src={logo} alt="zenchat" />
      </div>
      <div>
        <ul className="flex flex-col gap-10">
          {sideMenuOptions.map(({ Icon, name }, index) => (
            <li
              className={`text-3xl  cursor-pointer hover:text-primary transition-none ${
                name === activeLeftSidebar ? "text-primary" : "text-slate-500"
              }`}
              onClick={() => setActiveLeftSidebar(name)}
            >
              <Icon key={index} />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-5 items-center">
        <span className="text-2xl cursor-pointer">
          <ThemeSwitchButton />
        </span>

        {/* temp */}
        {!!incomingOffer && (
          <button onClick={() => handleAnswerOffer(incomingOffer)}>
            {incomingOffer.offererUserId}
          </button>
        )}

        <span
          onClick={logout}
          className="text-red-500 cursor-pointer text-sm font-medium"
        >
          Log out
        </span>
        <img
          className="size-10 rounded-full object-cover cursor-pointer"
          src={user.avatarUrl}
          alt="themeButton"
          loading="lazy"
        />
      </div>
    </div>
  );
}
