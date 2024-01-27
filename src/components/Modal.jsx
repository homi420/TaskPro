"use client";
import { useMyContext } from "@globalState/MyContext";
import React, { useEffect } from "react";
import { FaPlus } from "react-icons/fa";

const Modal = ({ children, title = "Modal", id }) => {
  const { showModal, setShowModal } = useMyContext();
  let dialog;
  useEffect(() => {
    if (showModal.show && showModal.id === id) {
      dialog = document.getElementById(id);
      dialog.showModal();
    } else {
      dialog = document.getElementById(id);

      dialog.close();
    }
  }, [showModal]);
  return (
    // <div
    //   className={`${
    //     !showModal.show || showModal.id !== id
    //       ? "hidden"
    //       : "fadeInDown modal flex flex-col gap-y-4 "
    //   } `}
    //   id={id}
    // >
    <dialog id={id} className="modal fadeInDown">
      <div className="flex justify-between items-center p-2  shadow-md">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span>
          <FaPlus
            className="rotate-45 cursor-pointer hover:animate-pulse"
            onClick={() => setShowModal({ show: false, id })}
          />
        </span>
      </div>
      {children}
    </dialog>
  );
};

export default Modal;
