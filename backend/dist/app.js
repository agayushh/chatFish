"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const app = new hono_1.Hono();
const websocket_1 = require("./websocket");
app.use("/*", (0, cors_1.cors)());
app.get("/", (c) => c.text("backend of the server is running"));
app.get("/chat/:roomId", (c) => __awaiter(void 0, void 0, void 0, function* () {
    const roomId = c.req.param("roomId");
    if (!websocket_1.roomToSocket.has(roomId)) {
        return c.json({ exist: false }, 404);
    }
    else {
        return c.json({ exist: true }, 200);
    }
}));
app.get("/create/:roomId", (c) => __awaiter(void 0, void 0, void 0, function* () {
    const roomId = c.req.param("roomId");
    if (websocket_1.roomToSocket.has(roomId)) {
        return c.json({ message: "room already exists" }, 400);
    }
    websocket_1.roomToSocket.set(roomId, new Set());
    return c.json({ roomId, message: "room created successfully" });
}));
exports.default = app;
