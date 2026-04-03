import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

function ChatWindow({ messages, isTyping, error, onEdit }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}>
        <h2 style={{ fontSize: window.innerWidth > 768 ? 48 : 32, backgroundImage: 'linear-gradient(135deg, #fff, var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16 }}>
          What can I help you with?
        </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, fontSize: 16, lineHeight: 1.6 }}>
          Experience the limitless possibilities with Caesarr'SLLM. Switch models anytime, save your favorites, and enjoy persistent conversations.
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 20px',
        scrollBehavior: 'smooth'
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} index={idx} message={msg} onEdit={onEdit} />
        ))}
        
        {isTyping && messages[messages.length - 1]?.role === 'user' && (
          <div style={{ display: 'flex', gap: 12, marginTop: 24, paddingLeft: 4 }}>
            <div style={{ 
              width: 28, height: 28, borderRadius: '6px', background: 'var(--accent-primary)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </div>
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', 
            color: '#fca5a5', padding: '12px 16px', borderRadius: 12, marginTop: 16, fontSize: 14 
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
