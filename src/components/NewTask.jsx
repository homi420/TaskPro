"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Form from "./Form";
import { useMyContext } from "@globalState/MyContext";

const NewTask = () => {
  const { teamsByMember, socket, loggedInUser, goals, setGoals, handleAlert } =
    useMyContext();
  const [selectOptions, setSelectOptions] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskName = formData.get("taskName");
    const details = formData.get("description");
    const selectedTeam = formData.get("teamSelect");
    console.log(loggedInUser);
    if (goals.length > 0) {
      socket.emit("newTask", {
        taskName,
        assignTo: selectedTeam,
        goals,
        creator: loggedInUser?._id,
        details,
      });
      setGoals([]);
      e.target.reset();
    } else {
      handleAlert(false, { message: "Goals cannot be empty" });
    }
  };
  useEffect(() => {
    if (teamsByMember) {
      const newOptions = teamsByMember
        .filter(
          (team) => !selectOptions.some((option) => option.value === team._id)
        )
        .map((team) => ({
          name: team.name,
          value: team._id,
        }));

      setSelectOptions([...selectOptions, ...newOptions]);
    }
  }, [teamsByMember]);
  const inputs = [
    {
      name: "taskName",
      id: "taskName",
      type: "text",
      placeholder: "Enter Task Name",
    },
    {
      name: "goals",
      id: "goals",
      type: "text",
      placeholder: "Enter Goal and press ctrl!",
    },
  ];
  return (
    <Modal title="New Task" id={"newTask"}>
      <Form
        inputs={inputs}
        handleSubmit={handleSubmit}
        showSelect={true}
        selectOptions={selectOptions}
      />
    </Modal>
  );
};

export default NewTask;
