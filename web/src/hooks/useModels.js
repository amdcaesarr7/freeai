import { useState, useEffect } from 'react';

const HARDCODED_MODELS = [
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'gpt-4o', name: 'GPT-4o (Vision)', provider: 'OpenAI' },
  { id: 'grok-beta', name: 'Grok Beta', provider: 'xAI' },
  { id: 'grok-2-1212', name: 'Grok 2', provider: 'xAI' }
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
