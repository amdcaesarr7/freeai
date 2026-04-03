import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User, Edit2 } from 'lucide-react';

function MessageBubble({ message, index, onEdit }) {
  const isUser = message.role === 'user';
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content && onEdit) {
      onEdit(index, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };
  
  if (message.role === 'system') return null;

  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      gap: 16,
      marginBottom: 32,
      flexDirection: 'row',
      alignItems: 'flex-start'
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
          <div style={{ marginBottom: 12 }}>
            <img 
              src={message.image} 
              alt="Attached Media" 
              style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8, border: '1px solid var(--border-subtle)' }} 
            />
          </div>
        )}

        {/* Render Text Content */}
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', marginTop: 8 }}>
            <textarea 
               value={editContent} 
               onChange={(e) => setEditContent(e.target.value)}
               className="edit-textarea"
               style={{ 
                 width: '100%', background: 'var(--bg-primary)', color: 'var(--text-primary)', 
                 border: '1px solid var(--accent-primary)', padding: '12px 14px', borderRadius: 12, 
                 minHeight: 120, outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                 fontSize: 14, lineHeight: 1.5,
               }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
               <button onClick={handleCancelEdit} style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: 8 }}>Cancel</button>
               <button onClick={handleSaveEdit} style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', padding: '8px 16px', fontWeight: 500 }}>Save & Resend</button>
            </div>
          </div>
        ) : message.content === 'Generating image...' ? (
          <div className="skeleton skeleton-image" style={{ maxWidth: 400 }} />
        ) : message.content && (
          isUser ? (
            <div className="user-message-container" style={{ position: 'relative', whiteSpace: 'pre-wrap' }}>
              {message.content}
              <button 
                onClick={() => { setEditContent(message.content); setIsEditing(true); }}
                className="edit-button mobile-only-touch" 
                style={{ 
                  position: 'absolute', right: -32, top: 0, background: 'var(--bg-sidebar)', 
                  border: '1px solid var(--border-subtle)', borderRadius: '50%', width: 28, height: 28, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', 
                  color: 'var(--text-secondary)' 
                }}
                title="Edit and resend"
              >
                <Edit2 size={12} />
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
                  p({children}) { return <p style={{ marginBottom: 12, lastChild: { marginBottom: 0 } }}>{children}</p> },
                  ul({children}) { return <ul style={{ paddingLeft: 24, marginBottom: 16 }}>{children}</ul> },
                  ol({children}) { return <ol style={{ paddingLeft: 24, marginBottom: 16 }}>{children}</ol> },
                  li({children}) { return <li style={{ marginBottom: 6 }}>{children}</li> },
                  a({children, href}) { return <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>{children}</a> }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
