import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SERVER_URL = process.env.REACT_APP_API_URL;

export default function useSocket() {
    const socketRef = useRef(null);
    const callbacksRef = useRef({
        signal: null,
        roomUsers: null,
        userJoined: null,
        userLeft: null,
        chat: null,
        chatHistory: null
    });

    useEffect(() => {
        if (socketRef.current) return;

        const socket = io(SERVER_URL, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            autoConnect: true
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("✅ Connected:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("❌ Disconnected");
        });

        // Use stable forwarders pointing to the latest registered component callbacks
        socket.on("signal", (data) => {
            callbacksRef.current.signal?.(data);
        });
        
        socket.on("room-users", (users) => {
            const normalized = Array.isArray(users) ? users.map(u => ({
                socketId: u.socketId || u.id || u,
                username: u.username || u.name || "User"
            })) : [];
            callbacksRef.current.roomUsers?.(normalized);
        });

        const handleUserJoined = (data) => {
            if (!data) return;
            const normalizedUser = {
                socketId: data.socketId || data.id || data,
                username: data.username || data.name || "User"
            };
            callbacksRef.current.userJoined?.(normalizedUser);
        };
        socket.on("user-joined", handleUserJoined);
        socket.on("user-joined-call", handleUserJoined);

        const handleUserLeft = (data) => {
            const socketId = typeof data === "object" ? (data.socketId || data.id) : data;
            callbacksRef.current.userLeft?.(socketId);
        };
        socket.on("user-left", handleUserLeft);
        socket.on("user-left-call", handleUserLeft);

        socket.on("chat-message", (...args) => callbacksRef.current.chat?.(...args));
        socket.on("chat-history", (...args) => callbacksRef.current.chatHistory?.(...args));

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    const joinRoom = (roomId, username) => {
        if (!socketRef.current) return;
        console.log(`📡 Joining Room: ${roomId} as User: ${username}`);
        socketRef.current.emit("join-call", { roomId, username });
    };

    const sendSignal = (toId, signal) => {
        socketRef.current?.emit("signal", toId, signal);
    };

    const sendChat = (message, username) => {
        socketRef.current?.emit("chat-message", message, username);
    };

    return {
        socket: socketRef.current,
        joinRoom,
        sendSignal,
        sendChat,
        onSignal: (cb) => { callbacksRef.current.signal = cb; },
        onRoomUsers: (cb) => { callbacksRef.current.roomUsers = cb; },
        onUserJoined: (cb) => { callbacksRef.current.userJoined = cb; },
        onUserLeft: (cb) => { callbacksRef.current.userLeft = cb; },
        onChat: (cb) => { callbacksRef.current.chat = cb; },
        onChatHistory: (cb) => { callbacksRef.current.chatHistory = cb; },
        disconnect: () => socketRef.current?.disconnect()
    };
}