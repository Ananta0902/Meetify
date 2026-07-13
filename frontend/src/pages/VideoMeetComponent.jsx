import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Controls from "../components/Controls";
import ChatPanel from "../components/ChatPanel";

import useSocket from "../hooks/useSocket";
import useWebRTC from "../hooks/useWebRTC";

import styles from "../styles/VideoComponent.module.css";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

function useAudioSpeakerDetector(stream, onSpeakingChange, isMuted) {
    useEffect(() => {
        if (isMuted) {
            onSpeakingChange(false);
            return;
        }
        if (!stream || stream.getAudioTracks().length === 0) return;
        
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.every(track => !track.enabled || track.muted)) {
            onSpeakingChange(false);
            return;
        }

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.4;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        let speakingTimeout = null;
        let isSpeaking = false;
        let animationFrameId;

        const checkVolume = () => {
            if (isMuted || audioTracks.every(track => !track.enabled || track.muted)) {
                if (isSpeaking) {
                    isSpeaking = false;
                    onSpeakingChange(false);
                }
                animationFrameId = requestAnimationFrame(checkVolume);
                return;
            }

            analyser.getByteFrequencyData(dataArray);
            
            let maxVolume = 0;
            for (let i = 0; i < bufferLength; i++) {
                if (dataArray[i] > maxVolume) {
                    maxVolume = dataArray[i];
                }
            }

            if (maxVolume > 45) {
                if (!isSpeaking) {
                    isSpeaking = true;
                    onSpeakingChange(true);
                }
                if (speakingTimeout) clearTimeout(speakingTimeout);
            } else {
                if (isSpeaking && !speakingTimeout) {
                    speakingTimeout = setTimeout(() => {
                        isSpeaking = false;
                        onSpeakingChange(false);
                        speakingTimeout = null;
                    }, 450);
                }
            }

            animationFrameId = requestAnimationFrame(checkVolume);
        };

        checkVolume();

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (speakingTimeout) clearTimeout(speakingTimeout);
            audioContext.close();
        };
   }, [stream, isMuted, onSpeakingChange]);
}

function IndividualVideoCard({ stream, displayName, isLocal, isMutedBySync }) {
    const [isSpeaking, setIsSpeaking] = useState(false);

    useAudioSpeakerDetector(stream, (speakingState) => {
        setIsSpeaking(speakingState);
    }, isMutedBySync);

    return (
        <div style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#1c1c24',
            border: isSpeaking ? '3px solid #10b981' : '3px solid rgba(255, 255, 255, 0.08)',
            boxShadow: isSpeaking ? '0px 0px 24px rgba(16, 185, 129, 0.45)' : 'none',
            transition: 'border 0.2s ease, box-shadow 0.2s ease',
            width: '100%',
            height: '100%'
        }}>
            <video
                ref={(ref) => {
                    if (ref && stream) ref.srcObject = stream;
                }}
                autoPlay
                playsInline
                muted={isLocal} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            
            <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 500,
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span>{displayName} {isLocal && "(You)"}</span>
                {isMutedBySync ? (
                    <MicOffIcon style={{ color: '#ea4335', fontSize: '1rem' }} />
                ) : (
                    <MicIcon style={{ color: '#10b981', fontSize: '1rem' }} />
                )}
            </div>
        </div>
    );
}

