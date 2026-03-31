import { useState, useEffect } from 'react';

const HARDCODED_MODELS = [
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'x-ai/grok-code-fast-1', name: 'Grok Code Fast', provider: 'xAI' },
  { id: 'x-ai/grok-4-1-fast', name: 'Grok 4.1 Fast', provider: 'xAI' },
  { id: 'x-ai/grok-4.20-beta', name: 'Grok 4.20 Beta', provider: 'xAI' },
  { id: 'x-ai/grok-4-fast', name: 'Grok 4 Fast', provider: 'xAI' },
  { id: 'x-ai/grok-3-mini-fast', name: 'Grok 3 Mini', provider: 'xAI' },
  { id: 'x-ai/grok-2', name: 'Grok 2', provider: 'xAI' },
  { id: 'x-ai/grok-2-image', name: 'Grok 2 Image Gen', provider: 'xAI' }
];

export function useModels() {
  const [models, setModels] = useState(HARDCODED_MODELS);
  const [favorites, setFavorites] = useState(['x-ai/grok-4-1-fast']);
  const [activeModel, setActiveModel] = useState(favorites[0] || 'x-ai/grok-4-1-fast');

  // Attempt to fetch dynamic providers if available via Puter
  useEffect(() => {
    if (!window.puter) return;
    
    // Puter.js currently returns providers, we merge it with our hardcoded list if needed.
    window.puter.ai.listModelProviders().then(providers => {
      console.log('Available Puter Providers:', providers);
      // Not structurally updating models yet, fallback to our hardcoded robust dict since the user specified exact Grok model ids.
    }).catch(console.error);
  }, []);

  const toggleFavorite = (modelId) => {
    setFavorites(prev => {
      let newFavs;
      if (prev.includes(modelId)) {
        newFavs = prev.filter(id => id !== modelId);
      } else {
        newFavs = [...prev, modelId];
      }
      return newFavs;
    });
  };

  const selectModel = (modelId) => setActiveModel(modelId);

  return { models, favorites, activeModel, toggleFavorite, selectModel };
}
