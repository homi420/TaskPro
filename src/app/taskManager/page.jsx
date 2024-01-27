"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useLayoutEffect } from "react";

const TaskManager = ({}) => {
  const router = useRouter();
  useLayoutEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, []);
  return (
    <div className="flex  flex-col gap-4 p-1 items-center justify-center min-h-90 ">
      <h1 className="2xl:text-7xl xs:text-base sm:text-lg md:text-lg lg:text-2xl xl:text-5xl text-sm  font-semibold  text-center   ">
        Create Your Own Team
      </h1>
      <p className="capitalize text-center text-xs   lg:text-lg xl:text-xl 2xl:text-2xl   ">
        manage your tasks easily by creating teams{" "}
      </p>
      <Link href={"/taskManager/createTeam"} className="myBtn2">
        Create Now
      </Link>
    </div>
  );
};

export default TaskManager;
