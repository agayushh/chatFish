"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebSocket = initWebSocket;
const ws_1 = require("ws");
const socketToRoom = new Map();
const roomToSocket = new Map();
function initWebSocket(server) {
    const wss = new ws_1.WebSocketServer({ server });
    // const userRoom = new Map<string, Set<WebSocket>>()
    wss.on("connection", (socket) => {
        try {
            socket.on("message", (message) => {
                var _a, _b, _c, _d;
                const parsedMessage = JSON.parse(message);
                if (!parsedMessage || !parsedMessage.type) {
                    console.log("enter something mate");
                }
                if (parsedMessage.type === "join") {
                    console.log("Welcome to the room");
                    if (socketToRoom.has(socket)) {
                        console.log("you are already in the room id", socketToRoom.get(socket));
                    }
                    else {
                        socketToRoom.set(socket, parsedMessage.payload.roomName);
                        if (!roomToSocket.has(parsedMessage.payload.roomName)) {
                            roomToSocket.set(parsedMessage.payload.roomName, new Set());
                        }
                        roomToSocket.get(parsedMessage.payload.roomName).add(socket);
                    }
                }
                if (parsedMessage.type === "chat") {
                    const room = socketToRoom.get(socket);
                    if (room) {
                        (_a = roomToSocket.get(room)) === null || _a === void 0 ? void 0 : _a.forEach((x) => {
                            if (x !== socket)
                                x.send(parsedMessage.payload.message);
                        });
                    }
                }
                if (parsedMessage.type === "leave") {
                    const room = socketToRoom.get(socket);
                    if (room) {
                        socketToRoom.delete(socket);
                        (_b = roomToSocket.get(room)) === null || _b === void 0 ? void 0 : _b.delete(socket);
                        (_c = roomToSocket
                            .get(room)) === null || _c === void 0 ? void 0 : _c.forEach((x) => x.send(`User has left the room from ${room}`));
                        if (((_d = roomToSocket.get(room)) === null || _d === void 0 ? void 0 : _d.size) === 0) {
                            roomToSocket.delete(room);
                        }
                    }
                }
            });
            socket.on("close", () => {
                var _a;
                const room = socketToRoom.get(socket);
                socketToRoom.delete(socket);
                if (room && roomToSocket.has(room)) {
                    roomToSocket.get(room).delete(socket);
                    (_a = roomToSocket
                        .get(room)) === null || _a === void 0 ? void 0 : _a.forEach((x) => x.send(`User has closed the room`));
                    if (roomToSocket.get(room).size === 0) {
                        roomToSocket.delete(room);
                    }
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    });
}
