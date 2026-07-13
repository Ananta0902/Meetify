import * as React from 'react';
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Paper,
    Box,
    Grid,
    Typography,
    Snackbar,
    Link,
    IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom";

// Define a unified dark theme matching Meetify's inside call rooms
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#16161a',
            paper: '#1c1c24',
        },
        primary: {
            main: '#0e71eb', // Zoom Blue
        },
    },
});

export default function Authentication() {
    const navigate = useNavigate();
    
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [formState, setFormState] = React.useState(0); // 0: Login, 1: Register
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleAuth = async () => {
        setError("");
        
        if (!username.trim() || !password.trim() || (formState === 1 && !name.trim())) {
            setError("Please fill out all fields.");
            return;
        }
        
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            } else {
                await handleRegister(name, username, password);
                setMessage("Registration successful! Please login.");
                setOpen(true);
                setFormState(0);
            }
        } catch (err) {
            const serverMessage = err.response?.data?.message || err.message || "";

            if (err.response?.status === 404 || serverMessage.includes("404")) {
                setError("User does not exist. Please create an account first!");
            } 
            else if (err.response?.status === 401 || serverMessage.includes("401")) {
                setError("Incorrect password.");
            } 
            else if (
                err.response?.status === 409 || 
                serverMessage.toLowerCase().includes("already exists") || 
                serverMessage.toLowerCase().includes("duplicate") ||
                serverMessage.toLowerCase().includes("unique")
            ) {
                setError("Username or Email is already taken. Please choose another one!");
            }
            else {
                setError("Registration failed. Username may already be taken, or server is down.");
            }
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Grid container component="main" sx={{ height: '100vh', backgroundColor: '#16161a', position: 'relative' }}>
                <CssBaseline />
                
                {/* 🟢 SAFE RESPONSIVE BACK BUTTON BAR */}
                <Box sx={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/")} // Redirect back to landing page
                        sx={{
                            color: '#a0aec0',
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: '8px',
                            px: 2,
                            py: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            '&:hover': {
                                color: '#ffffff',
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                borderColor: 'rgba(255, 255, 255, 0.2)'
                            }
                        }}
                    >
                        Back 
                    </Button>
                </Box>
                
                {/* Visual Left Branding Panel */}
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(/logo3.png)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: '#111115',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                />

                {/* Main Action Form Panel */}
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '85%' // Expanded slightly to provide vertical alignment breathing room
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: formState === 0 ? 'primary.main' : '#10b981' }}>
                            {formState === 0 ? <LockOutlinedIcon /> : <PersonAddOutlinedIcon />}
                        </Avatar>

                        {/* Dynamic Header UI Text */}
                        <Typography component="h1" variant="h5" sx={{ fontWeight: 600, mt: 1 }}>
                            {formState === 0 ? 'Sign In to Meetify' : 'Create an Account'}
                        </Typography>

                        <Box component="form" noValidate sx={{ mt: 3, width: '100%', maxWidth: '400px' }}>
                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={name}
                                    autoFocus
                                    onChange={(e) => setName(e.target.value)}
                                />
                            )}
                            
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Username"
                                name="username"
                                value={username}
                                autoFocus={formState === 0}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAuth();
                                }}
                            />

                            {error && (
                                <Typography color="error" variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                                    {error}
                                </Typography>
                            )}

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? 'Sign In' : 'Register'}
                            </Button>

                            {/* View Mode Interactive Toggler Links */}
                            <Grid container justifyContent="flex-end" sx={{ mt: 1 }}>
                                <Grid item>
                                    <Link 
                                        component="button"
                                        type="button"
                                        variant="body2" 
                                        onClick={() => {
                                            setFormState(prev => prev === 0 ? 1 : 0);
                                            setError("");
                                        }}
                                        sx={{ color: '#3b82f6', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                    >
                                        {formState === 0 ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar open={open} autoHideDuration={4000} message={message} onClose={() => setOpen(false)} />
        </ThemeProvider>
    );
}