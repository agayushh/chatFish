import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { roomIdAtom } from "./atom/atom";

const LandingPage = () => {
  const [roomId, setRoomId] = useRecoilState(roomIdAtom);
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10).toLocaleUpperCase();
  };
  return (
    <div>
      <div className="bg-gradient-to-tl from-black via-slate-800 to-slate-900 h-screen w-screen flex items-center justify-center flex-wrap">
        <div className="border-white/20 border-2 backdrop-blur-sm bg-black/30 rounded-xl h-[78vh] w-[35vw] p-8 shadow-lg shadow-black/50 hover:border-white/40 transition-all duration-300">
          <h1 className="text-white text-4xl font-mono font-bold tracking-wider">
            ChatFish
          </h1>
          <br />
          <span className="text-white/90 text-xl font-semibold">
            Create a Room
          </span>

          <div className="mt-5">
            <input
              className="bg-transparent border-white/30 border-2 p-3 w-full text-white outline-none rounded-lg focus:border-white/60 transition-all duration-300"
              placeholder="Room Name"
            />
          </div>
          <div className="mt-3">
            <input
              className="bg-transparent border-white/30 border-2 p-3 w-full text-white outline-none rounded-lg focus:border-white/60 transition-all duration-300"
              placeholder="Room ID"
              value={roomId || ""}
              readOnly
            />
          </div>
          <div className="mt-3">
            <button className="bg-green-500 text-black p-3 w-full rounded-lg font-semibold hover:bg-opacity-80 transition-all duration-300">
              Create Room
            </button>

            <button
              className="bg-white text-black p-3 w-full rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 mt-4"
              onClick={() => {
                const id = generateRoomId();
                setRoomId(id);
              }}
            >
              Generate Room ID
            </button>
          </div>
          <br />
          <span className="text-white/90 text-xl font-semibold">
            Join a Room
          </span>
          <div className="mt-3">
            <input
              className="bg-transparent border-white/30 border-2 p-3 w-full text-white outline-none rounded-lg focus:border-white/60 transition-all duration-300"
              placeholder="Room ID"
            />
          </div>
          <div className="mt-3">
            <input
              className="bg-transparent border-white/30 border-2 p-3 w-full text-white outline-none rounded-lg focus:border-white/60 transition-all duration-300"
              placeholder="Your Name"
            />
          </div>
          <div className="mt-3">
            <button className="bg-white text-black p-3 w-full rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300">
              Join Room
            </button>
          </div>

          <div className="mt-5 text-white/70 text-sm italic px-2">
            Note: This is a demo project. Please do not share any personal
            information in the chat rooms.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
