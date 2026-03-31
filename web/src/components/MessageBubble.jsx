import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  
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
        {message.content && (
          isUser ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
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
