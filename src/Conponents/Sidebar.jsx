import "../../public/Styles/Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../MyContext";
import logo from "../assets/AmarGPT.png";
import { v1 as uuidv1 } from "uuid";

export default function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReplay,
    setCurrThreadId,
    setPrevChat,
  } = useContext(MyContext);

  const API_URL = import.meta.env.VITE_API_URL;

  const [isOpen, setIsOpen] = useState(false);

  const getAllThread = async () => {
    try {
      const token = localStorage.getItem("token"); //  get token from localStorage
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      const res = await fetch(`${API_URL}/api/threads`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, //  send token to backend
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const result = await res.json();

      const filteredData = result.threads.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title || "New Chat",
      }));

      setAllThreads(filteredData);
    } catch (err) {
      console.error("Error fetching all threads:", err);
    }
  };

  useEffect(() => {
    getAllThread();
  }, []);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReplay(null);
    setCurrThreadId(uuidv1());
    setPrevChat([]);
    if (window.innerWidth <= 768) setIsOpen(false); // auto close on mobile
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(`${API_URL}/api/thread/${newThreadId}`);
      const result = await response.json();
      setPrevChat(result);
      setReplay(null);
      setNewChat(false);
      if (window.innerWidth <= 768) setIsOpen(false); // close on mobile
    } catch (err) {
      console.error("Error changing thread:", err);
    }
  };

  const deleteThread = async (newThreadId) => {
    try {
      const response = await fetch(`${API_URL}/api/thread/${newThreadId}`, {
        method: "DELETE",
      });
      const res = await response.json();
      console.log(res);
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== newThreadId)
      );
      if (newThreadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <i className="fa-solid fa-bars"></i>
      </button>

      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar */}
      <section className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="logoBtn" onClick={createNewChat}>
          <img src={logo} alt="AmarGPT" className="logo" />
          <span>
            <i className="fa-solid fa-pen-to-square"></i>
          </span>
        </button>

        {/* History */}
        <ul className="history">
          {allThreads?.map((thread, idx) => (
            <li
              key={idx}
              className={thread.threadId === currThreadId ? "activeThread" : ""}
              onClick={() => changeThread(thread.threadId)}
            >
              {thread.title}
              <i
                className="fa fa-trash"
                aria-hidden="true"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>

        {/* Footer / Sign */}
        <section>
          <div className="sign">
            <p>By Mirjaj Ajij Milon &hearts;</p>
          </div>
        </section>
      </section>
    </>
  );
}
