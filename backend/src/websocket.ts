import { WebSocketServer, WebSocket } from "ws";

interface User {
  socket: WebSocket;
  room: string;
}
const socketToRoom = new Map<WebSocket, string>();
export const roomToSocket = new Map<string, Set<WebSocket>>();
export function initWebSocket(server: any) {
  const wss = new WebSocketServer({ server });

  // const userRoom = new Map<string, Set<WebSocket>>()
  wss.on("connection", (socket) => {
    try {
      socket.on("message", (message: Buffer) => {
        const parsedMessage = JSON.parse(message.toString());
        if (!parsedMessage || !parsedMessage.type) {
          console.log("enter something mate");
        }

        if (parsedMessage.type === "create") {
          const roomName = parsedMessage.payload.roomName;
          if (roomToSocket.has(roomName)) {
            console.log(`room with name ${roomName} already exists`);
            socket.send(
              JSON.stringify({
                type: "error",
                message: "Room already exists",
              })
            );
            return;
          }
          roomToSocket.set(roomName, new Set([socket]));
          socketToRoom.set(socket, roomName);
          socket.send(
            JSON.stringify({ type: "created", payload: { roomName } })
          );
          console.log(`room with name ${roomName} created`);
          return;
        }

        if (parsedMessage.type === "join") {
          const roomName = parsedMessage.payload.roomName;
          console.log("Welcome to the room");
          if (!roomToSocket.has(roomName)) {
            socket.send(
              JSON.stringify({
                type: "error",
                payload: { message: "Room not found" },
              })
            );
            return;
          }

          roomToSocket.get(roomName)!.add(socket);
          socketToRoom.set(socket, roomName);
          if (socketToRoom.has(socket)) {
            console.log(
              "you are already in the room id",
              socketToRoom.get(socket)
            );
          } else {
            socketToRoom.set(socket, roomName);
            socket.send(
              JSON.stringify({ type: "joined", payload: { roomName } })
            );
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
