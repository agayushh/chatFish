"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        var _a;
        //@ts-ignore
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "join") {
            console.log(`you joined room ${parsedMessage.payload.roomId}`);
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId,
            });
        }
        if (parsedMessage.type === "chat") {
            console.log("user wants to chat");
            const currentUserRoom = (_a = allSockets.find((x) => x.socket === socket)) === null || _a === void 0 ? void 0 : _a.room;
            const allUserWithSameRoom = allSockets.filter((x) => x.room === currentUserRoom);
            allUserWithSameRoom.forEach((user) => {
                user.socket.send(parsedMessage.payload.message);
            });
        }
    });
});
