import React from 'react'
import '../App.css'
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const router=useNavigate();
  return (
    <div className='landingPage-container'>
     <nav>
      <div className='navHeader'>
        <h2>Meetify</h2>
      </div>
      <div className='navlink'>
        <p onClick={()=>{
          router("/12");
        }}>Join as Guest</p>
        <p onClick={()=>{
          router("/auth")
        }}>Register</p>
        <div onClick={()=>{
          router("/auth");
        }} role='button'>Login</div>
      </div>

     </nav>
     <div className='landingMainContainer'>
      <div>
        <h2><span style={{color:"orange"}}>Connect</span> with your loved ones</h2>
        <p>Cover a distance by Meetify</p>
        <div role='button'>
          <Link to={"/auth"}>Get Started</Link>
        </div>
      </div>
      <div>
        <img src="/mobile.png" alt="" />
      </div>
     </div>
        </div>
  )
}
