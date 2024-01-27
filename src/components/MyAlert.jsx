"use client";
import { useMyContext } from "@globalState/MyContext";
import React from "react";
import { FaCheckCircle, FaPlus } from "react-icons/fa";

const MyAlert = () => {
  const { alert } = useMyContext();
  return (
    <div
      className={` ${alert.show === true ? "block" : "hidden"} ${
        alert.success ? "bg-green-500" : "bg-red-500"
      } p-4 rounded fixed top-6 left-6 z-50`}
      style={{ zIndex: "300" }}
    >
      {alert.success ? (
        <div className="flex items-center gap-3  text-white">
          <FaCheckCircle className="specialIcons " />
          <p>Success:</p>
          <p className="text-white">{alert.message}</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-white">
          <FaPlus className="specialIcons rotate-45 " />
          <p>Error</p>
          <p className="text-white">{alert.message}</p>
        </div>
      )}
    </div>
  );
};

export default MyAlert;
