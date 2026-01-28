import React, { useState,useContext } from 'react'
import withAuth from '../utils/withAuth';
import '../App.css';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from "@mui/icons-material/Restore";

function HomeComponent() {
let navigate=useNavigate();
const [meetingCode,setMeetingCode]=useState("");
 const {addToUserHistory} = useContext(AuthContext);
 
    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }

  return (
    <>
    <div className='navBar'>
      <div style={{display:"flex",alignItems:"center"}}>
      <h1 style={{alignItems:"center"}}>Meetify</h1 >
        </div>

        <div style={{display:"flex",alignItems:"center"}}>
              <IconButton onClick={()=>{
                   navigate("/history");
              }
              }>
                <RestoreIcon/>
                <p>History</p>
              </IconButton>
              <Button onClick={()=>{
                localStorage.removeItem("token");
                navigate("/");
              }}>
                Logout
              </Button>
        </div>
    </div>
    <div className='meetContainer'>
      <div className="leftPanel">
        <div>
       <h2 style={{marginBottom:"10px"}}>Providing quality video call</h2>
        <div style={{display:"flex",gap:"10px"}}>
           <TextField onChange={e=>setMeetingCode(e.target.value)} id="outlined-basic" 
           label="Meeting Code" variant="outlined"></TextField>
            <Button onClick={handleJoinVideoCall} variant='contained'>Join</Button>
        </div>
      </div>
    </div>
    <div className="rightPanel">
      <img src='/logo3.png'></img>
    </div>
     </div>
    </>
  )
}


export default withAuth(HomeComponent);


