import React from "react";
import { LuUser, PiChats, RiUserSearchLine, logo, profile } from "../assets";
import ThemeSwitchButton from "../components/ThemeSwitchButton";
import { useAuth } from "../context/AuthContext";
export default function SideMenu({ activeLeftSidebar, setActiveLeftSidebar }) {
  const sideMenuOptions = [
    { Icon: LuUser, name: "profile" },
    { Icon: PiChats, name: "recentChats" },
    { Icon: RiUserSearchLine, name: "searchUser" },
  ];

  const { logout, user } = useAuth();

  return (
    <div className="side-menu h-full md:w-full md:h-[60px] md:px-4 w-[75px] flex flex-col items-center justify-between py-5 border-r-2 dark:border-none dark:bg-backgroundDark1 md:flex-row">
      <div className=" w-10 md:w-6 ">
        <img src={logo} alt="zenchat" />
      </div>
      <div>
        <ul className="flex flex-col gap-10 md:gap-8 md:flex-row">
          {sideMenuOptions.map(({ Icon, name }, index) => (
            <li
              key={index}
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
      <div className="flex flex-col gap-5 items-center md:flex-row ">
        <div className="text-2xl md:text-md font-extrabold cursor-pointer">
          <ThemeSwitchButton />
        </div>

        <div
          onClick={logout}
          className="md:hidden text-red-500 cursor-pointer text-sm font-medium"
        >
          Log out
        </div>
        <img
          className="md:hidden size-10 rounded-full object-cover cursor-pointer"
          src={user.avatarUrl}
          alt="themeButton"
          loading="lazy"
        />
      </div>
    </div>
  );
}
