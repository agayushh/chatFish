import { useState } from "react";
import { useRecoilState } from "recoil";
import { roomIdAtom, roomNameAtom } from "./atom/atom";
import { IoClipboardOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate()
  const [roomId, setRoomId] = useRecoilState(roomIdAtom);
  const [roomName, setRoomName] = useRecoilState(roomNameAtom);
  const [clientRoomId, setClientRoomId] = useState("");
  const [error, setError] = useState("");
  const [joinError, setJoinError] = useState("");
  const [clientName, setClientName] = useState("");
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const copyToClipboard = async () => {
    if (!roomId || !roomId.trim()) {
      alert("no room id to copy please generate one");
      return;
    }
    try {
      await navigator.clipboard.writeText(roomId || "");
      alert("Copied the room ID: " + roomId);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateRoom = async () => {
    setError("");
    let isError = false;
    if (!roomId?.trim() && !roomName?.trim()) {
      setError("Enter all fields");
      isError = true;
    } else if (!roomId?.trim()) {
      setError("Room id is required");
      isError = true;
    } else if (!roomName?.trim()) {
      setError("Room name is required");
      isError = true;
    }
    const ws = new WebSocket(`ws://localhost:8080?roomId=${roomId}`);
    ws.onopen = () => {
      console.log("✅ Connected to WebSocket server");
      navigate(`/chat/${roomId}`, { state: { username: roomName } });
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error", err);
      setError("Failed to connect to server");
      isError = true;
    };
    if (isError) return;
    console.log(`Room created with the roomId ${roomId} and name ${roomName}`);
  };

  const handleJoinRoom = async () => {
    setJoinError("");
    let hasError = false;
    if (!clientRoomId.trim() && !clientName.trim()) {
      hasError = true;
      setJoinError("Need all fields to join the room");
    } else if (!clientRoomId.trim()) {
      hasError = true;
      setJoinError("Need Room id to join a room");
    } else if (!clientName.trim()) {
      hasError = true;
      setJoinError("Name is required to join a room");
    }

    const ws = new WebSocket(`ws://localhost:8080?roomId=${clientRoomId}`);
    ws.onopen = () => {
      console.log("✅ Connected to WebSocket server");
      navigate(`/chat/${clientRoomId}`, { state: { username: roomName } });
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error", err);
      setError("Failed to connect to server");
      hasError = true;
    };

    if (hasError) return;
    console.log(`Hey ${clientName} room ${clientRoomId} `);
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
              value={roomName || ""}
              onChange={(e) => {
                setRoomName(e.target.value);
                setError("");
              }}
            />
          </div>
          <div className="mt-3 flex items-center gap-2 border-2 text-white rounded-lg border-white/30 p-1 focus:border-white/60 transition-all duration-300 bg-transparent">
            <input
              className="bg-transparent  w-full p-2 text-white outline-none rounded-lg focus:border-white/60 transition-all duration-300"
              placeholder="Room ID"
              value={roomId || ""}
              onChange={(e) => {
                setError("");
              }}
            />
            <IoClipboardOutline
              className={`text-white h-10 w-5 mr-3 ${
                !roomId || !roomId.trim()
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-white hover:text-gray-300"
              }`}
              onClick={copyToClipboard}
            />
          </div>
          <div className="text-red-500 text-sm mt-1">{error}</div>
          <div className="mt-3">
            <button
              className="bg-green-500 text-black p-3 w-full rounded-lg font-semibold hover:bg-opacity-80 transition-all duration-300"
              onClick={() => {
                handleCreateRoom();
              }}
            >
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
              value={clientRoomId || ""}
              onChange={(e) => {
                setClientRoomId(e.target.value.toUpperCase());
                setJoinError("");
              }}
            />
          </div>
          <div className="mt-3">
            <input
              className="bg-transparent border-white/30 border-2 p-3 w-full text-white outline-none rounded-lg focus:border-white/60 transition-all duration-300"
              placeholder="Your Name"
              value={clientName || ""}
              onChange={(e) => {
                setClientName(e.target.value);
                setJoinError("");
              }}
            />
          </div>
          <div className="mt-3">
            <button
              className="bg-white text-black p-3 w-full rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
              onClick={() => {
                handleJoinRoom();
              }}
            >
              Join Room
            </button>
          </div>
          <div className="text-red-500 text-sm mt-1">{joinError}</div>

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
