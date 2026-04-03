import React, { useState } from 'react';
import { useModels } from './hooks/useModels';
import { usePuterChat } from './hooks/usePuterChat';
import { useDictation } from './hooks/useDictation';
import { useChatPersistence } from './hooks/useChatPersistence';
import ModelSelector from './components/ModelSelector';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { Bot, Menu, X, PlusCircle, Loader2 } from 'lucide-react';

function App() {
  const { models, favorites, activeModel, loading, toggleFavorite, selectModel } = useModels();
  const [isCodingMode, setIsCodingMode] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  
  const { messages, isTyping, error, sendMessage, stopGeneration, clearChat, editMessage } = usePuterChat();
  const { isRecording, isTranscribing, startDictation } = useDictation();
  
  // Initialize chat persistence with auto-save
  const { currentChatId: autoSavedChatId, saveChat } = useChatPersistence(messages, messages, currentChatId);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Update current chat ID when it's auto-generated
  React.useEffect(() => {
    if (!currentChatId && autoSavedChatId) {
      setCurrentChatId(autoSavedChatId);
    }
  }, [autoSavedChatId, currentChatId]);

  const handleSend = (text, imagePayload = null, imageModelId = null) => {
    sendMessage(text, activeModel, isCodingMode, imagePayload, null, imageModelId);
  };

  const handleEdit = (index, newContent) => {
    editMessage(index, newContent, activeModel, isCodingMode);
  };

  const handleClearChat = () => {
    clearChat();
    setCurrentChatId(null);
  };

  const MobileHeader = () => {
    return (
      <div className="mobile-only" style={{
        alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-primary)', zIndex: 10
      }}>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          <Menu size={24} />
        </button>
        <span style={{ fontWeight: 500 }}>{models.find(m => m.id === activeModel)?.name || 'New Chat'}</span>
        <button onClick={handleClearChat} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <PlusCircle size={24} />
        </button>
      </div>
    );
  };

  return (
    <div className="app-layout">
      
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="mobile-only"
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30 }}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'var(--text-primary)', borderRadius: '50%', padding: 4, display: 'flex' }}>
              <Bot size={20} color="var(--bg-primary)" />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Caesarr AI</h2>
          </div>
          <button className="mobile-only" onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>
        
        <button 
          onClick={() => { handleClearChat(); setIsSidebarOpen(false); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px',
            background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)',
            borderRadius: 8, cursor: 'pointer', marginBottom: 20
          }}
        >
          <PlusCircle size={18} />
          <span style={{ fontWeight: 500 }}>New Chat</span>
        </button>
        
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center', opacity: 0.5 }}>
            <Loader2 size={24} className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : (
          <ModelSelector 
            models={models} 
            favorites={favorites} 
            activeModel={activeModel} 
            onToggleFavorite={toggleFavorite} 
            onSelectModel={(m) => { selectModel(m); setIsSidebarOpen(false); }} 
          />
        )}

        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
           <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: isCodingMode ? '#10b981' : 'var(--text-secondary)' }}>
             <input type="checkbox" checked={isCodingMode} onChange={(e) => setIsCodingMode(e.target.checked)} style={{ width: 16, height: 16 }} />
             <span style={{ fontSize: 14, fontWeight: 500 }}>Hardcore Coding Mode</span>
           </label>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat">
        <MobileHeader />
        
        {/* Desktop Top Nav */}
        <div className="desktop-only" style={{ padding: '16px 24px', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>
            {models.find(m => m.id === activeModel)?.name} {isCodingMode && '(Coding Mode)'}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {favorites.map(favId => {
              const favM = models.find(m => m.id === favId);
              return favM ? (
                <button 
                  key={favId}
                  onClick={() => selectModel(favId)}
                  style={{ 
                    padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    background: activeModel === favId ? 'var(--bg-sidebar)' : 'transparent',
                    color: activeModel === favId ? '#fff' : 'var(--text-secondary)', 
                    border: `1px solid ${activeModel === favId ? 'var(--border-subtle)' : 'transparent'}`
                  }}
                >
                  {favM.name}
                </button>
              ) : null;
            })}
          </div>
        </div>

        <ChatWindow messages={messages} isTyping={isTyping} error={error} onEdit={handleEdit} />
        
        <div className="chat-footer" style={{ padding: '0 20px 24px 20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div className="chat-container">
            <MessageInput 
              onSend={handleSend} 
              isTyping={isTyping} 
              onStop={stopGeneration}
              onDictate={startDictation}
              isRecording={isRecording}
              isTranscribing={isTranscribing}
            />
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: 'var(--text-secondary)' }}>
              AI can make mistakes. Verify critical code and outputs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
