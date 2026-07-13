import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const router = useNavigate();
  
  // Track window size to adapt UI between phone and laptop dynamically
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [hoverSignIn, setHoverSignIn] = useState(false);
  const [hoverJoinGuest, setHoverJoinGuest] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='landingPage-container' style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#16161a', // standardizing background color
      color: '#ffffff',
      overflowX: 'hidden'
    }}>
      {/* Responsive Navigation Bar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '1rem' : '1.5rem 4rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        backgroundColor: '#1c1c24'
      }}>
        <div className='navHeader'>
          <h2 style={{ margin: 0, fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 'bold', letterSpacing: '1px' }}>
            Meetify
          </h2>
        </div>
        <div className='navlink' style={{ display: 'flex', gap: isMobile ? '8px' : '16px' }}>
          
          {/* --- JOIN AS GUEST BUTTON (Secondary Outline) --- */}
          <button 
            className='navBtnSecondary' 
            onClick={() => router("/join")}
            onMouseEnter={() => setHoverJoinGuest(true)} // FIXED: correctly mapping to hoverJoinGuest
            onMouseLeave={() => setHoverJoinGuest(false)} // FIXED: correctly mapping to hoverJoinGuest
            style={{
              backgroundColor: hoverJoinGuest ? 'rgba(14, 113, 235, 0.08)' : 'transparent', // FIXED: changed hoverGuest to hoverJoinGuest
              color: '#0e71eb',
              border: '1px solid #0e71eb',
              padding: isMobile ? '8px 16px' : '10px 24px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: isMobile ? '0.9rem' : '1rem',
              transition: 'all 0.2s ease-in-out',
              transform: hoverJoinGuest ? 'translateY(-2px)' : 'translateY(0)', // FIXED: changed hoverGuest to hoverJoinGuest
              boxShadow: hoverJoinGuest ? '0 4px 12px rgba(14, 113, 235, 0.15)' : 'none' // FIXED: changed hoverGuest to hoverJoinGuest
            }}
          >
            Join as Guest
          </button> 

          {/* --- SIGN IN BUTTON (Primary Solid) --- */}
          <button
            className='navBtnPrimary'
            onClick={() => router("/auth")}
            onMouseEnter={() => setHoverSignIn(true)} // FIXED: changed setHoverGetStarted to setHoverSignIn
            onMouseLeave={() => setHoverSignIn(false)} // FIXED: changed setHoverGetStarted to setHoverSignIn
            style={{
              backgroundColor: hoverSignIn ? '#0c62cc' : '#0e71eb', // Darkens slightly on hover
              color: '#ffffff', // Solid white text for primary contrast
              border: '1px solid transparent',
              padding: isMobile ? '8px 16px' : '10px 24px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: isMobile ? '0.9rem' : '1rem',
              transition: 'all 0.2s ease-in-out',
              transform: hoverSignIn ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: hoverSignIn ? '0 4px 12px rgba(14, 113, 235, 0.3)' : 'none'
            }}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Main Container - Changes direction based on viewport */}
      <div className='landingMainContainer' style={{
        flex: 1,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row', // Columns on phones, Row on laptops
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? '2.5rem' : '4rem',
        padding: isMobile ? '2rem 1.5rem' : '3rem 4rem',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        {/* Left Side: Content Text */}
        <div style={{ flex: 1, width: '100%', maxWidth: '600px' }}>
          <h2 style={{ 
            fontSize: isMobile ? '2.2rem' : '3.5rem', 
            lineHeight: 1.2, 
            marginBottom: '1rem',
            fontWeight: '800'
          }}>
            <span style={{ color: "orange" }}>Connect</span> with your loved ones
          </h2>
          
          <span className='heroSubtitleSmall' style={{ 
            display: 'block',
            fontSize: isMobile ? '1.05rem' : '1.25rem', 
            color: '#e2e8f0', 
            marginBottom: '1rem',
            fontWeight: '500'
          }}>
            Connect, Collaborate, and Cover Any Distance with Meetify.
          </span>
          
          <p className='heroSubtitleSmall' style={{ 
            fontSize: isMobile ? '0.9rem' : '1.05rem', 
            color: '#a0aec0', 
            lineHeight: 1.5,
            marginBottom: '2rem' 
          }}>
            Experience secure HD video meetings, crystal-clear audio, seamless screen sharing and instant one-click joining.
          </p>
          
          <div role='button' style={{ display: 'inline-block', width: isMobile ? '100%' : 'auto' }}>
            <Link to={"/auth"} style={{ 
              display: 'block',
              textAlign: 'center',
              textDecoration: 'none',
              backgroundColor: '#0e71eb', 
              color: '#ffffff', 
              padding: '14px 32px', 
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(14, 113, 235, 0.3)'
            }}>
              Get Started
            </Link>
          </div>
        </div>

        {/* Right Side: Showcase Image */}
        <div style={{ 
          flex: 1, 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img 
            src="/mobile.png" 
            alt="Meetify Mobile Mockup" 
            style={{ 
              width: '100%', 
              maxWidth: isMobile ? '280px' : '440px', // Prevents huge scaling on mobile
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.5))' // adds depth
            }} 
          />
        </div>
      </div>
    </div>
  )
}