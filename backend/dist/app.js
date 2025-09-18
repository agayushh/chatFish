"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const app = new hono_1.Hono();
const websocket_1 = require("./websocket");
app.use("/*", (0, cors_1.cors)());
app.get("/", (c) => c.text("backend of the server is running"));
app.get("/api/create/:roomId", (c) => {
    const roomId = c.req.param("roomId");
    if (!websocket_1.roomToSocket.has(roomId)) {
        return c.json({ exist: false }, 404);
    }
    else {
        return c.json({ exist: true }, 200);
    }
});
app.post("/api/create/:roomId", (c) => {
    const roomId = c.req.param("roomId");
    console.log("creating room", roomId);
    if (!websocket_1.roomToSocket.has(roomId)) {
        websocket_1.roomToSocket.set(roomId, new Set());
        return c.json({ roomId, message: "room created successfully" });
    }
    return c.json({ message: "room already exists" }, 400);
});
app.post("/api/chat/:clientRoomId/join", (c) => {
    const clientRoomId = c.req.param("clientRoomId");
    console.log("hi there log 3");
    if (!websocket_1.roomToSocket.has(clientRoomId)) {
        return c.json({ message: "room does not exist create one" }, 404);
    }
    return c.json({ message: "chat endpoint" });
});
exports.default = app;
