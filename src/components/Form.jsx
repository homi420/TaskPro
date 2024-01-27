"use client";
import { useMyContext } from "@globalState/MyContext";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const Inputs = ({ input, length }) => {
  const { type, name, id, placeholder } = input;
  const { handleAlert, tags, setTags, goals, setGoals } = useMyContext();
  const handleKeyDown = (e) => {
    if (name === "tag") {
      if (tags.length <= 6) {
        if (e.key === " " && e.target.value.trim() !== "") {
          const alreadyExists = tags.some(
            (tag) => tag === e.target.value.trim()
          );

          if (!alreadyExists) setTags([...tags, e.target.value.trim()]);
          else handleAlert(false, { message: "Duplicate Tags Not Allowed!" });
          e.target.value = "";
        }
      } else {
        handleAlert(false, { message: "No More Tags!" });
      }
    }
    if (name === "goals") {
      if (e.key === "Tab" || e.key === "  ") {
        if (e.target.value !== "") {
          setGoals([...goals, e.target.value]);
          e.target.value = "";
        }
      }
    }
  };
  const addGoal = (e) => {
    const inputElement = document.getElementById("goals");
    if (inputElement?.value !== "") {
      setGoals([...goals, inputElement.value]);
      inputElement.value = "";
    }
  };
  const handleRemoveGoal = (indexToRemove) => {
    const updatedGoals = goals.filter((goal, index) => index !== indexToRemove);
    setGoals(updatedGoals);
  };
  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };
  return (
    <div className={`relative sm:col-span-6 col-span-12`}>
      <label htmlFor={id} className="capitalize font-medium">
        {name}
      </label>
      {name === "tag" ? (
        <>
          <input
            type={type}
            onKeyDown={name === "tag" ? handleKeyDown : () => {}}
            className="myInput"
            name={name}
            id={id}
            placeholder={placeholder}
          />
          <div className="sm:absolute sm:m-0 my-4 flex items-center flex-wrap w-full -top-52">
            Tags:
            {tags.map((tag, index) => {
              return (
                <div
                  key={index}
                  className="inline-block m-2 p-2 bg-slate-400 rounded-lg cursor-pointer"
                >
                  {tag}
                  <span
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 bg-red-400 px-1 text-white  rounded-full cursor-pointer"
                  >
                    x
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : name === "goals" ? (
        <>
          <div className="relative">
            <input
              type={type}
              onKeyDown={handleKeyDown}
              className="myInput"
              name={name}
              id={id}
              placeholder={placeholder}
            />
            <FaPlus
              className="border-gray-200 rounded-full absolute top-1/2 right-0 -translate-y-1/2 -translate-x-1/2 cursor-pointer"
              onClick={addGoal}
            />
          </div>
          <div className="  my-4 flex items-center flex-wrap w-full ">
            Goals:
            {goals.map((goal, index) => {
              return (
                <div
                  key={index}
                  className="inline-block m-2 p-2 bg-slate-400 rounded-lg cursor-pointer"
                >
                  {goal}
                  <span
                    onClick={() => handleRemoveGoal(index)}
                    className="ml-2 bg-red-400 px-1 text-white  rounded-full cursor-pointer"
                  >
                    x
                  </span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <input
          type={type}
          className="myInput"
          name={name}
          id={id}
          placeholder={placeholder}
          required
        />
      )}
    </div>
  );
};

const Form = ({
  handleSubmit,
  inputs,
  classes,
  textArea = true,
  textAreaPlaceholder = "Enter Details Here...",
  showSelect = false,
  selectOptions,
}) => {
  return (
    <form onSubmit={handleSubmit} className={classes}>
      <div className="  grid grid-cols-12 gap-4">
        {inputs.map((input, index, array) => {
          const length = array.length;
          return <Inputs key={index} input={input} length={length} />;
        })}
        {textArea && (
          <textarea
            rows={5}
            className="w-full col-span-12 p-2 myInput resize-none"
            placeholder={textAreaPlaceholder}
            name="description"
            required
          ></textarea>
        )}
      </div>
      {showSelect && (
        <div className="my-4">
          <label
            htmlFor="mySelect"
            className="text-lg font-semibold mb-2 block"
          >
            Assign To:
          </label>

          <select
            id="teamSelect"
            name="teamSelect"
            className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            {selectOptions.map((option, index) => {
              return (
                <option value={String(option.value)} key={index}>
                  {option.name}
                </option>
              );
            })}
          </select>
        </div>
      )}
      <div className="w-full flex items-center justify-end p-4   ">
        <button type="Submit" className="myBtn2 ">
          Create
        </button>
      </div>
    </form>
  );
};

export default Form;
