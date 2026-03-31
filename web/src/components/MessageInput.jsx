import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, Loader2 } from 'lucide-react';

function MessageInput({ onSend, isTyping, onStop, onDictate, isRecording, isTranscribing }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isTyping) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleDictateToggle = () => {
    if (isRecording) {
      window.stopDictation?.();
    } else {
      window.stopDictation = onDictate((transcript) => {
        setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      });
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="glass-panel"
      style={{ 
        display: 'flex', alignItems: 'flex-end', gap: 12, padding: '12px 16px', borderRadius: 24 
      }}
    >
      <button 
        type="button"
        onClick={handleDictateToggle}
        disabled={isTyping || isTranscribing}
        style={{
          background: isRecording ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${isRecording ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
          color: isRecording ? '#ef4444' : 'var(--text-secondary)',
          borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s ease'
        }}
      >
        {isTranscribing ? <Loader2 size={20} className="spinner" /> : <Mic size={20} />}
      </button>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isRecording ? "Listening..." : "Message Grok..."}
        disabled={isTyping || isTranscribing}
        style={{
          flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 15,
          resize: 'none', outline: 'none', maxHeight: 200, padding: '10px 0', fontFamily: 'inherit',
          lineHeight: 1.5
        }}
      />

      {isTyping ? (
        <button 
          type="button"
          onClick={onStop}
          style={{
            background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#fff', 
            borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0
          }}
        >
          <Square size={18} fill="#fff" />
        </button>
      ) : (
        <button 
          type="submit"
          disabled={!text.trim() || isTranscribing}
          style={{
            background: text.trim() ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
            border: 'none', color: '#fff', 
            borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: text.trim() ? 'pointer' : 'default', flexShrink: 0, transition: 'all 0.2s ease',
            opacity: text.trim() ? 1 : 0.5
          }}
        >
          <Send size={18} style={{ transform: 'translateX(2px) translateY(1px)' }} />
        </button>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spinner { animation: spin 1s linear infinite; }
      `}} />
    </form>
  );
}

export default MessageInput;
