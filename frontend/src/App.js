import './App.css';
import { Route,BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeetComponent from './pages/VideoMeetComponent';
import HomeComponent from './pages/home';
import JoinMeeting from './pages/JoinMeeting'
import Lobby from "./pages/Lobby";
import Footer from './pages/Footer';
function App() {
  return (
  <>
  <Router>
    <AuthProvider>
    <Routes>
    <Route path='/' element={<LandingPage/>} />
    <Route path='/home' element={<HomeComponent/>} />
    <Route path="/auth" element={<Authentication />} />
    <Route path="/join" element={<JoinMeeting />} />
    <Route path="/lobby" element={<Lobby />} />
    <Route path="/:url" element={<VideoMeetComponent />} />
    </Routes>
    <Footer />
    </AuthProvider>
  </Router>
  </>
  );
}

export default App;
