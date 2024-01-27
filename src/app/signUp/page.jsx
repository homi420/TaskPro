"use client";
import Signup from "@components/Signup";
import React from "react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
const SignUpPage = () => {
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
        <Signup />
      </div>
    );
  } else return;
};

export default SignUpPage;
