"use client";
import { useMyContext } from "@globalState/MyContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Login = () => {
  const { handleAlert, setIsLoggedIn } = useMyContext();
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const response = await fetch("api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    handleAlert(response.ok, json.resp);
    if (response.ok) {
      localStorage.setItem("token", json.resp.token);
      setIsLoggedIn(() => true);
      router.push("/taskManager");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold mb-6">Login</h2>

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

        {/* Login Button */}
        <button type="submit" className="myBtn">
          Login
        </button>
        <p className="flex w-full gap-2  justify-end mt-4 text-gray-700 font-semibold items-end">
          Not an account?{" "}
          <Link href={"/signUp"} className="text-blue-500">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;