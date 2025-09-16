import { initWebSocket } from "./websocket"
import app from "./app"
import { serve } from '@hono/node-server'


const server = serve({ fetch: app.fetch, port: 8080 })

initWebSocket(server)

console.log(`Server is running at http://localhost:8080`);
