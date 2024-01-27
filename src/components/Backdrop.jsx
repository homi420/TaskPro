"use client";
import { useMyContext } from "@globalState/MyContext";
import React from "react";

const Backdrop = () => {
  const { showModal } = useMyContext();
  return (
    <div
      className={`w-full h-screen bg-black bg-opacity-50 z-40 ${
        showModal.show ? "  z-40 fixed  " : "hidden"
      }`}
    ></div>
  );
};

export default Backdrop;
