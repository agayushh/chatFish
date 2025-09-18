"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomToSocket = void 0;
exports.initWebSocket = initWebSocket;
const ws_1 = require("ws");
const socketToRoom = new Map();
exports.roomToSocket = new Map();
function initWebSocket(server) {
    const wss = new ws_1.WebSocketServer({ server });
    // const userRoom = new Map<string, Set<WebSocket>>()
    wss.on("connection", (socket) => {
        try {
            socket.on("message", (message) => {
                var _a, _b, _c, _d;
                const parsedMessage = JSON.parse(message.toString());
                if (!parsedMessage || !parsedMessage.type) {
                    console.log("enter something mate");
                }
                if (parsedMessage.type === "create") {
                    const roomId = parsedMessage.payload.roomId;
                    if (exports.roomToSocket.has(roomId)) {
                        console.log(`room with name ${roomId} already exists`);
                        socket.send(JSON.stringify({
                            type: "error",
                            message: "Room already exists",
                        }));
                        return;
                    }
                    exports.roomToSocket.set(roomId, new Set([socket]));
                    socketToRoom.set(socket, roomId);
                    socket.send(JSON.stringify({ type: "created", payload: { roomId } }));
                    console.log(`room with name ${roomId} created`);
                    return;
                }
                if (parsedMessage.type === "join") {
                    const roomId = parsedMessage.payload.roomId;
                    console.log("Welcome to the room");
                    if (!exports.roomToSocket.has(roomId)) {
                        socket.send(JSON.stringify({
                            type: "error",
                            payload: { message: "Room not found" },
                        }));
                        return;
                    }
                    if (socketToRoom.has(socket)) {
                        console.log("you are already in the room id");
                    }
                    exports.roomToSocket.get(roomId).add(socket);
                    socketToRoom.set(socket, roomId);
                    socket.send(JSON.stringify({ type: "joined", payload: { roomId } }));
                }
                if (parsedMessage.type === "chat") {
                    const room = socketToRoom.get(socket);
                    if (room) {
                        (_a = exports.roomToSocket.get(room)) === null || _a === void 0 ? void 0 : _a.forEach((x) => {
                            if (x !== socket)
                                x.send(JSON.stringify({
                                    type: "chat",
                                    payload: { message: parsedMessage.payload.message },
                                    sender: "Anonymous",
                                    timestamp: new Date().toISOString(),
                                }));
                        });
                    }
                }
                if (parsedMessage.type === "leave") {
                    const room = socketToRoom.get(socket);
                    if (room) {
                        socketToRoom.delete(socket);
                        (_b = exports.roomToSocket.get(room)) === null || _b === void 0 ? void 0 : _b.delete(socket);
                        (_c = exports.roomToSocket
                            .get(room)) === null || _c === void 0 ? void 0 : _c.forEach((x) => x.send(`User has left the room from ${room}`));
                        if (((_d = exports.roomToSocket.get(room)) === null || _d === void 0 ? void 0 : _d.size) === 0) {
                            exports.roomToSocket.delete(room);
                        }
                    }
                }
            });
            socket.on("close", () => {
                var _a;
                const room = socketToRoom.get(socket);
                socketToRoom.delete(socket);
                if (room && exports.roomToSocket.has(room)) {
                    exports.roomToSocket.get(room).delete(socket);
                    (_a = exports.roomToSocket
                        .get(room)) === null || _a === void 0 ? void 0 : _a.forEach((x) => x.send(`User has closed the room`));
                    if (exports.roomToSocket.get(room).size === 0) {
                        exports.roomToSocket.delete(room);
                    }
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    });
}
