"use client";
import Loader from "@components/Loader";
import Tasks from "@components/Tasks";
import { useMyContext } from "@globalState/MyContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FaCalculator, FaClipboard, FaUsers } from "react-icons/fa";

const Dashboard = () => {
  const [loadingTeams, setLoadingTeams] = useState();
  const router = useRouter();
  const {
    loggedInUser,
    setTeams,
    getUserTasks,
    handleAlert,
    teamsByMember,
    setTeamsByMember,
    socketAvailable,
    allTeamsTasks,
    getAllTeamsTasks,
    getAllTasksAgain,
  } = useMyContext();
  useEffect(() => {
    const getTeams = async () => {
      setLoadingTeams(true);
      const response = await fetch(
        `/api/taskManager/getTeams/${loggedInUser._id}`
      );
      const json = await response.json();
      setLoadingTeams(false);
      if (response.ok) {
        setTeams(json.resp);
      }
    };
    const getTeamsByMember = async () => {
      const response = await fetch(
        `/api/taskManager/getTeamsByMember/${loggedInUser._id}`
      );
      const json = await response.json();
      if (!response.ok) {
        handleAlert(false, { message: json.message });
      } else {
        setTeamsByMember(() => json.resp.teams);
      }
    };

    if (loggedInUser) {
      getUserTasks(loggedInUser._id);
      getTeamsByMember();
    }
  }, [loggedInUser]);
  useEffect(() => {
    if (socketAvailable && teamsByMember.length > 0) {
      teamsByMember.map((team) => getAllTeamsTasks(team));
    }
  }, [socketAvailable, teamsByMember, getAllTasksAgain]);
  return (
    <div className="p-4">
      <section className="flex flex-col gap-10">
        <h2 className="text-3xl font-semibold flex gap-2 items-center">
          {" "}
          <FaUsers /> My Teams
        </h2>

        <div className="flex  gap-2 flex-wrap  p-4 rounded">
          {loadingTeams ? (
            <Loader />
          ) : (
            teamsByMember?.map((team, index) => {
              return (
                <Link
                  key={index}
                  href={`team/${team._id}`}
                  className="flex flex-col gap-4 bg-pink-100 rounded shadow-md p-4 py-6 cursor-pointer relative fadeIn flex-grow"
                  style={{}}
                >
                  {loggedInUser._id === team.headAdmin.id && (
                    <span className="absolute top-2 right-2 p-1 rounded text-sm bg-pink-500 text-white">
                      Owned
                    </span>
                  )}
                  <h3 className="text-xl font-medium">{team?.name}</h3>
                  <p>{team?.description}</p>
                  <p>{team?.members?.length} Members</p>
                  <div className="flex flex-wrap gap-3">
                    {team.tags.map((tag, index) => {
                      return (
                        <span key={index} className="bg-pink-200 p-2">
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </Link>
              );
            })
          )}
        </div>
        <h2 className="text-3xl font-semibold flex items-center gap-2">
          {" "}
          <FaClipboard /> My Tasks
        </h2>

        <div className="flex gap-2 flex-wrap">
          {loadingTeams ? (
            <Loader />
          ) : (
            allTeamsTasks?.map((task, index) => {
              return <Tasks task={task} key={index} />;
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
