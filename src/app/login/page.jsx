"use client";
import Login from "@components/Login";
import React from "react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
const LoginPage = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState();
  useLayoutEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(() => true);
      router.push("/taskManager");
    } else setIsLoggedIn(() => false);
    return () => {
      console.log("Layout effect ended!");
    };
  }, []);
  if (isLoggedIn === false) {
    return (
      <div className="authPage">
        <Login />
      </div>
    );
  } else return;
};

export default LoginPage;
