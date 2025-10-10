import "../../public/Styles/Chat.css";
import { MyContext } from "../MyContext";
import { useContext, useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function Chat() {
  const { newChat, prevChat, replay } = useContext(MyContext);
  const [latestReplay, setLatestReplay] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef(null);

 


  useEffect(() => {
    if (newChat) {
      setLatestReplay("");
      setIsTyping(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [newChat]);

  useEffect(() => {
    if (!replay) return;

    // Clear any existing typing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    setLatestReplay("");
    setIsTyping(true);
    let idx = 0;
    const chars = replay.split("");

    intervalRef.current = setInterval(() => {
      setLatestReplay((prev) => prev + chars[idx]);
      idx++;
      if (idx === chars.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsTyping(false);
      }
    }, 20);

    // Cleanup on unmount or next replay
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [replay]);

  return (
    <div className="chatContainer">
      {newChat && <h1 className="startText">Start a new Chat!</h1>}
      <div className="chats">
        {prevChat?.map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMsg">{chat.content}</p>
            ) : (
              <div className="gptMsg">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="gptDiv typing">
            <div className="gptMsg">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {latestReplay}
              </ReactMarkdown>
              <span className="typingDots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
