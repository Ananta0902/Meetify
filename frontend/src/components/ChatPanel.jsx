import React, { useEffect, useRef } from "react";
import { IconButton, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import styles from "../styles/VideoComponent.module.css";

export default function ChatPanel({
    open,
    messages,
    message,
    setMessage,
    sendMessage,
    onClose
}) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    if (!open) return null;

    return (
        <div className={styles.chatPanel}>
            <div className={styles.chatHeader}>
                <h3>Meeting Chat</h3>
                <IconButton onClick={onClose} sx={{ color: "#a0aec0" }}>
                    <CloseIcon />
                </IconButton>
            </div>

            <div className={styles.chatMessages}>
                {messages.length === 0 ? (
                    <p className={styles.empty}>No messages yet. Say hello!</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={styles.messageCard}>
                            <div className={styles.messageHeader}>
                                <span className={styles.messageSender}>{msg.sender}</span>
                            </div>
                            <p className={styles.messageText}>{msg.data}</p>
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            <div className={styles.chatInputContainer}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Type message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "#ffffff",
                            backgroundColor: "#24242c",
                            borderRadius: "8px",
                            "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                            "&.Mui-focused fieldset": { borderColor: "#0e71eb" },
                        }
                    }}
                />
                <Button
                    variant="contained"
                    onClick={sendMessage}
                    sx={{
                        minWidth: "50px",
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: "#0e71eb",
                        "&:hover": { backgroundColor: "#0b5bbf" }
                    }}
                >
                    <SendIcon fontSize="small" />
                </Button>
            </div>
        </div>
    );
}