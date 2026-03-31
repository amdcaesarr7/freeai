import React, { useState } from 'react';
import { useModels } from './hooks/useModels';
import { usePuterChat } from './hooks/usePuterChat';
import { useDictation } from './hooks/useDictation';
import ModelSelector from './components/ModelSelector';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { Sparkles, Menu, X } from 'lucide-react';

function App() {
  const { models, favorites, activeModel, toggleFavorite, selectModel } = useModels();
  const { messages, isTyping, error, sendMessage, stopGeneration, clearChat } = usePuterChat();
  const { isRecording, isTranscribing, startDictation } = useDictation();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSend = (text) => {
    sendMessage(text, activeModel);
  };

  return (
    <>
      <div className="animated-bg" />
      
      <div className="app-layout" style={{ 
        display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' 
      }}>
        
        {/* Mobile Sidebar Toggle */}
        <button 
          className="mobile-menu-btn"
          style={{ position: 'absolute', top: 16, left: 16, zIndex: 50, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Sidebar / Model Selector */}
        <div className={`sidebar glass-panel ${isSidebarOpen ? 'open' : ''}`} style={{
          width: 320, padding: 24, display: 'flex', flexDirection: 'column', gap: 20,
          position: window.innerWidth <= 768 ? 'absolute' : 'relative',
          height: '100%', zIndex: 40, transform: window.innerWidth <= 768 && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={24} color="#fff" />
            </div>
            <h2 style={{ fontSize: 20, color: '#fff' }}>CaesarrGPT</h2>
          </div>
          
          <ModelSelector 
            models={models} 
            favorites={favorites} 
            activeModel={activeModel} 
            onToggleFavorite={toggleFavorite} 
            onSelectModel={(m) => { selectModel(m); setIsSidebarOpen(false); }} 
          />

          <div style={{ marginTop: 'auto' }}>
            <button 
              onClick={clearChat}
              style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'rgba(255,50,50,0.1)', color: '#ff6b6b', border: '1px solid rgba(255,50,50,0.2)', cursor: 'pointer', fontWeight: 600 }}
            >
              Clear Conversation
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="main-chat" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          
          <div className="chat-header glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: window.innerWidth <= 768 ? 'flex-end' : 'space-between', alignItems: 'center', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
            {window.innerWidth > 768 && <h3 style={{ fontSize: 18, color: '#f8fafc' }}>Active: {models.find(m => m.id === activeModel)?.name || 'Grok'}</h3>}
            <div style={{ display: 'flex', gap: 10 }}>
              {favorites.map(favId => {
                const favM = models.find(m => m.id === favId);
                return favM ? (
                  <button 
                    key={favId}
                    onClick={() => selectModel(favId)}
                    style={{ 
                      padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontWeight: 600, fontSize: 13,
                      background: activeModel === favId ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                      color: '#fff', border: 'none'
                    }}
                  >
                    {favM.name}
                  </button>
                ) : null;
              })}
            </div>
          </div>

          <ChatWindow messages={messages} isTyping={isTyping} error={error} />
          
          <div style={{ padding: '20px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
            <MessageInput 
              onSend={handleSend} 
              isTyping={isTyping} 
              onStop={stopGeneration}
              onDictate={startDictation}
              isRecording={isRecording}
              isTranscribing={isTranscribing}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
