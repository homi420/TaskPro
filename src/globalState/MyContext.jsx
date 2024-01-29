"use client";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const MyContext = createContext();
let socket;

export const MyContextProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState();
  const [showModal, setShowModal] = useState({ show: false, id: undefined });
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [tags, setTags] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [reqSent, setReqSent] = useState([]);
  const [teams, setTeams] = useState([]);
  const [goals, setGoals] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [socketAvailable, setSocketAvailable] = useState(false);
  const [teamsByMember, setTeamsByMember] = useState([]);
  const [allTeamsTasks, setAllTeamsTasks] = useState([]);
  const [getAllTasksAgain, setGetAllTasksAgain] = useState(false);
  const [currentChatRoom, setCurrentChatRoom] = useState(undefined);
  const [othersMessages, setOthersMessages] = useState([]);
  const [myMessages, setMyMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    socket = io("https://taskprobackend.glitch.me/");
    socket.on("connect", handleSocketConnect);
    socket.on("newNotification", handleNewNotification);
    socket.on("removeNotification", handleRemoveNotification);
    socket.on("receiveUserTasks", handleReceiveUserTasks);
    socket.on("receiveTeamTasks", handleReceiveTeamTasks);
    socket.on("receiveAllTeamTasks", handleReceiveAllTeamTasks);

    socket.on("error", handleSocketError);
    return () => socket.disconnect();
  }, []);
  useEffect(() => {
    setAllMessages(() => []);
  }, [currentChatRoom]);
  useEffect(() => {
    if (loggedInUser) {
      initializeSocket();
      socket.on("receiveChat", handleReceiveChat);
    }
  }, [loggedInUser]);
  useEffect(() => {
    const getTeamsByMember = async () => {
      const response = await fetch(
        `/api/taskManager/getTeamsByMember/${loggedInUser._id}`
      );
      const json = await response.json();
      if (!response.ok) {
        handleAlert(false, { message: json.message });
      } else {
        setTeamsByMember(() => json.resp.teams);
      }
    };
    if (loggedInUser) getTeamsByMember();
  }, [loggedInUser]);

  useEffect(() => {
    if (currentChatRoom) socket.on("message", handleMessage);
  }, [currentChatRoom]);
  useEffect(() => {
    if (loggedInUser) socket.on("success", handleSocketSuccess);
  }, [loggedInUser, pathname, teamsByMember]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getAllUsers();
    }
  }, []);
  useEffect(() => {
    if (loggedInUser && teamsByMember.length > 0) {
      teamsByMember.map((team) => socket.emit("joinRoom", team._id));
      return () => {
        teamsByMember.map((team) => socket.emit("leaveRoom", team._id));
      };
    }
  }, [loggedInUser, teamsByMember]);
  // GET's
  const getAllTeamsTasks = async (team) => {
    const teamId = team._id;
    socket.emit("getAllTeamTasks", teamId);
  };

  const getUser = async (token) => {
    const response = await fetch(`/api/getUser/${token}`);
    const json = await response.json();
    setLoggedInUser(() => json.resp.user);
  };

  const getTeamTasks = (teamId) => {
    socket.emit("getTeamTasks", teamId);
  };

  const getUserTasks = (userId) => {
    socket.emit("getUserTasks", userId);
  };
  const getAllUsers = async () => {
    const response = await fetch("/api/getAllUsers");
    const json = await response.json();
    setAllUsers(json.resp);
  };
  /* -x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x */
  const handleSocketConnect = () => {
    console.log("Socket.io connected");
    setSocketAvailable(true);
  };

  const handleNewNotification = (notification) => {
    setNotifications((prevNot) => [...prevNot, notification]);
  };

  const handleRemoveNotification = (id) => {
    const filteredNotif = notifications.filter((item) => item._id !== id);
    setNotifications(filteredNotif);
  };

  const handleReceiveUserTasks = (tasks) => {
    setUserTasks(tasks);
  };

  const handleReceiveTeamTasks = (tasks) => {
    setTeamTasks(tasks);
  };
  const handleReceiveAllTeamTasks = (tasks) => {
    setAllTeamsTasks((prevArray) => {
      // Filter out tasks from prevArray that are not present in the new tasks array
      const updatedArray = prevArray.filter((existingTask) =>
        tasks.some((newTask) => newTask._id === existingTask._id)
      );

      // Add any new tasks that don't have a matching ID in the existing array
      const newTasks = tasks.filter(
        (newTask) =>
          !prevArray.some((existingTask) => existingTask._id === newTask._id)
      );

      // Concatenate updatedArray with newTasks
      return [...updatedArray, ...newTasks];
    });
  };

  const handleSocketSuccess = ({ message, action, data }) => {
    handleAlert(true, { message });
    if (action === "reloadTasks") {
      if (window.location.pathname === "/taskmanager/dashboard") {
        const userId = loggedInUser._id;
        console.log(loggedInUser);
        console.log(userId);
        console.log(teamsByMember);
        if (userId !== undefined) socket.emit("getUserTasks", userId);
        else console.error("user id is not defined");
        const myFn = () => {
          teamsByMember.map((team) => getAllTeamsTasks(team));
        };
        let intervalId;
        intervalId = setInterval(() => {
          if (teamsByMember.length > 0) {
            myFn();
            clearInterval(intervalId);
          }
        }, 300);
      } else {
        const lastSlashIndex = window.location.pathname.lastIndexOf("/");
        let teamId;
        if (lastSlashIndex !== -1) {
          teamId = pathname.substring(lastSlashIndex + 1);
        }
        socket.emit("getTeamTasks", teamId);
      }
    }
  };
  const handleMessage = (message) => {
    if (message.to === currentChatRoom) {
      toggleScrollToBottom();
      setAllMessages((prevMsg) => {
        const updatedMessages = prevMsg.filter(
          (msg) => msg._id !== message._id
        );
        return [...updatedMessages, message];
      });
    }
  };
  const handleReceiveChat = (chat) => {
    setAllMessages(chat[0].messages);
    toggleScrollToBottom();
  };
  const handleSocketError = ({ message }) => {
    handleAlert(false, { message });
  };

  const handleAlert = (success, json) => {
    setShowAlert({
      show: true,
      message: json.message,
      success,
    });
    setTimeout(() => {
      setShowAlert({
        show: false,
        message: json.message,
        success,
      });
    }, 1500);
  };

  const toggleModal = (id) => {
    if (showModal.show) {
      setShowModal({ show: false, id: undefined });
    } else {
      setShowModal({ show: true, id });
    }
  };

  const initializeSocket = () => {
    socket.emit("userConnected", loggedInUser);
    socket.emit(
      "getAllNotifications",
      loggedInUser._id,
      ({ status, notifications }) => {
        if (status === 200) {
          setNotifications(notifications);
        }
      }
    );
    socket.emit("getAllClientsNotifications", ({ status, notifications }) => {
      if (status === 200) {
        setAllNotifications(notifications);
        notifications.forEach((item) => {
          setReqSent((prevReq) => [...prevReq, { sent: true, id: item.to }]);
        });
      }
    });
  };

  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    success: null,
  });
  const toggleScrollToBottom = () => {
    setScrollToBottom((prevVal) => !prevVal);
  };
  return (
    <MyContext.Provider
      value={{
        handleAlert,
        alert: showAlert,
        getUser,
        loggedInUser,
        isLoggedIn,
        setIsLoggedIn,
        tags,
        setTags,
        showModal,
        setShowModal,
        allUsers,
        socket,
        notifications,
        setNotifications,
        allNotifications,
        reqSent,
        toggleModal,
        setReqSent,
        goals,
        setGoals,
        teams,
        setTeams,
        getTeamTasks,
        getUserTasks,
        teamTasks,
        setTeamTasks,
        userTasks,
        setUserTasks,
        socketAvailable,
        teamsByMember,
        setTeamsByMember,
        allTeamsTasks,
        setAllTeamsTasks,
        getAllTeamsTasks,
        getAllTasksAgain,
        currentChatRoom,
        setCurrentChatRoom,
        othersMessages,
        setOthersMessages,
        myMessages,
        allMessages,
        setMyMessages,
        scrollToBottom,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
