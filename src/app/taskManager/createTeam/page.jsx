"use client";
import Form from "@components/Form";
import { useMyContext } from "@globalState/MyContext";
import { useRouter } from "next/navigation";
import React from "react";

const CreateTeam = () => {
  const { tags, loggedInUser, handleAlert } = useMyContext();
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const teamName = formData.get("name");
    const description = formData.get("description");
    if (tags.length > 0) {
      const response = await fetch("../api/taskManager/createTeam", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          teamName,
          description,
          creator: loggedInUser._id,
          tags: tags,
        }),
      });
      const json = await response.json();
      handleAlert(response.ok, { message: json.resp });
      if (response.ok) {
        router.push("dashboard ");
      }
    } else {
      handleAlert(false, { message: "At least one tag is must!" });
    }
  };
  const inputs = [
    { name: "name", id: "name", type: "text", placeholder: "Enter Team Name" },
    {
      name: "tag",
      id: "tag",
      type: "text",
      placeholder: "Press Space After Typing to add the tag!",
    },
  ];
  return (
    <div className="p-4 flex flex-col items-start justify-center gap-10 min-h-90">
      <h1 className="text-4xl font-semibold ">Creating A Team</h1>
      <Form
        handleSubmit={handleSubmit}
        inputs={inputs}
        classes={" gap-4 w-full flex flex-col"}
      />
    </div>
  );
};

export default CreateTeam;
