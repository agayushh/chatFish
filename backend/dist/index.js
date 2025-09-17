"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("./websocket");
const app_1 = __importDefault(require("./app"));
const node_server_1 = require("@hono/node-server");
const server = (0, node_server_1.serve)({ fetch: app_1.default.fetch, port: 8080 }, () => {
    console.log(`Server is running at http://localhost:8080`);
});
(0, websocket_1.initWebSocket)(server);
