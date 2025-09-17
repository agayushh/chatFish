import { Hono } from "hono";
import {cors} from "hono/cors";
const app = new Hono();
import { roomToSocket } from "./websocket";

app.use("/*", cors());
app.get("/", (c) => c.text("backend of the server is running"));

app.get("/chat/:roomId", async (c) => {
  const roomId = c.req.param("roomId");

  if (!roomToSocket.has(roomId)) {
    return c.json({ exist: false }, 404);
  } else {
    return c.json({ exist: true }, 200);
  }
});

app.get("/create/:roomId", async (c) => {
  const roomId = c.req.param("roomId");
  if (roomToSocket.has(roomId)) {
    return c.json({ message: "room already exists" }, 400);
  }
  roomToSocket.set(roomId, new Set());
  return c.json({ roomId, message: "room created successfully" });
});

export default app;
