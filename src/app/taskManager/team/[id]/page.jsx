"use client";
import Modal from "@components/Modal";
import Tasks from "@components/Tasks";
import { useMyContext } from "@globalState/MyContext";
import React, { useEffect, useState } from "react";
import { FaPlus, FaTasks, FaUserFriends } from "react-icons/fa";
const AddMember = ({ team }) => {
  const { allUsers, socket, handleAlert, loggedInUser, reqSent, setReqSent } =
    useMyContext();
  const sendReq = (to) => {
    socket.emit(
      "reqToAddInTheTeam",
      {
        to,
        team: team._id,
        notification: `You have been invited to join the ${team?.name} team`,
        from: loggedInUser._id,
      },
      ({ status, message }) => {
        if (status === 200) {
          handleAlert(true, { message });
          console.log(reqSent);
          setReqSent((prevReq) => [...prevReq, { sent: true, id: to }]);
        } else {
          handleAlert(false, { message });
        }
      }
    );
  };
  const removeReq = (userId) => {
    socket.emit(
      "removeReq",
      { userId, from: loggedInUser._id },
      ({ status, message }) => {
        if (status === 200) {
          handleAlert(true, { message });
          const filteredReq = reqSent.filter((req) => req.id !== userId);
          console.log(filteredReq);
          setReqSent(filteredReq);
        } else {
          handleAlert(false, { message });
        }
      }
    );
  };
  return (
    <Modal title="Add Member" id={"newMember"}>
      <input className="myInput" placeholder="Search Users" />
      <div className="flex flex-col gap-2">
        <span className="my-2">Users:</span>
        {allUsers.map((user, index) => {
          if (
            team?.members.find((member) => member.id._id === user._id) ===
            undefined
          ) {
            return (
              <div key={index} className="bg-pink-300 p-2 rounded ">
                <span className="capitalize flex items-center justify-between gap-2">
                  {user.userName}

                  {reqSent.find((item) => item.id === user._id) ? (
                    <button
                      type="button"
                      className="myBtn2 flex items-center gap-2"
                      onClick={() => removeReq(user._id)}
                    >
                      <FaPlus className="rotate-45" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="myBtn2"
                      onClick={() => {
                        sendReq(user._id);
                      }}
                    >
                      <FaPlus />
                    </button>
                  )}
                </span>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    </Modal>
  );
};
const Team = ({ params }) => {
  const [team, setTeam] = useState();
  const {
    setShowModal,
    showModal,
    toggleModal,
    getTeamTasks,
    teamTasks,
    socketAvailable,
    socket,
    loggedInUser,
  } = useMyContext();
  useEffect(() => {
    if (params?.id && socketAvailable) {
      getTeamTasks(params?.id);
    }
    console.log(socketAvailable);
  }, [socketAvailable]);
  useEffect(() => {
    const getTeam = async () => {
      const response = await fetch(
        `../../api/taskManager/getTeam/${params?.id}`
      );
      const json = await response.json();
      setTeam(json.resp);
      console.log(json.resp);
    };
    if (params?.id) {
      getTeam();
    }
  }, []);

  return (
    <div className="relative">
      <AddMember team={team} />
      <div className="p-4 py-8 flex flex-col gap-10">
        <div className="flex justify-between">
          <h1 className="text-3xl font-medium">{team?.name}</h1>
          <div className="flex justify-end">
            {loggedInUser?._id === team?.headAdmin.id._id && (
              <button
                type="button"
                onClick={() => toggleModal("newMember")}
                className="myBtn2 flex items-center gap-1"
              >
                <FaPlus /> Add Member
              </button>
            )}
          </div>
        </div>
        <span className="font-medium flex gap-2 items-center">
          <FaUserFriends />
          Members:
        </span>
        <ul className=" flex  px-4 flex-wrap gap-6">
          {team?.members?.map((member, index) => {
            return (
              <li
                key={index}
                className="list-disc capitalize bg-slate-300 p-2 rounded"
              >
                {" "}
                {member.id.userName}
                {member.id._id === team.headAdmin.id._id ? (
                  <span className="bg-slate-700 text-white rounded p-1 mx-4">
                    Head Admin
                  </span>
                ) : team.admins.some((admin) => admin._id === member.id._id) ? (
                  <span className="bg-slate-700 text-white rounded p-1 mx-4">
                    Admin
                  </span>
                ) : (
                  ""
                )}
              </li>
            );
          })}
        </ul>
        <div>
          <h2 className="font-medium text-lg flex gap-2 items-center">
            <FaTasks />
            Tasks:
          </h2>
          <div className="flex gap-2 flex-wrap">
            {teamTasks?.map((task, index) => {
              return <Tasks task={task} key={index} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