export default function VideoMeetComponent() {
    const navigate = useNavigate();
    const guest = JSON.parse(sessionStorage.getItem("guest"));
    const hasJoinedRef = useRef(false);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const cleanPathroom = window.location.pathname.replace(/^\//, "").split('?')[0];
    const roomId = cleanPathroom && cleanPathroom !== "" ? cleanPathroom : (guest?.meetingCode || sessionStorage.getItem("meetingCode"));

    const getAuthenticatedUsername = () => {
        const sessionGuest = JSON.parse(sessionStorage.getItem("guest") || "null");
        if (sessionGuest?.displayName && sessionGuest.displayName !== "Authenticated User" && sessionGuest.displayName !== "User") {
            return sessionGuest.displayName;
        }
        if (sessionGuest?.username && sessionGuest.username !== "Authenticated User" && sessionGuest.username !== "User") {
            return sessionGuest.username;
        }

        const directUser = localStorage.getItem("username") || sessionStorage.getItem("username");
        const directName = localStorage.getItem("name") || sessionStorage.getItem("name");
        
        if (directUser && directUser !== "User" && directUser !== "Authenticated User") return directUser;
        if (directName && directName !== "User" && directName !== "Authenticated User") return directName;

        const structuralKeys = ["user", "profile", "auth", "account", "credentials", "supabase.auth.token", "firebase:authUser"];
        for (const key of structuralKeys) {
            try {
                const rawItem = localStorage.getItem(key) || sessionStorage.getItem(key);
                if (rawItem) {
                    const parsed = JSON.parse(rawItem);
                    const targetMatch = parsed.username || parsed.name || parsed.displayName || parsed.fullName || 
                                        parsed.user?.username || parsed.user?.name || parsed.user?.user_metadata?.full_name ||
                                        parsed.current_user?.name || parsed.current_user?.username;
                    if (targetMatch && targetMatch !== "User" && targetMatch !== "Authenticated User") return targetMatch;
                }
            } catch (e) {}
        }

        const urlParams = new URLSearchParams(window.location.search);
        const urlName = urlParams.get("name");
        if (urlName && urlName !== "undefined" && urlName !== "null" && urlName !== "User" && urlName !== "Authenticated User") {
            return decodeURIComponent(urlName);
        }

        const directEmail = localStorage.getItem("email") || sessionStorage.getItem("email") || sessionGuest?.email || sessionGuest?.user?.email;
        if (directEmail && directEmail.includes("@")) return directEmail.split("@")[0];

        return "User";
    };

    const username = getAuthenticatedUsername();

    const [usernameMap, setUsernameMap] = useState({});
    const [micStatuses, setMicStatuses] = useState({});

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);

    const {
        socket, 
        joinRoom,
        sendSignal,
        sendChat,
        onSignal,
        onRoomUsers,
        onUserJoined,
        onUserLeft,
        onChat,
        onChatHistory
    } = useSocket();

    const {
        localStream,
        remoteStreams,
        video,
        audio, 
        screen,
        initializeMedia,
        createOffer,
        handleSignal,
        removePeer,
        toggleVideo,
        toggleAudio,
        toggleScreenShare,
        leaveMeeting
    } = useWebRTC(sendSignal);

    useEffect(() => {
        if (socket && roomId) {
            socket.emit("toggle-mic", { roomId, isMuted: !audio });
        }
    }, [audio, roomId, socket]);

    useEffect(() => {
        if (!socket) return;
        
        const handleMicStatus = ({ socketId, isMuted }) => {
            setMicStatuses(prev => ({ ...prev, [socketId]: isMuted }));
        };

        socket.on("user-mic-status", handleMicStatus);
        return () => {
            socket.off("user-mic-status", handleMicStatus);
        };
    }, [socket]);

    useEffect(() => {
        if (!roomId || !username) return;

        onRoomUsers((users) => {
            setUsernameMap(prev => {
                const updated = { ...prev };
                users.forEach(user => {
                    updated[user.socketId] = user.username;
                });
                return updated;
            });
            users.forEach(user => {
                createOffer(user.socketId);
            });
        });

        onUserJoined((user) => {
            setUsernameMap(prev => ({ ...prev, [user.socketId]: user.username }));
        });

        onSignal((data) => {
            const fromId = data?.fromId || data;
            const signal = data?.signal || data;
            if (fromId && signal) {
                handleSignal(fromId, signal);
            }
        });

        onUserLeft((socketId) => {
            setUsernameMap(prev => { const u = { ...prev }; delete u[socketId]; return u; });
            setMicStatuses(prev => { const u = { ...prev }; delete u[socketId]; return u; });
            removePeer(socketId);
        });

        onChat((text, sender, socketId) => {
            setMessages(prev => [...prev, { sender, data: text, socketId }]);
            if (!showChat) setUnreadMessages(prev => prev + 1);
        });

        onChatHistory((history) => {
            setMessages(history);
        });

        const initConference = async () => {
            const stream = await initializeMedia(
                guest?.cameraOn ?? true,
                guest?.micOn ?? true
            );
            if (stream && !hasJoinedRef.current) {
                hasJoinedRef.current = true;
                joinRoom(roomId, username);
            }
        };

        initConference();

        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, username, socket]);

    const sendMessage = () => {
        if (!message.trim()) return;
        sendChat(message, username);
        setMessage("");
    };

    const handleLeave = () => {
        leaveMeeting();
        sessionStorage.removeItem("guest");
        navigate("/");
        window.location.reload();
    };

    const namedRemoteStreams = remoteStreams.map(peer => ({
        ...peer,
        name: usernameMap[peer.socketId] || `Guest (${peer.socketId.substring(0, 4)})`
    }));

    const totalVideos = (localStream ? 1 : 0) + namedRemoteStreams.length;

    let cardFlexBasis = '30%';
    if (isMobile) {
        cardFlexBasis = totalVideos === 1 ? '100%' : '46%';
    } else {
        cardFlexBasis = totalVideos === 1 ? '70%' : totalVideos === 2 ? '45%' : '30%';
    }

    return (
        <div className={styles.meetContainer} style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#16161a', overflow: 'hidden' }}>
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: isMobile ? 'column-reverse' : 'row', 
                width: '100%', 
                overflow: 'hidden', 
                position: 'relative' 
            }}>
                <div style={{
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'row', 
                    flexWrap: 'wrap', 
                    gap: isMobile ? '12px' : '24px', 
                    padding: isMobile ? '12px' : '32px', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    overflowY: 'auto', 
                    height: '100%'
                }}>
                    {localStream && (
                        <div style={{ 
                            flexBasis: cardFlexBasis, 
                            minWidth: isMobile ? '140px' : '280px', 
                            maxWidth: totalVideos === 1 ? (isMobile ? '100%' : '850px') : '640px', 
                            aspectRatio: '16 / 9' 
                        }}>
                            <IndividualVideoCard stream={localStream} displayName={username} isLocal={true} isMutedBySync={!audio} />
                        </div>
                    )}
                    {namedRemoteStreams.map((user) => (
                        <div key={user.socketId} style={{ 
                            flexBasis: cardFlexBasis, 
                            minWidth: isMobile ? '140px' : '280px', 
                            maxWidth: '640px', 
                            aspectRatio: '16 / 9' 
                        }}>
                            <IndividualVideoCard stream={user.stream} displayName={user.name} isLocal={false} isMutedBySync={!!micStatuses[user.socketId]} />
                        </div>
                    ))}
                </div>
                
                <ChatPanel open={showChat} messages={messages} message={message} setMessage={setMessage} sendMessage={sendMessage} onClose={() => setShowChat(false)} />
            </div>
            
            <Controls video={video} audio={audio} screen={screen} screenAvailable={!!navigator.mediaDevices.getDisplayMedia && !isMobile} unreadMessages={unreadMessages} onToggleVideo={toggleVideo} onToggleAudio={toggleAudio} onToggleScreen={toggleScreenShare} onToggleChat={() => { setShowChat(p => !p); setUnreadMessages(0); }} onLeave={handleLeave} />
        </div>
    );
}