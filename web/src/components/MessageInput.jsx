import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, Loader2, Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

function MessageInput({ onSend, isTyping, onStop, onDictate, isRecording, isTranscribing }) {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showCommands, setShowCommands] = useState(false);
  
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    
    if (val === '/') {
      setShowCommands(true);
    } else if (!val.startsWith('/')) {
      setShowCommands(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setAttachment(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowCommands(false);
    }
  };

  const clearAttachment = () => {
    setAttachment(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() && !attachment) return;
    if (isTyping || isUploading) return;

    let finalImageUrl = null;
    
    if (attachment) {
      finalImageUrl = await uploadImage(attachment);
      if (!finalImageUrl) return;
    }

    onSend(text, finalImageUrl);
    setText('');
    setShowCommands(false);
    clearAttachment();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCommandClick = (cmd) => {
    setText(cmd + ' ');
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      
      {/* Commands Popover */}
      {showCommands && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 12,
          background: 'var(--bg-sidebar)', border: '1px solid var(--border-subtle)',
          borderRadius: 16, padding: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          zIndex: 20
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Available Commands</div>
          <button 
            type="button"
            onClick={() => handleCommandClick('/gen')}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 12px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 10, cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ background: 'var(--accent-primary)', color: '#fff', padding: 6, borderRadius: 8 }}>
              <ImageIcon size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>/gen &lt;prompt&gt;</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Generate an AI image</div>
            </div>
          </button>
        </div>
      )}

      {/* Upload Preview Container */}
      {previewUrl && (
        <div style={{ 
          position: 'absolute', top: -70, left: 16, width: 60, height: 60, 
          borderRadius: 8, overflow: 'hidden', border: '2px solid var(--border-subtle)',
          background: '#000'
        }}>
          <img src={previewUrl} alt="Upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button 
            type="button" 
            onClick={clearAttachment}
            style={{ 
              position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.6)', 
              color: '#fff', border: 'none', borderRadius: '50%', padding: 2, cursor: 'pointer' 
            }}>
            <X size={12} />
          </button>
        </div>
      )}

      <form 
        onSubmit={handleSubmit}
        style={{ 
          display: 'flex', alignItems: 'flex-end', gap: 8, padding: '12px 14px', 
          background: 'var(--bg-sidebar)', border: '1px solid var(--border-subtle)',
          borderRadius: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}
      >
        <button 
          type="button"
          onClick={() => {
            setText('/gen ');
            textareaRef.current?.focus();
          }}
          disabled={isTyping || isUploading}
          title="Generate Image"
          style={{
            background: 'transparent', border: 'none', color: text.startsWith('/gen') ? 'var(--accent-primary)' : 'var(--text-secondary)',
            padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          <ImageIcon size={20} />
        </button>

        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isTyping || isUploading}
          title="Attach Image"
          style={{
            background: 'transparent', border: 'none', color: attachment ? 'var(--text-primary)' : 'var(--text-secondary)',
            padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          {isUploading ? <Loader2 size={20} className="spinner" /> : <Paperclip size={20} />}
        </button>
        
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />

        <button 
          type="button"
          onClick={() => isRecording ? window.stopDictation?.() : window.stopDictation = onDictate?.((t) => setText(p => p ? (p + ' ' + t) : t))}
          disabled={isTyping || isUploading || isTranscribing}
          title="Dictate"
          style={{
            background: 'transparent',
            border: 'none',
            color: isRecording ? '#ef4444' : 'var(--text-secondary)',
            padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {isTranscribing ? <Loader2 size={20} className="spinner" /> : <Mic size={20} />}
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? "Listening..." : "Message Caesarr AI... (type '/' for commands)"}
          disabled={isTyping || isUploading || isTranscribing}
          style={{
            flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 15,
            resize: 'none', outline: 'none', maxHeight: 200, padding: '8px 0', fontFamily: 'inherit',
            lineHeight: 1.5
          }}
        />

        {isTyping ? (
          <button 
            type="button" onClick={onStop}
            style={{
              background: 'var(--text-primary)', border: 'none', color: 'var(--bg-primary)', 
              borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0
            }}
          >
            <Square size={14} fill="currentColor" />
          </button>
        ) : (
          <button 
            type="submit"
            disabled={(!text.trim() && !attachment) || isUploading || isTranscribing}
            style={{
              background: (text.trim() || attachment) ? 'var(--text-primary)' : 'var(--border-subtle)',
              border: 'none', color: 'var(--bg-primary)', 
              borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: (text.trim() || attachment) ? 'pointer' : 'default', transition: 'background 0.2s', flexShrink: 0
            }}
          >
            <Send size={16} style={{ transform: 'translateX(1px) translateY(1px)' }} />
          </button>
        )}
      </form>
    </div>
  );
}

export default MessageInput;
