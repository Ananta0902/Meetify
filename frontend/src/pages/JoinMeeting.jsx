import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert
} from "@mui/material";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function JoinMeeting() {
  const navigate = useNavigate();

  const [meetingCode, setMeetingCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {

    if (!meetingCode.trim()) {
        setError("Please enter a meeting code.");
        return;
    }

    if (!displayName.trim()) {
        setError("Please enter your display name.");
        return;
    }

    const guest = {

        meetingCode: meetingCode.trim(),

        displayName: displayName.trim(),

        cameraOn: true,

        micOn: true

    };

    sessionStorage.setItem(
        "guest",
        JSON.stringify(guest)
    );

    navigate("/lobby");

};
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0f0f0f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2
      }}
    >
      <Card
        sx={{
          width: 450,
          borderRadius: 4,
          p: 2
        }}
      >
        <CardContent>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
          >
            Back
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2
            }}
          >
            <VideoCallIcon
              sx={{
                fontSize: 60,
                color: "#1976d2"
              }}
            />
          </Box>

          <Typography
            variant="h4"
            align="center"
            gutterBottom
          >
            Join Meeting
          </Typography>

          <Typography
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Enter the meeting code and your display name.
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <TextField
            label="Meeting Code"
            fullWidth
            margin="normal"
            value={meetingCode}
            onChange={(e) => {
              setMeetingCode(e.target.value);
              setError("");
            }}
          />

          <TextField
            label="Display Name"
            fullWidth
            margin="normal"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              setError("");
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5
            }}
            onClick={handleContinue}
          >
            Continue
          </Button>

        </CardContent>
      </Card>
    </Box>
  );
}