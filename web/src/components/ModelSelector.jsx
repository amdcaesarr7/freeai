import React, { useState, useMemo } from 'react';
import { Heart, Search, Cpu } from 'lucide-react';

function ModelSelector({ models, favorites, activeModel, onToggleFavorite, onSelectModel }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Categorize models by provider
  const categorizeModels = (modelList) => {
    const categories = {};
    modelList.forEach(model => {
      const provider = model.provider || 'Other';
      if (!categories[provider]) {
        categories[provider] = [];
      }
      categories[provider].push(model);
    });
    return categories;
  };

  // Filter models based on search term
  const filteredModels = useMemo(() => {
    if (!searchTerm.trim()) return models;
    const term = searchTerm.toLowerCase();
    return models.filter(m => 
      m.name.toLowerCase().includes(term) || 
      m.provider.toLowerCase().includes(term) ||
      m.id.toLowerCase().includes(term)
    );
  }, [searchTerm, models]);

  const categorized = useMemo(() => categorizeModels(filteredModels), [filteredModels]);

  const ModelCard = ({ model }) => {
    const isFav = favorites.includes(model.id);
    const isActive = activeModel === model.id;

    return (
      <div 
        key={model.id}
        onClick={() => onSelectModel(model.id)}
        style={{
          padding: '12px 14px',
          borderRadius: 12,
          background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${isActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)'}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <Cpu size={16} color={isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'} style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? '#fff' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{model.name}</div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{model.provider}</div>
          </div>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(model.id); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexShrink: 0 }}
        >
          <Heart size={16} fill={favorites.includes(model.id) ? "#ef4444" : "none"} color={favorites.includes(model.id) ? "#ef4444" : "var(--text-secondary)"} />
        </button>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', flex: 1 }}>
      {/* Search Box */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'var(--bg-primary)',
        zIndex: 10,
        paddingBottom: 8
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 10px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10
        }}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 12,
              '::placeholder': { color: 'var(--text-secondary)' }
            }}
          />
        </div>
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div>
          <h4 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-secondary)', marginBottom: 8, opacity: 0.7 }}>★ Favorites</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {models.filter(m => favorites.includes(m.id)).map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </div>
      )}

      {/* Categorized Models */}
      {Object.entries(categorized).map(([provider, providerModels]) => (
        <div key={provider}>
          <h4 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-secondary)', marginBottom: 8, opacity: 0.7 }}>{provider}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {providerModels.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </div>
      ))}

      {filteredModels.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px 10px', color: 'var(--text-secondary)', fontSize: 12 }}>
          No models found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
}

export default ModelSelector;
