import { Hono } from "hono";
const app = new Hono();

app.get("/chat/:roomId", async (c) => {
  const roomId = c.req.param("roomId");
  return c.json({ message: "You joined the room" });
});

export default app;
