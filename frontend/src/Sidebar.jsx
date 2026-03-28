import React from "react";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import "./ChatWindow.css";
import "./Sidebar.css";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/threads");
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/threads/${newThreadId}`,
      );
      const res = await response.json();
      console.log("thread messages ", res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (error) {
      console.error("Error fetching thread messages:", error);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/threads/${threadId}`,
        {
          method: "DELETE",
        },
      );

      const res = await response.json();
      console.log(res);
      if (response.ok) {
        setAllThreads((prevThreads) =>
          prevThreads.filter((t) => t.threadId !== threadId),
        );
      } else {
        console.error("Error deleting thread:");
      }

      if (currThreadId === threadId) {
        createNewChat();
      }
    } catch (error) {
      console.error("Error deleting thread:", error);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img
          className="logo"
          src="src/assets/blacklogo.png"
          alt="gpt logo"
        ></img>
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads
          .slice()
          .reverse()
          .map((thread, idx) => (
            <li
              key={idx}
              onClick={() => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : " "}
            >
              {thread.title}
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle trash icon click (e.g., delete thread)
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
      </ul>

      <div className="sign">
        <p>by Apna College &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;
