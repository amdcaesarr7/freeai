import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User, Download, Edit2, Check, X } from 'lucide-react';

function MessageBubble({ message, onEdit, index }) {
  const isUser = message.role === 'user';
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  
  if (message.role === 'system') return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = message.image;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveEdit = () => {
    onEdit(index, editText);
    setIsEditing(false);
  };

  return (
    <div className="group animate-fade-in" style={{
      display: 'flex',
      gap: 16,
      marginBottom: 32,
      flexDirection: 'row',
      alignItems: 'flex-start',
      position: 'relative'
    }}>
      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: '6px', flexShrink: 0,
        background: isUser ? '#18181b' : 'var(--text-primary)',
        border: isUser ? '1px solid var(--border-subtle)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {isUser ? <User size={18} color="var(--text-primary)" /> : <Bot size={20} color="var(--bg-primary)" />}
      </div>

      {/* Bubble Content */}
      <div style={{
        flex: 1,
        color: 'var(--text-primary)',
        fontSize: 15,
        lineHeight: 1.6,
        wordBreak: 'break-word',
        overflowX: 'auto',
        maxWidth: '100%',
        paddingTop: 4
      }}>
        {/* Render Image Payload if present */}
        {message.image && (
          <div style={{ marginBottom: 12, position: 'relative', display: 'inline-block' }}>
            <img 
              src={message.image} 
              alt="Generated Content" 
              style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 12, border: '1px solid var(--border-subtle)' }} 
            />
            {message.role === 'assistant' && (
              <button 
                onClick={handleDownload}
                style={{
                  position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.6)',
                  border: 'none', borderRadius: '50%', width: 36, height: 36, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  backdropFilter: 'blur(4px)', transition: 'all 0.2s'
                }}
              >
                <Download size={18} />
              </button>
            )}
          </div>
        )}

        {/* Render Text Content */}
        {message.content === 'Generating image...' ? (
          <div className="skeleton skeleton-image" style={{ maxWidth: 400, width: '100%' }} />
        ) : isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <textarea 
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{
                width: '100%', background: 'var(--bg-sidebar)', border: '1px solid var(--accent-blue)',
                borderRadius: 8, color: '#fff', padding: 12, fontSize: 15, minHeight: 80, outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={saveEdit} style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Check size={14} /> Save & Submit
              </button>
              <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        ) : message.content && (
          isUser ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
              <button 
                className="edit-btn"
                onClick={() => setIsEditing(true)}
                style={{ 
                  background: 'none', border: 'none', color: 'var(--text-secondary)', 
                  cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s', padding: 4 
                }}
              >
                <Edit2 size={14} />
              </button>
            </div>
          ) : (
            <div className="markdown-body">
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}) {
                    return !inline ? (
                      <div style={{ 
                        background: '#121214', padding: '16px', borderRadius: 8, 
                        margin: '16px 0', overflowX: 'auto', fontFamily: 'monospace', 
                        fontSize: 13, border: '1px solid var(--border-subtle)' 
                      }}>
                        <code {...props}>{children}</code>
                      </div>
                    ) : (
                      <code style={{ background: '#27272a', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: '0.9em' }} {...props}>{children}</code>
                    )
                  },
                  p({children}) { return <p style={{ marginBottom: 12 }}>{children}</p> },
                  ul({children}) { return <ul style={{ paddingLeft: 24, marginBottom: 16 }}>{children}</ul> },
                  ol({children}) { return <ol style={{ paddingLeft: 24, marginBottom: 16 }}>{children}</ol> },
                  li({children}) { return <li style={{ marginBottom: 6 }}>{children}</li> }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .group:hover .edit-btn { opacity: 1 !important; }
      `}} />
    </div>
  );
}

export default MessageBubble;
