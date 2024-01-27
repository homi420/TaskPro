"use client";
import Signup from "@components/Signup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState();
  // let isLoggedIn = undefined;
  useLayoutEffect(() => {
    // isLoggedIn = localStorage.getItem("token");
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
      <>
        <Signup />
      </>
    );
  } else return;
}
