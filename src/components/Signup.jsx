"use client";
import { useMyContext } from "@globalState/MyContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Signup = () => {
  const { handleAlert } = useMyContext();
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userName = formData.get("userName");
    const email = formData.get("email");
    const password = formData.get("password");
    const response = await fetch("api/signUp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userName, email, password }),
    });
    const json = await response.json();
    handleAlert(json.resp.success, json.resp);
    if (response.ok) {
      router.push("/login");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>

        {/* Username Input */}
        <div className="mb-4">
          <label htmlFor="userName" className="myLabel">
            Username
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            className=" myInput"
            required
          />
        </div>
        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="myLabel">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className=" myInput"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="password" className="myLabel">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="myInput"
            required
          />
        </div>

        {/* Sign Up Button */}
        <button type="submit" className="myBtn">
          Sign Up
        </button>
        <p className="flex w-full gap-2  justify-end mt-4 text-gray-700 font-semibold items-end">
          Already a user?{" "}
          <Link href={"/login"} className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
