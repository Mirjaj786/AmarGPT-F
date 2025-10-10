import "../../public/Styles/ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "../MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

export default function ChatWindow() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL
  const {
    prompt,
    setPrompt,
    replay,
    setReplay,
    currThreadId,
    setCurrThreadId,
    prevChat,
    setPrevChat,
    setNewChat,
  } = useContext(MyContext);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        setUser({});
      }
    }
  }, []);

  const getReplay = async () => {
    if (!prompt) return;
    setNewChat(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Must be Login to use AmarGPT You need to Login/Register First.....");
        window.location.href = "/login";
        console.error("No token found");
        return;
      }

      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // send token to backend
        },
        body: JSON.stringify({ message: prompt, threadId: currThreadId }),
      });

      const data = await res.json();

      if (res.ok) {
        setPrevChat((prev) => [
          ...prev,
          { role: "user", content: prompt },
          { role: "assistant", content: data.replay },
        ]);
        setReplay(data.replay);
        setPrompt("");
      } else {
        console.error("Error from backend:", data.error || data.message);
      }
    } catch (err) {
      console.error("Error sending prompt and receiving reply:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDropDown = () => {
    setIsOpen(!isOpen);
  };
  const handleClose = () => setIsOpen(false);

  // const handleMe = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) return console.error("No token found");

  //     const res = await fetch("http://localhost:3000/api/auth/me", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       localStorage.setItem("user", data);
  //       localStorage.setItem("token", data.token);
  //       console.log("Current User:", data);
  //       setUser(data);
  //     } else {
  //       console.error("Error fetching user:", data.message);
  //     }
  //   } catch (err) {
  //     console.error("handleMe error:", err);
  //   }
  // };

  const handleLogout = async () => {
    if (confirm("are you sure to logout?"))
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return res.status(401).json({ message: "User not loged-in!" });
        }
        const res = await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data);
        if (res.ok) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Logout failed:", err);
      }
  };

  const planHandle = () => {
    setIsPlanOpen(!isPlanOpen);
  };

  return (
    <div className="chatWindow">
      <div className="navBar">
        <span className="navTitle" onClick={planHandle}>
          AmarGPT <i className="fa fa-angle-down" aria-hidden="true"></i>
        </span>

        {isPlanOpen && (
          <div className="plan-detail">
            <div className="item">
              <Link
                to={"https://razorpay.me/@mirjajajijmilon"}
                style={{ textDecoration: "none" }}
              >
                Get AmarGPT Plus+
              </Link>
            </div>
          </div>
        )}

        <div className="navUserIcon" onClick={handleDropDown}>
          <span className="userIcon">
            {user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <i className="fa-solid fa-user"></i>
            )}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="drop-down">
          <div className="x-mark" onClick={handleClose}>
            <i className="fa-solid fa-xmark"></i>
          </div>
          <div className="drop-down-item">
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          <div className="drop-down-item">
            <Link
              to="https://razorpay.me/@mirjajajijmilon"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan
            </Link>
          </div>
          <div className="drop-down-item logout" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </div>
        </div>
      )}

      <Chat />

      {loading && (
        <div className="loaderContainer" style={{ backgroundColor: "#121212" }}>
          <ScaleLoader color="#fff" />
        </div>
      )}

      <div className="chatInput">
        <div className="inputBox">
          <input
            type="text"
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getReplay()}
          />
          <div id="submit" onClick={getReplay}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          AmarGPT can make mistakes, please review important info carefully.{" "}
          <a href="#">See Cookie Preferences.</a>
        </p>
      </div>
    </div>
  );
}
