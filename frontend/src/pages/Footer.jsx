import React, { useState, useEffect } from 'react';

export default function Footer() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 🟢 Don't show the footer if a user is actively inside a video call room
    // to preserve maximum view space for camera tracks on phone devices.
    const cleanPath = window.location.pathname;
    const isInsideCallRoom = cleanPath !== "/" && 
                             cleanPath !== "/auth" && 
                             cleanPath !== "/join" && 
                             cleanPath !== "/home" && 
                             cleanPath !== "/lobby";

    if (isInsideCallRoom) return null;

    return (
        <footer style={{
            backgroundColor: '#1c1c24',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '1.25rem 1rem',
            width: '100%',
            zIndex: 100,
            boxSizing: 'border-box'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                textAlign: 'center'
            }}>
                {/* Copyright Segment */}
                <span style={{ 
                    color: '#a0aec0', 
                    fontSize: '0.85rem',
                    fontWeight: '400'
                }}>
                    © {new Date().getFullYear()} Meetify, Inc. All rights reserved.
                </span>

                {/* Navigation Hyperlinks */}
                <div style={{ 
                    display: 'flex', 
                    gap: '1.5rem',
                    fontSize: '0.85rem'
                }}>
                    <a href="#privacy" style={{ color: '#a0aec0', textDecoration: 'none', transition: 'color 0.2s' }}
                       onMouseEnter={(e) => e.currentTarget.style.color = '#0e71eb'}
                       onMouseLeave={(e) => e.currentTarget.style.color = '#a0aec0'}>
                        Privacy Policy
                    </a>
                    <a href="#terms" style={{ color: '#a0aec0', textDecoration: 'none', transition: 'color 0.2s' }}
                       onMouseEnter={(e) => e.currentTarget.style.color = '#0e71eb'}
                       onMouseLeave={(e) => e.currentTarget.style.color = '#a0aec0'}>
                        Terms of Service
                    </a>
                    <a href="#support" style={{ color: '#a0aec0', textDecoration: 'none', transition: 'color 0.2s' }}
                       onMouseEnter={(e) => e.currentTarget.style.color = '#0e71eb'}
                       onMouseLeave={(e) => e.currentTarget.style.color = '#a0aec0'}>
                        Support
                    </a>
                </div>
            </div>
        </footer>
    );
}