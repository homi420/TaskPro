"use client";
import { useMyContext } from "@globalState/MyContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useLayoutEffect, useState } from "react";

import {
  FaBell,
  FaArrowAltCircleDown,
  FaSearch,
  FaHamburger,
  FaPlus,
  FaEnvelope,
} from "react-icons/fa";
import Modal from "./Modal";
import NewTask from "./NewTask";
import ChatBox from "./ChatBox";

// Component for NavLinks...
const NavLinks = ({ link }) => {
  const [isActive, setIsActive] = useState(null);
  const pathname = usePathname();
  useLayoutEffect(() => {
    if (pathname === link.link) setIsActive(() => true);
    else setIsActive(() => false);
  }, [pathname]);

  return (
    <Link
      href={`${link.link}`}
      className={`font-medium opacity-70  ${
        isActive ? "border-b-4 border-blue-600 text-blue-600" : ""
      } `}
    >
      {link.name}
    </Link>
  );
};

// *******************************************************************
const Navbar = ({ name, links }) => {
  const {
    getUser,
    loggedInUser,
    isLoggedIn,
    setIsLoggedIn,
    socket,
    notifications,
    setNotifications,
    handleAlert,
    setShowModal,
    showModal,
    toggleModal,
  } = useMyContext();
  const [profileNavOpen, setProfileNavOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [navLinksOpen, setNavLinksOpen] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    const chatDialog = document.getElementById("chatBoxDialog");
    if (chatDialog !== null) {
      if (chatOpen) chatDialog.show();
      else chatDialog.close();
    }
  }, [chatOpen]);

  // Logout Functionality...
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
    setIsLoggedIn(() => false);
    profileNavToggle();
  };

  // Functionality for toggling the profile icon...
  const profileNavToggle = () => {
    setProfileNavOpen((prev) => !prev);
    setNotificationOpen(() => false);
    setChatOpen(() => false);
    setNavLinksOpen(false);
  };

  // Function for toggling the search bar...
  const chatToggle = () => {
    setChatOpen((prev) => !prev);
    setNotificationOpen(false);
    setProfileNavOpen(false);
    setNavLinksOpen(false);
  };

  // Function for toggling the notification icon...
  const notificationToggle = () => {
    setNotificationOpen((prev) => !prev);
    setChatOpen(false);
    setProfileNavOpen(false);
    setNavLinksOpen(false);
  };
  // Function for toggling the navLinks on the smaller screens...
  const toggleNavLinks = () => {
    setNavLinksOpen((prev) => !prev);
    setChatOpen(false);
    setProfileNavOpen(false);
    setNotificationOpen(false);
  };

  useLayoutEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(() => true);
      if (pathName === "/" || pathName === "/signUp" || pathName === "/login")
        router.push("/taskManager");
    } else setIsLoggedIn(() => false);
  }, [isLoggedIn]);
  useLayoutEffect(() => {
    const get = async () => {
      await getUser(localStorage.getItem("token"));
    };
    if (localStorage.getItem("token")) get();
  }, [isLoggedIn]);
  const [firstLetter, setFirstLetter] = useState("");
  useEffect(() => {
    setFirstLetter(() => loggedInUser?.userName?.charAt(0).toUpperCase());
  }, [loggedInUser]);
  const acceptReq = (teamId, notification) => {
    socket.emit(
      "reqToAddAccepted",
      { userId: loggedInUser._id, teamId, notification },
      ({ status, message }) => {
        if (status === 200) {
          handleAlert(true, { message });

          const filteredNotifications = notifications.filter(
            (item) => item._id === notification
          );
          setNotifications(filteredNotifications);
        } else {
          handleAlert(false, { message });
        }
      }
    );
  };
  const rejectReq = (userId, from, team) => {
    socket.emit(
      "removeReq",
      {
        userId,
        from,
        notification: `${loggedInUser.userName} rejected your request`,
        team,
        type: "reject",
      },
      ({ status, message }) => {
        console.log(message);
      }
    );
  };
  if (isLoggedIn === true)
    return (
      <>
        <NewTask />
        <nav className="w-full  px-2 py-4 grid grid-cols-12 items-center">
          <Link
            href={"/taskManager"}
            className="cursor-pointer sm:col-span-2 xs:col-span-3 col-span-4 font-medium text-2xl   select-none bg-gradient-to-r from-blue-600  to-purple-500 text-transparent bg-clip-text  "
          >
            {name}
          </Link>
          <div className="md:flex hidden md:col-span-6  gap-4 p-1">
            {links.map((link, index) => {
              return <NavLinks link={link} key={index} />;
            })}
          </div>
          <div className="md:hidden relative sm:col-span-4 xs:col-span-2 col-span-4 flex items-center justify-center">
            <FaHamburger
              className={`md:hidden sm:text-2xl text-xl cursor-pointer ${
                navLinksOpen ? "hidden" : " fadeIn"
              }`}
              onClick={toggleNavLinks}
            />
            <FaPlus
              className={`md:hidden text-2xl  rotate-45 transition-all cursor-pointer  ${
                !navLinksOpen ? "hidden" : "fadeIn"
              }`}
              onClick={toggleNavLinks}
            />
            <div
              className={` flex-col ${
                navLinksOpen ? "flex fadeInDown" : " fadeOfUp hidden "
              } gap-2 top-0 absolute shadow-md p-2 z-50 bg-pink-100`}
            >
              {links.map((link, index) => {
                return <NavLinks link={link} key={index} />;
              })}
            </div>
          </div>
          <div className="md:col-span-4   sm:col-span-6  xs:col-span-7 col-span-4  p-1 flex items-center gap-2 justify-evenly  relative">
            <button
              type="button "
              className="myBtn2 xs:block hidden"
              onClick={() => toggleModal("newTask")}
            >
              {" "}
              New Task
            </button>
            <div className="relative">
              <FaEnvelope
                className={`sm:text-2xl xs:text-xl text-lg cursor-pointer `}
                onClick={chatToggle}
              />
              <dialog
                id="chatBoxDialog"
                className="sm:min-w-fit xs:max-w-sm max-w-xs w-64 text-xs xs:text-sm fadeIn  2xl:text-3xl  z-50 shadow-md top-10 -left-44"
              >
                <ChatBox />
              </dialog>
            </div>
            <div className="relative">
              <FaBell
                className="sm:text-2xl xs:text-xl text-lg cursor-pointer"
                onClick={notificationToggle}
              />
              <div
                className={`${
                  notificationOpen ? "" : "hidden"
                } absolute top-10 shadow sm:min-w-96 xs:min-w-80 min-w-72  p-4 max-w-96 sm:right-0 xs:-right-12 -right-10 min-h-28 max-h-90 overflow-scroll z-10 bg-pink-100 rounded flex  flex-col gap-2 fadeIn `}
              >
                <h2 className="text-xl flex items-center gap-2 font-medium">
                  {" "}
                  <FaBell /> Notifications:
                </h2>
                {notifications.length < 1 ? (
                  <span>No Notifications To Show...</span>
                ) : (
                  notifications
                    .sort(function (a, b) {
                      // Convert date strings to Date objects and sort in descending order
                      return new Date(b.date) - new Date(a.date);
                    })
                    .map((item, index) => {
                      return (
                        <span
                          key={index}
                          className="flex flex-col gap-2 text-lg p-2 border-pink-100 border rounded"
                        >
                          {item.notification}
                          {item.notificationType === "req" && (
                            <div className=" flex justify-between ">
                              <button
                                type="button"
                                className="myBtn2"
                                onClick={() => acceptReq(item.team, item._id)}
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                className=" myBtn2 "
                                onClick={() =>
                                  rejectReq(item.to, item.from, item.team)
                                }
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </span>
                      );
                    })
                )}
              </div>
            </div>
            <div
              onClick={profileNavToggle}
              className="cursor-pointer xs:py-2 xs:px-4 py-1 px-3 font-semibold text-lg rounded-full border border-black relative "
            >
              <span className="select-none"> {firstLetter}</span>
              <FaArrowAltCircleDown className="absolute bottom-0 right-0" />
              <div
                className={`absolute right-3 z-50 top-full shadow-md p-2 flex-col gap-2 min-w-40 ${
                  !profileNavOpen ? "hidden" : "flex fadeIn"
                }`}
              >
                <button type="button " className="myBtn2 xs:hidden">
                  {" "}
                  New Task
                </button>
                <button type="button" className="myBtn2" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  else return;
};

export default Navbar;
