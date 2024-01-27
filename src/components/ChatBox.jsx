"use client";
import { useMyContext } from "@globalState/MyContext";
import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
const OthersMessages = ({ message }) => {
  return (
    <div className="w-full my-1 fadeIn min-w-fit max-w-max">
      <span className="bg-pink-200 py-1 px-2  rounded flex flex-col">
        <span className="font-light">{message.sender.userName}:</span>

        <span>{message.content}</span>
      </span>
    </div>
  );
};
const MyMessages = ({ message }) => {
  return (
    <div className=" my-1 w-full fadeIn  min-w-fit max-w-full flex justify-end">
      <span className="bg-pink-300 px-2 py-1 mx-1 rounded flex  flex-col">
        {" "}
        <span className=" font-light"> You:</span>
        <span>{message.content}</span>
      </span>
    </div>
  );
};
const MessageBox = ({ allMessages }) => {
  const { loggedInUser, scrollToBottom, currentChatRoom } = useMyContext();
  useEffect(() => {
    const msgBox = document.getElementById("MessageBox");
    if (msgBox !== null) {
      msgBox.scroll({ top: msgBox.scrollHeight });
    }
  }, [scrollToBottom]);
  return (
    <div
      id="MessageBox"
      className="h-64 overflow-y-scroll relative flex flex-col  "
    >
      {allMessages.map((message, index) => {
        if (currentChatRoom === message.to) {
          if (message.sender._id === loggedInUser._id) {
            return <MyMessages key={index} message={message} />;
          } else return <OthersMessages key={index} message={message} />;
        }
      })}
    </div>
  );
};
const ChatBox = () => {
  const {
    currentChatRoom,
    setCurrentChatRoom,
    teamsByMember,
    othersMessages,
    setOthersMessages,
    myMessages,
    setMyMessages,
    socket,
    socketAvailable,
    loggedInUser,
    allMessages,
  } = useMyContext();
  useEffect(() => {
    // if (!currentChatRoom && teamsByMember.length > 0) {
    //   setCurrentChatRoom(teamsByMember[0]._id);
    // }
  }, [teamsByMember]);
  useEffect(() => {
    if (socketAvailable && currentChatRoom !== undefined) {
      socket.emit("getChat", { teamId: currentChatRoom });
    }
  }, [currentChatRoom, socketAvailable]);
  const sendMessage = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const messageValue = formData.get("message");
    socket.emit("sendMessage", currentChatRoom, messageValue, loggedInUser._id);
    e.target.reset();
  };
  return (
    <div className="p-2 bg-pink-100 flex flex-col gap-2 ">
      <div className="flex gap-2 items-center">
        <FaEnvelope />
        <h2 className="font-medium">Chat:</h2>
      </div>
      <div className="flex  gap-1 items-center">
        {teamsByMember.map((team, index) => {
          return (
            <div
              key={index}
              className={`${
                currentChatRoom === team._id &&
                "scale-95 bg-pink-200 transition-all duration-100"
              } bg-pink-100 p-2 rounded cursor-pointer transition-all duration-100`}
              onClick={() => setCurrentChatRoom(team._id)}
            >
              <h3 className="min-w-max">{team.name}</h3>
            </div>
          );
        })}
      </div>
      <div>
        <MessageBox allMessages={allMessages} />
        <form onSubmit={sendMessage} className="flex gap-1 items-center">
          <input
            type="text"
            name="message"
            id="message"
            placeholder="Send Message..."
            className="myInput"
            required
          />
          <button type="submit" className="myBtn2">
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
