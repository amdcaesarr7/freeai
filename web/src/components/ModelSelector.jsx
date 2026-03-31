import React from 'react';
import { Heart, HeartOff, Cpu } from 'lucide-react';

function ModelSelector({ models, favorites, activeModel, onToggleFavorite, onSelectModel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', flex: 1 }}>
      <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 8 }}>Available Models</h3>
      
      {models.map(model => {
        const isFav = favorites.includes(model.id);
        const isActive = activeModel === model.id;
        
        return (
          <div 
            key={model.id}
            onClick={() => onSelectModel(model.id)}
            style={{
              padding: '14px',
              borderRadius: 16,
              background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Cpu size={18} color={isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: isActive ? '#fff' : 'var(--text-primary)' }}>{model.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{model.provider}</div>
              </div>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(model.id); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
            >
              {isFav ? <Heart size={18} fill="#ef4444" color="#ef4444" /> : <Heart size={18} color="var(--text-secondary)" />}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ModelSelector;
