import { Hono } from "hono";
import { cors } from "hono/cors";
const app = new Hono();
import { roomToSocket } from "./websocket";

app.use("/*", cors());
app.get("/", (c) => c.text("backend of the server is running"));

app.get("/api/create/:roomId", (c) => {
  const roomId = c.req.param("roomId");

  if (!roomToSocket.has(roomId)) {
    return c.json({ exist: false }, 404);
  } else {
    return c.json({ exist: true }, 200);
  }
});

app.post("/api/create/:roomId", (c) => {
  const roomId = c.req.param("roomId");
  console.log("creating room", roomId);
  if (!roomToSocket.has(roomId)) {
    roomToSocket.set(roomId, new Set());
    return c.json({ roomId, message: "room created successfully" });
  }
  return c.json({ message: "room already exists" }, 400);
});

app.post("/api/chat/:clientRoomId/join", (c) => {
  const clientRoomId = c.req.param("clientRoomId");
  console.log("hi there log 3");
  if (!roomToSocket.has(clientRoomId)) {
    return c.json({ message: "room does not exist create one" }, 404);
  }
  return c.json({ message: "chat endpoint" });
});

export default app;
