import React, { useState, useEffect, useRef } from 'react';

export default function AIAssistantPanel({ isOpen, onClose, chatHistory, copilotMessages, setCopilotMessages }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (copilotMessages.length === 0) {
      setCopilotMessages([
        { role: 'assistant', text: '✨Hello! I am your Meetify AI Copilot. How can I help you during this session?' }
      ]);
    }
  }, [copilotMessages, setCopilotMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userPrompt = input;
    setCopilotMessages((prev) => [...prev, { role: 'user', text: userPrompt }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'assistant',
          chatHistory: chatHistory || [],
          userPrompt: userPrompt,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCopilotMessages((prev) => [...prev, { role: 'assistant', text: data.result }]);
      } else {
        setCopilotMessages((prev) => [...prev, { role: 'assistant', text: `❌ Error: ${data.error || 'Failed'}` }]);
      }
    } catch (err) {
      setCopilotMessages((prev) => [...prev, { role: 'assistant', text: '❌ Error: Server connection failed.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '310px',
      height: '100%',
      backgroundColor: '#111218',
      borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-4px 0 24px rgba(0,0,0,0.5)',
      zIndex: 50,
      position: 'relative'
    }}>
      <div style={{ padding: '14px', backgroundColor: '#0a0b0f', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <span style={{ fontSize: '14px' }}>✨</span>
          <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>AI COPILOT</h3>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}>✕</button>
      </div>

      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#111218' }}>
        {copilotMessages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', width: '100%' }}>
            <span style={{ fontSize: '9px', fontWeight: '900', padding: '2px 6px', borderRadius: '4px', marginBottom: '6px', color: '#ffffff', backgroundColor: msg.role === 'user' ? '#2563eb' : '#4f46e5' }}>
              {msg.role === 'user' ? 'YOU' : 'COPILOT'}
            </span>
            <div style={{ maxWidth: '90%', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap', color: '#f1f5f9', backgroundColor: msg.role === 'user' ? 'rgba(37, 99, 235, 0.15)' : '#1e202b', border: msg.role === 'user' ? '1px solid rgba(37, 99, 235, 0.4)' : '1px solid rgba(255,255,255,0.06)', borderTopRightRadius: msg.role === 'user' ? '0px' : '10px', borderTopLeftRadius: msg.role === 'user' ? '10px' : '0px' }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '9px', fontWeight: '900', padding: '2px 6px', borderRadius: '4px', marginBottom: '6px', color: '#ffffff', backgroundColor: '#4f46e5' }}>COPILOT</span>
            <div style={{ backgroundColor: '#1e202b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', borderTopLeftRadius: '0px', padding: '10px 12px', fontSize: '13px', color: '#94a3b8' }}>Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{ padding: '12px', backgroundColor: '#0a0b0f', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#16171e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '4px 6px' }}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Copilot..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#e2e8f0', fontSize: '13px', padding: '6px' }} />
          <button type="submit" disabled={!input.trim() || loading} style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>SEND</button>
        </div>
      </form>
    </div>
  );
}