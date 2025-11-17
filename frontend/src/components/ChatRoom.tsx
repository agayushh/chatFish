import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { roomIdAtom, roomNameAtom } from "../atom/atom";
import { useNavigate } from "react-router-dom";
import { WS_BASE } from "../lib/constant";

function ChatRoom() {
  const [message, setMessage] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const roomId = useRecoilValue(roomIdAtom);
  const roomName = useRecoilValue(roomNameAtom);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  useEffect(() => {
    const ws = new WebSocket(WS_BASE);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "joined") {
          console.log(`Successfully joined room`);
        } else if (data.type === "error") {
          console.log("Websocket Error", data.message || data.payload?.message);
        } else if (data.type === "chat" && data.payload?.message) {
          setMessage((prev) => [...prev, `Other: ${data.payload.message}`]);
        }
      } catch (error) {
        setMessage((prev) => [...prev, `Other: ${event.data}`]);
      }
    };
    
    wsRef.current = ws;
    
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: roomId,
          },
        })
      );
    };
    
    return () => {
      ws.close();
    };
  }, [roomId]);

  // Send message function
  const sendMessage = () => {
    if (wsRef.current && inputMessage.trim()) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: inputMessage,
          },
        })
      );
      
      // Add your own message to the UI
      setMessage((prev) => [...prev, `You: ${inputMessage}`]);
      setInputMessage("");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-gradient-to-tl from-black via-slate-800 to-slate-900 min-h-screen w-full flex flex-col">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4 md:p-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-mono font-bold text-white mb-1">
              ChatFish
            </h1>
            <div className="text-sm md:text-base text-gray-400 space-y-1 sm:space-y-0 sm:space-x-4 sm:flex">
              <span>Room: <span className="text-blue-400 font-mono">{roomId}</span></span>
              <span>User: <span className="text-green-400">{roomName}</span></span>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="self-start sm:self-auto bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 flex flex-col max-w-6xl w-full mx-auto p-4 md:p-6">
        <div className="flex-1 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 max-h-[60vh] md:max-h-[70vh]">
            {message.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p className="text-center">
                  No messages yet. Start the conversation! 👋
                </p>
              </div>
            ) : (
              message.map((msg, index) => {
                const isOwnMessage = msg.startsWith("You:");
                const messageText = isOwnMessage ? msg.replace("You: ", "") : msg.replace("Other: ", "");
                
                return (
                  <div
                    key={index}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-xs md:max-w-md lg:max-w-lg`}>
                      {/* Username label */}
                      <span className="text-xs text-gray-400 mb-1 px-2">
                        {isOwnMessage ? 'You' : 'Other User'}
                      </span>
                      
                      {/* Message bubble */}
                      <div
                        className={`px-4 py-2 rounded-2xl break-words shadow-lg ${
                          isOwnMessage
                            ? 'bg-blue-600 text-white rounded-br-md' 
                            : 'bg-gray-600 text-white rounded-bl-md'
                        }`}
                      >
                        {messageText}
                      </div>
                      
                      {/* Timestamp */}
                      <span className="text-xs text-gray-500 mt-1 px-2">
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex gap-2 md:gap-3 items-end">
            <div className="flex-1">
              <textarea
                className="w-full bg-transparent border-2 border-white/20 rounded-xl p-3 md:p-4 text-white placeholder-gray-400 outline-none focus:border-blue-400 transition-all duration-300 resize-none min-h-[50px] max-h-32"
                placeholder="Type your message... (Press Enter to send)"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-4 md:px-6 py-3 md:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none whitespace-nowrap"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
