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

  // Generate random room id
  const generateRoomId = () =>
    Math.random().toString(36).substring(2, 10).toUpperCase();

  // Copy room id
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

  // Create room handler
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

      setRoomId(roomId);
      setRoomName(roomName);
      // success
      console.log("chat room creation on the way");

      navigate(`/chat/${roomId}`);
      console.log(`Room created: ${roomId} by ${roomName}`);
    } catch (err) {
      console.error(err);
      setError("Server error while creating room");
    }
  };

  //Join room handler
  const handleJoinRoom = async () => {
    setJoinError("");

    if (!clientRoomId.trim() || !clientName.trim()) {
      setJoinError("Room ID and Name are required");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/chat/${clientRoomId}/join`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        setJoinError("Room does not exist");
        return;
      }

      setRoomId(clientRoomId);
      setRoomName(clientName);

      // success
      navigate(`/chat/${clientRoomId}`, { state: { username: clientName } });
      console.log(`User ${clientName} joined room: ${clientRoomId}`);
    } catch (err) {
      console.error(err);
      setJoinError("Server error while joining room");
    }
  };

  return (
    <div className="bg-gradient-to-tl from-black via-slate-800 to-slate-900 min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-mono font-bold tracking-wider text-white mb-4">
            ChatFish
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Connect and chat in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 shadow-lg hover:border-white/20 transition-all duration-300">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">
              Create a Room
            </h2>

            <div className="space-y-4 mb-6">
              <input
                className="w-full bg-transparent border-2 border-white/20 rounded-xl p-3 md:p-4 text-white placeholder-gray-400 outline-none focus:border-blue-400 transition-all duration-300"
                placeholder="Room Name"
                value={roomName || ""}
                onChange={(e) => {
                  setRoomName(e.target.value);
                  setError("");
                }}
              />

              <div className="relative">
                <input
                  className="w-full bg-transparent border-2 border-white/20 rounded-xl p-3 md:p-4 pr-12 text-white placeholder-gray-400 outline-none focus:border-blue-400 transition-all duration-300"
                  placeholder="Room ID"
                  value={roomId || ""}
                  onChange={(e) => {
                    setRoomId(e.target.value.toUpperCase());
                    setError("");
                  }}
                />
                <button
                  onClick={copyToClipboard}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-colors ${
                    !roomId || !roomId.trim()
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-white hover:text-blue-400 hover:bg-white/10"
                  }`}
                  disabled={!roomId || !roomId.trim()}
                >
                  <IoClipboardOutline className="h-5 w-5" />
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleCreateRoom}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 md:py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Create Room
              </button>

              <button
                onClick={() => setRoomId(generateRoomId())}
                className="w-full bg-white/10 text-white font-semibold py-3 md:py-4 px-6 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
              >
                Generate Room ID
              </button>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 shadow-lg hover:border-white/20 transition-all duration-300">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">
              Join a Room
            </h2>

            <div className="space-y-4 mb-6">
              <input
                className="w-full bg-transparent border-2 border-white/20 rounded-xl p-3 md:p-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 transition-all duration-300"
                placeholder="Room ID"
                value={clientRoomId || ""}
                onChange={(e) => {
                  setClientRoomId(e.target.value.toUpperCase());
                  setJoinError("");
                }}
              />

              <input
                className="w-full bg-transparent border-2 border-white/20 rounded-xl p-3 md:p-4 text-white placeholder-gray-400 outline-none focus:border-purple-400 transition-all duration-300"
                placeholder="Your Name"
                value={clientName || ""}
                onChange={(e) => {
                  setClientName(e.target.value);
                  setJoinError("");
                }}
              />
            </div>

            {joinError && (
              <div className="text-red-400 text-sm mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                {joinError}
              </div>
            )}

            <button
              onClick={handleJoinRoom}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 md:py-4 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Join Room
            </button>
          </div>
        </div>

        <div className="text-center mt-8 md:mt-12">
          <p className="text-gray-400 text-xs md:text-sm italic px-4 max-w-2xl mx-auto">
            Note: This is a demo project. Please do not share any personal
            information in the chat rooms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
