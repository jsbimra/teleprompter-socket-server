const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ["https://telepromp.doableyo.com",
            "teleprompter-app-ilfb.vercel.app",
            "http://localhost:3000"
        ], // later replace * with your frontend domain
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join", (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);
    });

    socket.on("control", ({ roomId, action, payload }) => {
        console.log("Control event:", action, payload);
        socket.to(roomId).emit("control", { action, payload });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Socket.IO server running on port ${PORT}`);
});
