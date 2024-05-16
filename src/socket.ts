import { io } from "socket.io-client";

const URL: string = "https://chathub-backend-v3lv.onrender.com";

export const socket = io(URL);
