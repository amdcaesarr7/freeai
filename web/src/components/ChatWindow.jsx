import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { Loader2 } from 'lucide-react';

function ChatWindow({ messages, isTyping, error }) {
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
          Experience the limitless possibilities with CaesarrGPT & Grok APIs. Switch models anytime, save your favorites, and enjoy persistent conversations.
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
          <MessageBubble key={idx} message={msg} />
        ))}
        
        {isTyping && messages[messages.length - 1]?.role === 'user' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.7 }}>
            <Loader2 size={20} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 14 }}>Grok is thinking...</span>
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
