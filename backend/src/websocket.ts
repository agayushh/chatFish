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
          const roomId = parsedMessage.payload.roomId;
          if (roomToSocket.has(roomId)) {
            console.log(`room with name ${roomId} already exists`);
            socket.send(
              JSON.stringify({
                type: "error",
                message: "Room already exists",
              })
            );
            return;
          }
          roomToSocket.set(roomId, new Set([socket]));
          socketToRoom.set(socket, roomId);
          socket.send(JSON.stringify({ type: "created", payload: { roomId } }));
          console.log(`room with name ${roomId} created`);
          return;
        }

        if (parsedMessage.type === "join") {
          const roomId = parsedMessage.payload.roomId;
          console.log("Welcome to the room");
          if (!roomToSocket.has(roomId)) {
            socket.send(
              JSON.stringify({
                type: "error",
                payload: { message: "Room not found" },
              })
            );
            return;
          }

          if (socketToRoom.has(socket)) {
            console.log("you are already in the room id");
          }
          roomToSocket.get(roomId)!.add(socket);
          socketToRoom.set(socket, roomId);

          socket.send(JSON.stringify({ type: "joined", payload: { roomId } }));
        }
        if (parsedMessage.type === "chat") {
          const room = socketToRoom.get(socket);
          if (room) {
            roomToSocket.get(room)?.forEach((x) => {
              if (x !== socket) x.send(
                JSON.stringify({
                  type: "chat",
                  payload: { message: parsedMessage.payload.message },
                  sender: "User",
                  timestamp: new Date().toISOString(),
                })
              );
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
