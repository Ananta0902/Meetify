import { Server } from "socket.io";

const rooms = {};
const messages = {};

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket Connected:", socket.id);

        // ==========================
        // JOIN ROOM
        // ==========================
        socket.on("join-call", ({ roomId, username }) => {
            socket.join(roomId);
            socket.roomId = roomId;
            socket.username = username;

            if (!rooms[roomId]) {
                rooms[roomId] = [];
            }

            // Existing users
            const existingUsers = [...rooms[roomId]];

            // Send ONLY to new user
            socket.emit("room-users", existingUsers);

            // Save new user
            rooms[roomId].push({
                socketId: socket.id,
                username
            });

            // Notify others
            socket.to(roomId).emit("user-joined", {
                socketId: socket.id,
                username
            });

            // Old messages
            if (messages[roomId]) {
                socket.emit("chat-history", messages[roomId]);
            }

            console.log(`${username} joined ${roomId}`);
        });

socket.on("toggle-mic", ({ roomId, isMuted }) => {
    socket.to(roomId).emit("user-mic-status", {
        socketId: socket.id,
        isMuted: isMuted
    });
});
        // ==========================
        // WEBRTC SIGNALS (FIXED)
        // ==========================
        socket.on("signal", (toId, signal) => {
            // Forward the payload down to the specific user's socket ID
            io.to(toId).emit("signal", {
                fromId: socket.id,
                signal: signal
            });
        });


        // ==========================
        // CHAT
        // ==========================
        socket.on("chat-message", (message, username) => {
            const roomId = socket.roomId;
            if (!roomId) return;

            const chat = {
                sender: username || socket.username || "Guest",
                data: message,
                socketId: socket.id
            };

            if (!messages[roomId]) {
                messages[roomId] = [];
            }

            messages[roomId].push(chat);

            io.to(roomId).emit("chat-message", message, chat.sender, socket.id);
        });

        // ==========================
        // DISCONNECT
        // ==========================
        socket.on("disconnect", () => {
            const roomId = socket.roomId;
            if (!roomId) return;

            console.log(socket.username, "left");

            if (!rooms[roomId]) return;

            rooms[roomId] = rooms[roomId].filter(
                user => user.socketId !== socket.id
            );

            socket.to(roomId).emit("user-left", socket.id);

            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
                delete messages[roomId];
            }
        });
    });

    return io;
};