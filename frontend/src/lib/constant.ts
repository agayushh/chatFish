const BE_DOMAIN="be.chatfish.agayush.me";
const IS_LOCAL = false;
export const API_BASE = IS_LOCAL ? `http://${BE_DOMAIN}/api` : `https://${BE_DOMAIN}/api`;
export const WS_BASE = IS_LOCAL ? `ws://${BE_DOMAIN}` : `ws://${BE_DOMAIN}`;

console.log("API_BASE", API_BASE);
console.log("WS_BASE", WS_BASE);