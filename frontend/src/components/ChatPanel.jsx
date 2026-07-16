import React, { useEffect, useRef, useState } from "react"; // Added useState
import { IconButton, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import styles from "../styles/VideoComponent.module.css";

// Use React.memo so ChatPanel doesn't re-render unless messages list actually changes!
const ChatPanel = React.memo(function ChatPanel({
    open,
    messages,
    sendMessage, // sendMessage now expects a text string argument
    onClose
}) {
    const bottomRef = useRef(null);
    // Keep typing input state local to ChatPanel!
    const [localMessage, setLocalMessage] = useState(""); 

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    if (!open) return null;

    const handleSend = () => {
        if (!localMessage.trim()) return;
        sendMessage(localMessage); // Send local input value up to backend
        setLocalMessage(""); // Clear local input field
    };

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
                    value={localMessage} // Bound to local state instead of parent
                    onChange={(e) => setLocalMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
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
                    onClick={handleSend}
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
});

export default ChatPanel;