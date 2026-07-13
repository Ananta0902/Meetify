import React, { useState, useEffect } from 'react';

export default function AISummaryModal({ isOpen, onClose, chatHistory, activeParticipants }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  // Automatically reset and fetch fresh data every single time the modal opens
  useEffect(() => {
    if (isOpen) {
      setSummary(''); // Clear old cached summary immediately
      generateSummary();
    }
  }, [isOpen]); // Triggers whenever the modal opens

 const generateSummary = async () => {
  // FIXED LOGIC: If chat history is empty or only has the welcome text, don't ping the server
  if (!chatHistory || chatHistory.length <= 1) {
    const participantString = activeParticipants && activeParticipants.length > 0
      ? activeParticipants.map(p => `• ${p} (Present)`).join('\n')
      : '• None';

    setSummary(`## Meeting Summary\n* The room conversation hasn't started yet. Type a message or chat with the Copilot to generate a recap.\n\n## Action Items\n* None\n\n## Key Participants\n${participantString}`);
    return;
  }

  setLoading(true);
  try {
    const response = await fetch('http://localhost:8000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'summary',
        chatHistory: chatHistory || [],
        activeParticipants: activeParticipants || [] 
      }),
    });

      const data = await response.json();
      if (response.ok) {
        setSummary(data.result);
      } else {
        setSummary(`❌ Error generating summary: ${data.error || 'Server error'}`);
      }
    } catch (err) {
      setSummary('❌ Error: Could not compile meeting data logs.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Helper to strip or format markdown symbols cleanly for a premium look
  const renderCleanText = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('##')) {
        return <h4 key={index} style={{ color: '#60a5fa', fontSize: '15px', fontWeight: '800', marginTop: '16px', marginBottom: '8px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>{line.replace('##', '').trim()}</h4>;
      }
      if (line.startsWith('*')) {
        return <p key={index} style={{ margin: '4px 0', paddingLeft: '12px', color: '#cbd5e1' }}>• {line.replace('*', '').trim()}</p>;
      }
      return <p key={index} style={{ margin: '6px 0', color: '#e2e8f0' }}>{line}</p>;
    });
  };

  return (
    /* Floating Backdrop Mask overlaying the screen */
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 100
    }}>
      
      {/* Central Modal Container Box */}
      <div style={{
        backgroundColor: '#111218',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '550px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden'
      }}>
        
        {/* Header container */}
        <div style={{
          padding: '16px',
          backgroundColor: '#0a0b0f',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>📊</span>
            <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.05em', margin: 0 }}>
              MEETING SUMMARY
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '4px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Main Content Box */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          backgroundColor: '#111218'
        }}>
          {!summary && !loading && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '340px', margin: '0 auto 16px auto', lineHeight: '1.6' }}>
                Ready to summarize this call? Click compile to analyze the current transcript logs into a project summary report.
              </p>
              <button
                onClick={generateSummary}
                style={{
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.3)'
                }}
              >
                COMPILE SUMMARY REPORT
              </button>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{
                width: '28px',
                height: '28px',
                border: '3px solid rgba(255, 255, 255, 0.1)',
                borderTopColor: '#34d399',
                borderRadius: '50%',
                margin: '0 auto 12px auto',
                animation: 'spin 1s linear infinite'
              }}></div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Assembling chat brief records...</p>
            </div>
          )}

          {summary && !loading && (
            <div style={{
              backgroundColor: '#0a0b0f',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              fontSize: '13px',
              lineHeight: '1.6',
              textAlign: 'left'
            }}>
              {renderCleanText(summary)}
            </div>
          )}
        </div>

        {/* Footer Actions Panel */}
        {summary && !loading && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#0a0b0f',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px'
          }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(summary);
                alert("Summary copied to clipboard!");
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              COPY TEXT
            </button>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#27272a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}