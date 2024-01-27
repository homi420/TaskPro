import Link from "next/link";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { useMyContext } from "@globalState/MyContext";
import { FaCheckCircle, FaClock, FaEdit, FaTrash } from "react-icons/fa";

const TaskEditor = ({
  name = "",
  id = "",
  fn,
  setShowEditor,
  position = "absolute",
}) => {
  const cancel = () => {
    setShowEditor({ show: false, id: undefined, prevValue: undefined });
  };
  return (
    <form
      onSubmit={fn}
      className={`${
        position === "absolute" && "absolute"
      } fadeInDown flex md:flex-row flex-col gap-2 items-center`}
    >
      <input className="myInput" type="text" name={name} id={id} required />
      <div className="flex gap-2 justify-start  w-full">
        <button className="myBtn2" type="submit">
          Submit
        </button>
        <button className="myBtn2" type="button" onClick={cancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};
const TaskModal = ({ task }) => {
  const { socket, loggedInUser } = useMyContext();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditor, setShowEditor] = useState({
    show: false,
    id: undefined,
    prevValue: undefined,
    taskId: undefined,
  });

  const editName = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedName = formData.get("updatedName");
    socket.emit("editTaskName", {
      taskId: showEditor.taskId,
      taskName: updatedName,
    });
    setShowEditor({
      show: false,
      id: undefined,
      prevValue: undefined,
      taskId: undefined,
    });
  };
  const editDetails = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedDetails = formData.get("updatedDetails");
    socket.emit("editTaskDetails", {
      taskId: showEditor.taskId,
      details: updatedDetails,
    });
    setShowEditor({
      show: false,
      id: undefined,
      prevValue: undefined,
      taskId: undefined,
    });
  };
  const editGoal = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedObjective = formData.get(
      `updatedGoal_${showEditor.goalIndex}`
    );
    socket.emit("editTaskGoal", {
      taskId: showEditor.taskId,
      updatedObjective,
      goalIndex: showEditor.goalIndex,
    });
    setShowEditor({
      show: false,
      id: undefined,
      prevValue: undefined,
      taskId: undefined,
    });
  };
  const addGoal = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newGoal = formData.get("addGoal");
    socket.emit("addGoal", { taskId: showEditor.taskId, newGoal });
    setShowEditor({
      show: false,
      id: undefined,
      prevValue: undefined,
      taskId: undefined,
    });
  };
  const deleteGoal = (taskId, index) => {
    socket.emit("deleteTaskGoal", { taskId, goalIndex: index });
  };
  const markChecked = (goalIndex, taskId) => {
    socket.emit("markChecked", { taskId, goalIndex });
  };
  const confirmationDialogToggle = () => {
    setShowConfirm((prevValue) => !prevValue);
  };
  const toggleEditor = (id, prevValue, goalIndex) => {
    if (showEditor.id === id && showEditor.show)
      setShowEditor({
        show: false,
        id: undefined,
        prevValue: undefined,
        taskId: undefined,
        goalIndex: undefined,
      });
    else if (goalIndex === undefined)
      setShowEditor({ show: true, id, prevValue, taskId: task._id });
    else
      setShowEditor({
        show: true,
        id,
        prevValue,
        taskId: task._id,
        goalIndex,
      });
  };
  const deleteTask = (taskId) => {
    socket.emit("deleteTask", { taskId });
  };
  return (
    <Modal title="Task" id={`showTask_${task._id}`}>
      <div className=" flex flex-col gap-3 p-2">
        <h3 className="md:text-2xl lg:text-3xl xl:text-4xl sm:text-xl text-lg font-medium flex items-center gap-1 ">
          {loggedInUser?._id === task.creator && (
            <FaEdit
              className="specialIcons"
              onClick={() => toggleEditor("updatedName", task.taskName)}
            />
          )}{" "}
          {task.taskName}
        </h3>
        {showEditor.id === "updatedName" && (
          <TaskEditor
            name="updatedName"
            id="updatedName"
            fn={editName}
            setShowEditor={setShowEditor}
            position=""
          />
        )}
        <p className="font-semibold ">
          <span className="font-medium text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl  flex items-center gap-1">
            <span>
              {loggedInUser?._id === task.creator && (
                <FaEdit
                  className="specialIcons"
                  onClick={() => toggleEditor("updatedDetails", task.details)}
                />
              )}{" "}
            </span>
            <span>{task.details}</span>
          </span>
          {showEditor.id === "updatedDetails" && (
            <TaskEditor
              name="updatedDetails"
              id="updatedDetails"
              fn={editDetails}
              showEditor={showEditor}
              setShowEditor={setShowEditor}
              position=""
            />
          )}
        </p>
        <div className="flex flex-col gap-4">
          <span>Goals: </span>
          <div className="flex flex-col gap-2 p-1">
            {task.goals?.map((goal, index) => {
              return (
                <div key={index}>
                  <span className="flex gap-2 items-center rounded bg-pink-300 p-2 justify-between">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => markChecked(index, task._id)}
                    >
                      {goal.completed ? (
                        <FaCheckCircle className="text-xl" />
                      ) : (
                        <FaClock className="text-xl" />
                      )}
                      <span className={`${goal.completed && "line-through"}`}>
                        {goal.objective}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {goal.completed || (
                        <>
                          <FaTrash
                            className="specialIcons"
                            onClick={() => deleteGoal(task._id, index)}
                          />
                          <FaEdit
                            className="specialIcons"
                            onClick={() =>
                              toggleEditor(
                                `updatedGoal_${index}`,
                                goal.objective,
                                index
                              )
                            }
                          />
                        </>
                      )}
                    </div>
                  </span>
                  {showEditor.id === `updatedGoal_${index}` && (
                    <TaskEditor
                      name={`updatedGoal_${index}`}
                      id={`updatedGoal_${index}`}
                      fn={editGoal}
                      showEditor={showEditor}
                      setShowEditor={setShowEditor}
                      position=""
                    />
                  )}
                </div>
              );
            })}
          </div>
          {showEditor.id === "addGoal" && (
            <TaskEditor
              name="addGoal"
              id="addGoal"
              fn={addGoal}
              setShowEditor={setShowEditor}
              position=""
            />
          )}
          {loggedInUser?._id === task.creator && (
            <>
              <div className="flex justify-end gap-2">
                <button
                  className="myBtn2"
                  type="button"
                  onClick={() => toggleEditor("addGoal")}
                >
                  Add Goal
                </button>
                <button
                  className="myBtn2"
                  type="button"
                  onClick={() => confirmationDialogToggle()}
                >
                  Delete Task
                </button>
              </div>
              <div
                id="confirmationDialog"
                className={` ${
                  !showConfirm && "hidden"
                } bg-pink-200 p-2 flex flex-col gap-2 fadeIn`}
              >
                <h5>Are You Sure You Want To Delete?</h5>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="myBtn2"
                    onClick={() => deleteTask(task._id)}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="myBtn2"
                    onClick={() => confirmationDialogToggle()}
                  >
                    No
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

const Tasks = ({ task }) => {
  const [progress, setProgress] = useState(0);
  const [currentGoal, setCurrentGoal] = useState(task.goals[0]);
  const { toggleModal } = useMyContext();
  useEffect(() => {
    const completedGoals = task.goals.filter((goal) => goal.completed === true);
    const unCompletedGoals = task.goals.filter(
      (goal) => goal.completed === false
    );
    if (unCompletedGoals.length > 0) setCurrentGoal(unCompletedGoals[0]);
    else setCurrentGoal({ objective: "No Goals Remaining" });
    setProgress((completedGoals.length / task.goals.length) * 100);
  }, [task]);
  return (
    <div className="flex-grow xs:max-w-none max-w-full  bg-pink-100" style={{}}>
      <TaskModal key={task._id} task={task} />
      <div
        className="flex flex-col gap-4 rounded shadow-md hover:shadow-lg transition-all w-full sm:w-auto p-4 py-6 cursor-pointer fadeInDown "
        onClick={() => toggleModal(`showTask_${task._id}`)}
        style={{ minWidth: "30%" }}
      >
        <h3 className="text-xl font-medium">{task.taskName}</h3>
        <p>{task.details.substring(0, 50)}...</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold">Current Goal:</span>

          <span className="rounded bg-green-400 p-2">
            {currentGoal.objective}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          <span>Progress:</span>
          <div className="bg-gray-300 h-6 w-full rounded relative">
            <div
              className="bg-green-500 h-full rounded"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black">
                {`${Math.round(progress)}%`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
