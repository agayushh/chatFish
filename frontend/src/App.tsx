import { useEffect, useState } from "react";
import "./App.css";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [message, setMessage] = useState(["Hi there", "hello"]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      setMessage((m) => [...m, event.data]);
    };
  }, []);

  return (
    <div className="bg-gradient-to-tl from-black to-slate-900 h-screen w-screen flex items-center justify-center flex-wrap">
      <ChatWindow messages={message} />
    </div>
  );
}

export default App;
