import React from "react";
import MyAlert from "@components/MyAlert";
import { MyContextProvider } from "@globalState/MyContext";
import Navbar from "./Navbar";
import ChatBox from "./ChatBox";

const MyMain = ({ children }) => {
  const navLinks = [
    { name: "Dashboard", link: "/taskManager/dashboard" },
    { name: "Projects", link: "/taskManager/projects" },
    { name: "Team", link: "/taskManager/team" },
    { name: "Conversation", link: "/taskManager/conversation" },
  ];
  return (
    <MyContextProvider>
      <Navbar name={"TaskPro"} links={navLinks} />
      <MyAlert />
      {children}
    </MyContextProvider>
  );
};

export default MyMain;
