import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { roomIdAtom, roomNameAtom } from "../atom/atom";

function ChatRoom() {
  const [message, setMessage] = useState([""]);
  const [inputMessage, setInputMessage] = useState("");
  const roomId = useRecoilValue(roomIdAtom);
  const roomName = useRecoilValue(roomNameAtom);

  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "joined") {
          console.log(`Successfully joined room`);
        } else if (data.type === " error") {
          console.log("Websocket Error", data.message || data.payload?.message);
        } else if (typeof data === "string") {
          setMessage((prev) => [...prev, data]);
        }
      } catch (error) {
        setMessage((prev) => [...prev, event.data]);
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
  }, []);

  return (
    <div className="bg-gradient-to-tl from-black to-slate-900 h-screen w-screen flex items-center justify-center flex-wrap">
      <div className="border-white border-2 h-auto w-[36vw]  rounded-md p-4">
        <div className="text-white text-4xl font-thin font-mono flex flex-col">
          ChatFish
          <span className="text-base">RoomID: {roomId}</span>
          <span className="text-base">Room Name: {roomName}</span>
          <span className="w-full border-b "></span>
          {/* text area */}
          <div className="border-white p-2 mt-3 h-[60vh] overflow-auto">
            {message.map((singleMessage: any, key: number) => {
              return (
                <div key={key} className="text-white text-lg ">
                  {" "}
                  -{singleMessage}
                </div>
              );
            })}
          </div>
          {/* input text */}
          <div className="flex border-white border-2 mt-4">
            <input
              className=" p-2 outline-none bg-transparent w-full text-lg h-auto"
              type="text"
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
              }}
            ></input>
            <div className="p-2">
              <button
                className="text-xl bg-white h-10 w-16 text-black "
                onClick={() => {
                  if (wsRef.current) {
                    wsRef.current.send(
                      JSON.stringify({
                        type: "chat",
                        payload: {
                          message: inputMessage,
                        },
                      })
                    );
                    setInputMessage("");
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
