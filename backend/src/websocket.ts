import { WebSocketServer, WebSocket } from "ws";

interface User {
  socket: WebSocket;
  room: string;
}
const socketToRoom = new Map<WebSocket, string>();
const roomToSocket = new Map<string, Set<WebSocket>>();
export function initWebSocket(server: any) {
  const wss = new WebSocketServer({ server });

  // const userRoom = new Map<string, Set<WebSocket>>()
  wss.on("connection", (socket) => {
    try {
      socket.on("message", (message: string) => {
        const parsedMessage = JSON.parse(message);
        if (!parsedMessage || !parsedMessage.type) {
          console.log("enter something mate");
        }

        if (parsedMessage.type === "join") {
          console.log("Welcome to the room");
          if (socketToRoom.has(socket)) {
            console.log(
              "you are already in the room id",
              socketToRoom.get(socket)
            );
          } else {
            socketToRoom.set(socket, parsedMessage.payload.roomName);
            if (!roomToSocket.has(parsedMessage.payload.roomName)) {
              roomToSocket.set(parsedMessage.payload.roomName, new Set());
            }
            roomToSocket.get(parsedMessage.payload.roomName)!.add(socket);
          }
        }
        if (parsedMessage.type === "chat") {
          const room = socketToRoom.get(socket);
          if (room) {
            roomToSocket.get(room)?.forEach((x) => {
              if (x !== socket) x.send(parsedMessage.payload.message);
            });
          }
        }
        if (parsedMessage.type === "leave") {
          const room = socketToRoom.get(socket);
          if (room) {
            socketToRoom.delete(socket);
            roomToSocket.get(room)?.delete(socket);
            roomToSocket
              .get(room)
              ?.forEach((x) => x.send(`User has left the room from ${room}`));
            if (roomToSocket.get(room)?.size === 0) {
              roomToSocket.delete(room);
            }
          }
        }
      });
      socket.on("close", () => {
        const room = socketToRoom.get(socket);

        socketToRoom.delete(socket);
        if (room && roomToSocket.has(room)) {
          roomToSocket.get(room)!.delete(socket);
          roomToSocket
            .get(room)
            ?.forEach((x) => x.send(`User has closed the room`));
          if (roomToSocket.get(room)!.size === 0) {
            roomToSocket.delete(room);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
}
