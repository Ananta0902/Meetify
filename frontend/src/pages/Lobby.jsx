import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    IconButton,
    TextField,
    useTheme,
    useMediaQuery
} from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";

export default function Lobby() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    
    const guest = JSON.parse(sessionStorage.getItem("guest"));
    const meetingCode = guest?.meetingCode || window.location.pathname.split("/")[1] || "";

    // ⚡ STEP 1: Scan all possible storage targets to populate the default input name value
    const getInitialDisplayName = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlName = urlParams.get("name");
        if (urlName && urlName !== "undefined" && urlName !== "null") return decodeURIComponent(urlName);

        if (guest?.displayName && guest.displayName !== "Authenticated User" && guest.displayName !== "User") {
            return guest.displayName;
        }

        const structuralAuthKeys = ["user", "profile", "auth", "account"];
        for (const key of structuralAuthKeys) {
            try {
                const item = localStorage.getItem(key) || sessionStorage.getItem(key);
                if (item) {
                    const parsed = JSON.parse(item);
                    const match = parsed.username || parsed.name || parsed.displayName || parsed.user?.username || parsed.user?.name;
                    if (match) return match;
                }
            } catch (e) {}
        }

        return localStorage.getItem("username") || sessionStorage.getItem("username") || localStorage.getItem("name") || "";
    };

    // ⚡ STEP 2: Bind the resolved profile to an editable React input state field
    const [displayName, setDisplayName] = useState(getInitialDisplayName());
    
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function startPreview() {
            try {
                // Request standard configurations directly
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { width: { ideal: 640 }, height: { ideal: 360 } }, 
                    audio: true 
                });
                if (!isMounted) {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }
                streamRef.current = stream;
                if (videoRef.current) videoRef.current.srcObject = stream;
                stream.getVideoTracks().forEach(track => { track.enabled = cameraOn; });
                stream.getAudioTracks().forEach(track => { track.enabled = micOn; });
            } catch (err) {
                console.error("Lobby preview failed:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        startPreview();
        return () => {
            isMounted = false;
            if (streamRef.current) {
                // Gracefully disable tracks instead of crashing the device layout hardware
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
       // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

    const toggleCamera = () => {
        setCameraOn(prev => {
            if (streamRef.current) streamRef.current.getVideoTracks().forEach(t => t.enabled = !prev);
            return !prev;
        });
    };

    const toggleMic = () => {
        setMicOn(prev => {
            if (streamRef.current) streamRef.current.getAudioTracks().forEach(t => t.enabled = !prev);
            return !prev;
        });
    };

    const handleJoinMeeting = () => {
        // Enforce a generic fallback label if the user deletes the text entry box entirely
        const finalName = displayName.trim() || "User Guest";
        
        const updatedPayload = {
            meetingCode,
            displayName: finalName,
            cameraOn,
            micOn
        };
        sessionStorage.setItem("guest", JSON.stringify(updatedPayload));
        
        // Forward the specific verified string down the route chain
        navigate(`/${meetingCode}?name=${encodeURIComponent(finalName)}`);
    };

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#16161a", display: "flex", alignItems: "center", justifyContent: "center", p: isMobile ? 2 : 4 }}>
            <Card sx={{ width: "100%", maxWidth: isMobile ? "100%" : 768, backgroundColor: "#1c1c24", color: "#ffffff", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <CardContent sx={{ p: isMobile ? 3 : 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <IconButton onClick={() => navigate(-1)} sx={{ color: "#ffffff", mr: 1 }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">Meeting Setup</Typography>
                    </Box>
                    
                    <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 4, alignItems: "center" }}>
                        {/* CAMERA BOX FRAME */}
                        <Box sx={{ flex: 1, width: "100%", aspectRatio: "16/9", backgroundColor: "#000000", borderRadius: "12px", overflow: "hidden", position: "relative", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", display: cameraOn ? "block" : "none" }} />
                            {!cameraOn && (
                                <Box sx={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "#a0aec0", backgroundColor: "#121214" }}>
                                    <Typography variant="body2">Camera is Off</Typography>
                                </Box>
                            )}
                        </Box>

                        {/* FORM & CONTROLS FRAME */}
                        <Box sx={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#0e71eb", textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Room Code: {meetingCode}
                            </Typography>
                            
                            {/* ⚡ STEP 3: The Editable Display Name Field Box */}
                            <TextField
                                fullWidth
                                label="Your Display Name"
                                variant="outlined"
                                margin="normal"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Enter name to display on call"
                                sx={{
                                    mt: 2,
                                    mb: 1,
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: '#16161a',
                                        borderRadius: '8px',
                                        color: '#ffffff',
                                        "& fieldset": { borderColor: 'rgba(255, 255, 255, 0.1)' },
                                        "&:hover fieldset": { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                        "&.Mui-focused fieldset": { borderColor: '#0e71eb' },
                                    },
                                    "& .MuiInputLabel-root": { color: '#a0aec0' },
                                    "& .MuiInputLabel-root.Mui-focused": { color: '#0e71eb' }
                                }}
                            />

                            <Box sx={{ display: "flex", gap: 2, mt: 2, width: '100%', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                                <IconButton onClick={toggleCamera} sx={{ p: 1.5, backgroundColor: cameraOn ? "rgba(14, 113, 235, 0.12)" : "rgba(234, 67, 53, 0.12)", color: cameraOn ? "#0e71eb" : "#ea4335", borderRadius: "8px" }}>
                                    {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
                                </IconButton>
                                <IconButton onClick={toggleMic} sx={{ p: 1.5, backgroundColor: micOn ? "rgba(16, 185, 129, 0.12)" : "rgba(234, 67, 53, 0.12)", color: micOn ? "#10b981" : "#ea4335", borderRadius: "8px" }}>
                                    {micOn ? <MicIcon /> : <MicOffIcon />}
                                </IconButton>
                            </Box>

                            <Button 
                                variant="contained" 
                                size="large" 
                                fullWidth 
                                onClick={handleJoinMeeting} 
                                sx={{ mt: 3, py: 1.5, borderRadius: "8px", backgroundColor: "#0e71eb", textTransform: "none", fontWeight: "bold", fontSize: "0.95rem", '&:hover': { backgroundColor: "#0b5bbf" } }}
                            >
                                Enter Meeting 
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}