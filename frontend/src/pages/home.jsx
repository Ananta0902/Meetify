import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Button, 
    TextField, 
    Box, 
    Typography, 
    AppBar, 
    Toolbar,
    CssBaseline,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    IconButton,
    Tooltip,
    useMediaQuery
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { AuthContext } from '../contexts/AuthContext';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#16161a',
            paper: '#1c1c24',
        },
        primary: {
            main: '#0e71eb', 
        },
    },
});

export default function HomeComponent() {
    const navigate = useNavigate();
    const isMobile = useMediaQuery(darkTheme.breakpoints.down('md'));
    
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);

    const [openModal, setOpenModal] = useState(false);
    const [activeRoomCode, setActiveRoomCode] = useState("");
    const [copied, setCopied] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
    };

    const enterMeetingPipeline = async (code) => {
        // Look up multiple common identity paths to avoid falling back to placeholder strings
        let resolvedName = localStorage.getItem("username") || sessionStorage.getItem("username");
        
        if (!resolvedName || resolvedName === "Authenticated User") {
            resolvedName = localStorage.getItem("name") || sessionStorage.getItem("name");
        }
        
        // If not found directly, try to search within common compound auth tokens or objects
        if (!resolvedName || resolvedName === "Authenticated User") {
            const structuralKeys = ["user", "profile", "auth", "account", "credentials"];
            for (const key of structuralKeys) {
                try {
                    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        const possibleName = parsed.name || parsed.username || parsed.displayName || parsed.fullName || parsed.user?.name;
                        if (possibleName) {
                            resolvedName = possibleName;
                            break;
                        }
                    }
                } catch (e) {}
            }
        }
        
        // Final fallback if no profile name parameter string could be parsed from memory
        if (!resolvedName) {
            resolvedName = "Authenticated User";
        }
        
        const guestObj = {
            meetingCode: code,
            displayName: resolvedName,
            cameraOn: true,
            micOn: true
        };
        sessionStorage.setItem("guest", JSON.stringify(guestObj));

        try {
            if (addToUserHistory) {
                await addToUserHistory(code);
            }
        } catch (err) {
            console.error("Could not add to history:", err);
        }

        navigate("/lobby");
    };
    const handleCreateMeeting = () => {
        const newCode = Math.random().toString(36).substring(2, 7).toUpperCase();
        setActiveRoomCode(newCode);
        setCopied(false);
        setOpenModal(true);
    };

    // ⚡ CLEAN PARSING IMPLEMENTATION INSTALLED BELOW
    const handleJoinMeeting = (e) => {
        if (e) e.preventDefault();
        if (!meetingCode.trim()) return;
        
        let cleanCode = meetingCode.trim();
        if (cleanCode.includes("/")) {
            const parts = cleanCode.split("/");
            cleanCode = parts[parts.length - 1];
        }
        cleanCode = cleanCode.split('?')[0];
        
        enterMeetingPipeline(cleanCode);
    };

    const handleCopyLink = () => {
        const joinLink = `${window.location.origin}/${activeRoomCode}`;
        navigator.clipboard.writeText(joinLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#16161a', color: '#ffffff' }}>
                <CssBaseline />
                
                {/* Navbar Navigation Header */}
                <AppBar position="static" elevation={0} sx={{ backgroundColor: '#1c1c24', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <Toolbar sx={{ justifyContent: 'space-between', px: isMobile ? 2 : 4 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: '1px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                            Meetify
                        </Typography>
                        <Button 
                            variant="outlined" 
                            color="error" 
                            size="small"
                            startIcon={<LogoutIcon />} 
                            onClick={handleLogout}
                            sx={{ textTransform: 'none', borderRadius: '6px', borderColor: 'rgba(234, 67, 53, 0.4)' }}
                        >
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>

                {/* Dashboard Interaction Core Viewport */}
                <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: isMobile ? 2 : 8, 
                    p: isMobile ? 3 : 6,
                    maxHeight: isMobile ? 'calc(100vh - 70px)' : 'none',
                    overflowY: 'auto'
                }}>
                    
                    {/* Operation Form Controls Panel */}
                    <Box sx={{ 
                        flex: 1, 
                        width: '100%',
                        maxWidth: isMobile ? '400px' : '520px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        textAlign: 'center',
                        mt: isMobile ? 2 : 0
                    }}>
                        <Typography 
                            variant={isMobile ? "h4" : "h3"} 
                            fontWeight="800" 
                            sx={{ mb: 2, lineHeight: 1.25, fontSize: isMobile ? '2rem' : '3rem' }}
                        >
                            Premium video meetings.<br />Now free for everyone.
                        </Typography>
                    
                        {/* Interactive Input Dashboard Box */}
                        <Box component="form" onSubmit={handleJoinMeeting} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<VideoCallIcon />}
                                onClick={handleCreateMeeting}
                                fullWidth
                                sx={{ 
                                    height: '56px', 
                                    backgroundColor: '#0e71eb', 
                                    fontWeight: 'bold', 
                                    textTransform: 'none', 
                                    borderRadius: '10px', 
                                    fontSize: '1rem',
                                    boxShadow: '0px 4px 12px rgba(14, 113, 235, 0.3)',
                                    '&:hover': { backgroundColor: '#0b5bbf' } 
                                }}
                            >
                                New Meeting
                            </Button>

                            <TextField
                                variant="outlined"
                                placeholder="Enter a code or link"
                                value={meetingCode}
                                onChange={(e) => setMeetingCode(e.target.value)}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <KeyboardIcon sx={{ color: 'rgba(255,255,255,0.4)', ml: 0.5 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '56px',
                                        backgroundColor: '#1c1c24',
                                        borderRadius: '10px',
                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                        '&.Mui-focused fieldset': { borderColor: '#0e71eb' }
                                    }
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Branding Canvas Layer (Hidden completely on mobile) */}
                    {!isMobile && (
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Box sx={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '440px',
                                aspectRatio: '1',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(14,113,235,0.1) 0%, rgba(22,22,26,0) 70%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <img 
                                    src="/logo3.png" 
                                    alt="Meetify Canvas" 
                                    style={{ width: '85%', height: 'auto', objectFit: 'contain' }} 
                                />
                            </Box>
                        </Box>
                    )}
                </Box>

                {/* Instant Meeting Confirmation Modal */}
                <Dialog 
                    open={openModal} 
                    onClose={() => setOpenModal(false)}
                    fullWidth
                    maxWidth="xs"
                    PaperProps={{
                        sx: { backgroundColor: '#1c1c24', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', mx: 2 }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>Here's the link to your meeting</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" sx={{ color: '#a0aec0', mb: 2 }}>
                            Copy this link and send it to people you want to meet with.
                        </Typography>
                        <TextField
                            fullWidth
                            readOnly
                            value={`${window.location.origin}/${activeRoomCode}`}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#16161a',
                                    borderRadius: '8px',
                                    pr: 1,
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' }
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title={copied ? "Copied!" : "Copy Link"}>
                                            <IconButton onClick={handleCopyLink} edge="end" color={copied ? "success" : "default"}>
                                                {copied ? <CheckIcon sx={{ color: '#10b981' }} /> : <ContentCopyIcon fontSize="small" />}
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={() => setOpenModal(false)} sx={{ color: '#a0aec0', textTransform: 'none' }}>Cancel</Button>
                        <Button 
                            variant="contained" 
                            onClick={() => {
                                setOpenModal(false);
                                enterMeetingPipeline(activeRoomCode);
                            }}
                            sx={{ textTransform: 'none', borderRadius: '8px', px: 3, fontWeight: 600, backgroundColor: '#0e71eb', '&:hover': { backgroundColor: '#0b5bbf' } }}
                        >
                            Start Meeting
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
}