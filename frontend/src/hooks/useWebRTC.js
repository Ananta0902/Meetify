import { useRef, useState } from "react";

const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

export default function useWebRTC(sendSignal) {
    const peersRef = useRef({});
    const localStreamRef = useRef(null);
    const pendingCandidates = useRef({});
    
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    const [screen, setScreen] = useState(false);

    const flushPendingCandidates = async (socketId, peer) => {
        const queue = pendingCandidates.current[socketId];
        if (!queue) return;
        while (queue.length) {
            const candidate = queue.shift();
            try {
                await peer.addIceCandidate(candidate);
            } catch (err) {
                console.error("Error flushing candidate:", err);
            }
        }
    };

    const initializeMedia = async (camera = true, mic = true) => {
        try {
            if (localStreamRef.current) return localStreamRef.current;
            const stream = await navigator.mediaDevices.getUserMedia({
                video: camera,
                audio: mic
            });
            localStreamRef.current = stream;
            setLocalStream(stream);
            setVideo(camera);
            setAudio(mic);
            return stream;
        } catch (err) {
            console.error("Media error:", err);
            return null;
        }
    };

    const createPeer = (socketId) => {
        if (peersRef.current[socketId]) {
            return peersRef.current[socketId];
        }

        const peer = new RTCPeerConnection(configuration);
        peersRef.current[socketId] = peer;

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                peer.addTrack(track, localStreamRef.current);
            });
        }

        peer.onicecandidate = ({ candidate }) => {
            if (candidate) sendSignal(socketId, { ice: candidate });
        };

        peer.ontrack = (event) => {
            const stream = event.streams[0];
            if (!stream) return;

            setRemoteStreams(prev => {
                const exists = prev.find(p => p.socketId === socketId);
                if (exists) {
                    return prev.map(p => p.socketId === socketId ? { ...p, stream } : p);
                }
                return [...prev, { socketId, stream, name: "User" }];
            });
        };

        return peer;
    };

    const createOffer = async (socketId) => {
        const peer = createPeer(socketId);
        if (peer.signalingState !== "stable") return;

        try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            sendSignal(socketId, { sdp: peer.localDescription });
        } catch (err) {
            console.error("Offer creation error:", err);
        }
    };

    const handleSignal = async (fromId, signal) => {
        const peer = createPeer(fromId);

        if (signal.sdp) {
            const description = new RTCSessionDescription(signal.sdp);

            if (description.type === "offer") {
                if (peer.signalingState !== "stable") return;
                await peer.setRemoteDescription(description);
                await flushPendingCandidates(fromId, peer);
                
                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);
                sendSignal(fromId, { sdp: peer.localDescription });
                return;
            }

            if (description.type === "answer") {
                if (peer.signalingState !== "have-local-offer") return;
                await peer.setRemoteDescription(description);
                await flushPendingCandidates(fromId, peer);
                return;
            }
        }

        if (signal.ice) {
            const candidate = new RTCIceCandidate(signal.ice);
            if (peer.remoteDescription) {
                await peer.addIceCandidate(candidate);
            } else {
                if (!pendingCandidates.current[fromId]) {
                    pendingCandidates.current[fromId] = [];
                }
                pendingCandidates.current[fromId].push(candidate);
            }
        }
    };

    const removePeer = (socketId) => {
        if (peersRef.current[socketId]) {
            peersRef.current[socketId].close();
            delete peersRef.current[socketId];
        }
        delete pendingCandidates.current[socketId];
        setRemoteStreams(prev => prev.filter(user => user.socketId !== socketId));
    };

    const leaveMeeting = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        Object.keys(peersRef.current).forEach(socketId => {
            peersRef.current[socketId].close();
        });
        peersRef.current = {};
        pendingCandidates.current = {};
        setRemoteStreams([]);
        setLocalStream(null);
    };

    const toggleVideo = () => {
        if (!localStreamRef.current) return;
        const track = localStreamRef.current.getVideoTracks()[0];
        if (!track) return;
        track.enabled = !track.enabled;
        setVideo(track.enabled);
    };

    const toggleAudio = () => {
        const newAudioState = !audio;
        setAudio(newAudioState);
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => { track.enabled = newAudioState; });
        }
        Object.values(peersRef.current).forEach(pc => {
            pc.getSenders().forEach(sender => {
                if (sender.track && sender.track.kind === 'audio') {
                    sender.track.enabled = newAudioState;
                }
            });
        });
    };

    const toggleScreenShare = async () => {
        if (!screen) {
            try {
                const display = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = display.getVideoTracks()[0];
                Object.values(peersRef.current).forEach(peer => {
                    const sender = peer.getSenders().find(s => s.track?.kind === "video");
                    sender?.replaceTrack(screenTrack);
                });
                screenTrack.onended = () => stopScreenShare();
                setScreen(true);
            } catch (err) {
                console.error(err);
            }
        } else {
            stopScreenShare();
        }
    };

    const stopScreenShare = () => {
        if (!localStreamRef.current) return;
        const cameraTrack = localStreamRef.current.getVideoTracks()[0];
        Object.values(peersRef.current).forEach(peer => {
            const sender = peer.getSenders().find(s => s.track?.kind === "video");
            sender?.replaceTrack(cameraTrack);
        });
        setScreen(false);
    };

    return {
        localStream,
        remoteStreams,
        video,
        audio,
        screen,
        initializeMedia,
        createPeer,
        createOffer,
        handleSignal,
        removePeer,
        toggleVideo,
        toggleAudio,
        toggleScreenShare,
        leaveMeeting
    };
}