# 🎥 Meetify – Real-Time Video Conferencing Platform 
Check LIVE project here: https://meetify-web.netlify.app/

A full-stack video conferencing application built using **React, Node.js, Express, Socket.IO, and WebRTC**, enabling users to create or join virtual meeting rooms with seamless real-time communication.

Meetify provides secure peer-to-peer video and audio communication with instant messaging and real-time signaling, delivering a smooth online meeting experience directly in the browser.

---

## 🚀 Live Demo

🌐 **Frontend:** https://meetify-web.netlify.app/

⚙️ **Backend API:** https://meetify-a773.onrender.com

---

## ✨ Features

* 🎥 Real-time video conferencing using WebRTC
* 🎤 Audio and microphone controls with toggle 
* 💬 Real-time group chat
* 👥 Join meetings using a unique room ID
* ⚡ Socket.IO signaling server
* 📱 Responsive user interface
* 🌍 Browser-based meetings with no installation required
* 🚀 Deployed with Render and Netlify

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Material UI
* Socket.IO Client
* Axios

### Backend

* Node.js
* Express.js
* Socket.IO
* WebRTC Signaling
* MongoDB
* Mongoose

### Deployment

* Netlify (Frontend)
* Render (Backend)
* MongoDB Atlas (Database)

---

## 📂 Project Structure

```text
Meetify
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── src
│   ├── App.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Ananta0902/Meetify.git
cd Meetify
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
MONGO_URL=your_mongodb_connection_string
PORT=8000
```

### Frontend (`frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:8000
```

For production:

```env
REACT_APP_API_URL=https://meetify-a773.onrender.com
```

---

## 🧠 How It Works

1. A user creates or joins a meeting room.
2. Socket.IO establishes signaling between participants.
3. WebRTC exchanges SDP offers, answers, and ICE candidates.
4. Peer-to-peer media streams are established.
5. Participants communicate through live video, audio, and chat in real time.

---

## 🌟 Future Improvements
-  Meeting Recordings.
-  Waiting Room for host approval before joining.
-  Host Controls (mute participants, remove users, lock meeting).
- ✋ Raise Hand feature for organized discussions.
- 📅 Meeting Scheduling with calendar integration and email reminders.
- 💬 In-meeting Chat and File Sharing.
- Future versions will migrate to an **SFU (Selective Forwarding Unit)** architecture enabling support for dozens or even hundreds of participants while improving scalability and performance.


If you found this project useful, consider giving it a ⭐ on GitHub. :)
