import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, User } from 'lucide-react';

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  
  if (message.role === 'system') return null; // Don't render system prompts

  return (
    <div style={{
      display: 'flex',
      gap: 16,
      marginBottom: 24,
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-start'
    }}>
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: isUser ? 'var(--user-bubble)' : 'rgba(255,255,255,0.05)',
        border: isUser ? 'none' : '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {isUser ? <User size={18} color="#fff" /> : <Sparkles size={18} color="var(--accent-primary)" />}
      </div>

      {/* Bubble Content */}
      <div className={isUser ? '' : 'glass-panel'} style={{
        maxWidth: '80%',
        padding: isUser ? '12px 20px' : '16px 24px',
        borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
        background: isUser ? 'var(--user-bubble)' : 'var(--ai-bubble)',
        color: '#fff',
        fontSize: 15,
        lineHeight: 1.6,
        wordBreak: 'break-word',
        boxShadow: isUser ? '0 8px 24px rgba(99, 102, 241, 0.4)' : 'none',
        overflowX: 'auto'
      }}>
        {isUser ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown
              components={{
                code({node, inline, className, children, ...props}) {
                  return !inline ? (
                    <div style={{ background: '#000', padding: 12, borderRadius: 8, margin: '12px 0', overflowX: 'auto', fontFamily: 'monospace', fontSize: 13, border: '1px solid rgba(255,255,255,0.1)' }}>
                      <code {...props}>{children}</code>
                    </div>
                  ) : (
                    <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: '0.9em' }} {...props}>{children}</code>
                  )
                },
                p({children}) { return <p style={{ marginBottom: 8, lastChild: { marginBottom: 0 } }}>{children}</p> },
                ul({children}) { return <ul style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ul> },
                ol({children}) { return <ol style={{ paddingLeft: 20, marginBottom: 12 }}>{children}</ol> },
                li({children}) { return <li style={{ marginBottom: 4 }}>{children}</li> }
              }}
            >
              {message.content || '...'}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
