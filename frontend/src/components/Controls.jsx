
import React from 'react';
import { 
    Box, 
    IconButton, 
    Tooltip 
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import CallEndIcon from '@mui/icons-material/CallEnd';

export default function Controls({
    video,            // boolean state from parent (true = on, false = off)
    audio,            // boolean state from parent (true = on, false = off)
    screen,           // boolean state from parent (true = on, false = off)
    screenAvailable,
    unreadMessages,
    onToggleVideo,
    onToggleAudio,
    onToggleScreen,
    onToggleChat,
    onLeave
}) {
    return (
        <Box 
            sx={{
                height: '80px',
                backgroundColor: '#1c1c24',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                position: 'relative',
                zIndex: 10,
                width: '100%',
                px: 3
            }}
        >
            {/* MICROPHONE BUTTON */}
            <Tooltip title={audio ? "Mute Microphone" : "Unmute Microphone"}>
                <IconButton 
                    onClick={onToggleAudio}
                    sx={{
                        // ⚡ ZOOM RED EFFECT: If off (false), make it bright crimson red!
                        backgroundColor: audio ? 'rgba(255, 255, 255, 0.06)' : '#ea4335',
                        color: '#ffffff',
                        p: 1.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: audio ? 'rgba(255, 255, 255, 0.15)' : '#d93025',
                            transform: 'translateY(-1px)'
                        }
                    }}
                >
                    {audio ? <MicIcon /> : <MicOffIcon />}
                </IconButton>
            </Tooltip>

            {/* CAMERA BUTTON */}
            <Tooltip title={video ? "Stop Camera" : "Start Camera"}>
                <IconButton 
                    onClick={onToggleVideo}
                    sx={{
                        // ⚡ ZOOM RED EFFECT: If off (false), make it bright crimson red!
                        backgroundColor: video ? 'rgba(255, 255, 255, 0.06)' : '#ea4335',
                        color: '#ffffff',
                        p: 1.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: video ? 'rgba(255, 255, 255, 0.15)' : '#d93025',
                            transform: 'translateY(-1px)'
                        }
                    }}
                >
                    {video ? <VideocamIcon /> : <VideocamOffIcon />}
                </IconButton>
            </Tooltip>

            {/* SCREEN SHARE BUTTON */}
            {screenAvailable && (
                <Tooltip title={screen ? "Stop Sharing Screen" : "Share Screen"}>
                    <IconButton 
                        onClick={onToggleScreen}
                        sx={{
                            // ⚡ SCREEN SHARE STATE: Turns red or stays standard matching your theme
                            backgroundColor: screen ? '#ea4335' : 'rgba(255, 255, 255, 0.06)',
                            color: '#ffffff',
                            p: 1.5,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: screen ? '#d93025' : 'rgba(255, 255, 255, 0.15)',
                                transform: 'translateY(-1px)'
                            }
                        }}
                    >
                        {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                    </IconButton>
                </Tooltip>
            )}

            {/* CHAT PANEL BUTTON */}
            <Tooltip title="ViewChat">
                <IconButton 
                    onClick={onToggleChat}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        color: '#ffffff',
                        p: 1.5,
                        position: 'relative',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' }
                    }}
                >
                    <ChatIcon />
                    {unreadMessages > 0 && (
                        <Box 
                            sx={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                                backgroundColor: '#ea4335', // Notification badge blue accent
                                color: '#ffffff',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                minWidth: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifycontent: 'center',
                                border: '2px solid #1c1c24',
                                px: 0.5
                            }}
                        >
                            {unreadMessages}
                        </Box>
                    )}
                </IconButton>
            </Tooltip>

            {/* END CALL BUTTON (Always Red) */}
            <Tooltip title="Leave Meeting">
                <IconButton 
                    onClick={onLeave}
                    sx={{
                        backgroundColor: '#ea4335',
                        color: '#ffffff',
                        p: 1.5,
                        ml: 4, // Add separation like Zoom's "End" button
                        '&:hover': {
                            backgroundColor: '#d93025',
                            boxShadow: '0 4px 12px rgba(234, 67, 53, 0.3)'
                        }
                    }}
                >
                    <CallEndIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
}