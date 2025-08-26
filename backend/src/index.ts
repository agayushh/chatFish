import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];
wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    //@ts-ignore
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === "join") {
      console.log(`you joined room ${parsedMessage.payload.roomId}`);
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId,
      });
    }
    if (parsedMessage.type === "chat") {
      console.log("user wants to chat");
      const currentUserRoom = allSockets.find((x) => x.socket === socket)?.room;
      const allUserWithSameRoom = allSockets.filter(
        (x) => x.room === currentUserRoom
      );
      allUserWithSameRoom.forEach((user) => {
        user.socket.send(parsedMessage.payload.message);
      });
    }
  });
});
