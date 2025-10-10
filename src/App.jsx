import "./App.css";
import ChatWindow from "./Conponents/ChatWindow.jsx";
import Sidebar from "./Conponents/Sidebar.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [replay, setReplay] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [newChat, setNewChat] = useState(true);
  const [prevChat, setPrevChat] = useState([]);
  const [allThreads, setAllThreads] = useState([]);
  const [user, setUser] = useState({});

  const ProviderValue = {
    prompt,
    setPrompt,
    replay,
    setReplay,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChat,
    setPrevChat,
    allThreads,
    setAllThreads,
  };
  return (
    <div className="app">
      <MyContext.Provider value={ProviderValue}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;
