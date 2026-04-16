import { Server } from "socket.io";
import http from "http";
import app from "../app.js";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: (process.env.CLIENT_URLS || "http://localhost:5173").split(",").map(o => o.trim()),
        methods: ["GET", "POST"],
        credentials: true
    }
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }

    socket.on("disconnect", () => {
        if(userId) delete userSocketMap[userId];
    });
});

export { app, io, server };
