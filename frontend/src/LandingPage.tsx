import { useState } from "react";
import { useRecoilState } from "recoil";
import { roomIdAtom, roomNameAtom } from "./atom/atom";
import { IoClipboardOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080/api"; // your backend URL

const LandingPage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useRecoilState(roomIdAtom);
  const [roomName, setRoomName] = useRecoilState(roomNameAtom);

  const [clientRoomId, setClientRoomId] = useState("");
  const [clientName, setClientName] = useState("");

  const [error, setError] = useState("");
  const [joinError, setJoinError] = useState("");

  // ✅ Generate random room id
  const generateRoomId = () =>
    Math.random().toString(36).substring(2, 10).toUpperCase();

  // ✅ Copy room id
  const copyToClipboard = async () => {
    if (!roomId || !roomId.trim()) {
      alert("No room ID to copy. Please generate one first.");
      return;
    }
    try {
      await navigator.clipboard.writeText(roomId);
      alert("Copied the room ID: " + roomId);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Create room handler
  const handleCreateRoom = async () => {
    setError("");

    if (!roomId?.trim() || !roomName?.trim()) {
      setError("Room ID and Room Name are required");
      return;
    }

    try {
      console.log(`creating rooom log 1`);
      const res = await fetch(`${API_BASE}/create/${roomId}`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to create room");
        return;
      }

      setRoomId(roomId)
      setRoomName(roomName)
      // success
      console.log("chat room creation on the way");

      navigate(`/chat/${roomId}`, { state: { username: roomName } });
      console.log(`Room created: ${roomId} by ${roomName}`);
    } catch (err) {
      console.error(err);
      setError("Server error while creating room");
    }
  };

  // ✅ Join room handler
  const handleJoinRoom = async () => {
    setJoinError("");

    if (!clientRoomId.trim() || !clientName.trim()) {
      setJoinError("Room ID and Name are required");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/chat/${clientRoomId}/join`, {method: "POST"});
      if (!res.ok) {
        const data = await res.json();
        setJoinError("Room does not exist");
        return;
      }

      setRoomId(clientRoomId)
      setRoomName(clientName)

      // success
      navigate(`/chat/${clientRoomId}`, { state: { username: clientName } });
      console.log(`User ${clientName} joined room: ${clientRoomId}`);
    } catch (err) {
      console.error(err);
      setJoinError("Server error while joining room");
    }
  };

  return (
    <div className="bg-gradient-to-tl from-black via-slate-800 to-slate-900 h-screen w-screen flex items-center justify-center">
      <div className="border-white/20 border-2 backdrop-blur-sm bg-black/30 rounded-xl h-[78vh] w-[35vw] p-8 shadow-lg shadow-black/50 hover:border-white/40 transition-all duration-300">
        <h1 className="text-white text-4xl font-mono font-bold tracking-wider">
          ChatFish
        </h1>

        {/* --- Create Room --- */}
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
        <div className="mt-3 flex items-center gap-2 border-2 text-white rounded-lg border-white/30 p-1 bg-transparent">
          <input
            className="bg-transparent w-full p-2 text-white outline-none rounded-lg"
            placeholder="Room ID"
            value={roomId || ""}
            onChange={(e) => {
              setRoomId(e.target.value.toUpperCase());
              setError("");
            }}
          />
          <IoClipboardOutline
            className={`h-10 w-5 mr-3 cursor-pointer ${
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
            onClick={() => setRoomId(generateRoomId())}
          >
            Generate Room ID
          </button>
        </div>

        {/* --- Join Room --- */}
        <br />
        <span className="text-white/90 text-xl font-semibold">Join a Room</span>
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
            onClick={handleJoinRoom}
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
  );
};

export default LandingPage;
