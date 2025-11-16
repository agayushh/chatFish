import React, { useState } from "react";

const Landing = () => {
  const [roomId, setRoomId] = useState("");

  const generateRoomId = () => {
    Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const copyToClipboard = async () => {
    if (!roomId || !roomId.trim()) {
      alert("Generate a room ID first");
      return;
    }
    try {
      navigator.clipboard.writeText(roomId);
      alert(`room id ${roomId} copied`);
      return;
    } catch (error) {
      alert("Couldn't copy the room ID due to" + error);
    }
  };

  return <div>
    
  </div>;
};

export default Landing;
