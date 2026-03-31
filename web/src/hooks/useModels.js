import { useState, useEffect } from 'react';

export function useModels() {
  const [models, setModels] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeModel, setActiveModel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      try {
        setLoading(true);
        // Fetch real-time available models from Puter
        const availableModels = await window.puter.ai.listModels();
        
        // Clean and format the list
        const formattedModels = availableModels.map(m => ({
          id: m.id,
          name: m.name || m.id,
          provider: m.provider
        }));

        setModels(formattedModels);

        // Set default active model (prefer Claude or Grok if found)
        const defaultChoice = formattedModels.find(m => m.id.includes('claude-3-5-sonnet')) || 
                              formattedModels.find(m => m.id.includes('grok')) || 
                              formattedModels[0];
                              
        if (defaultChoice) setActiveModel(defaultChoice.id);

      } catch (err) {
        console.error("Failed to list Puter models:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const selectModel = (id) => setActiveModel(id);

  return { models, favorites, activeModel, loading, toggleFavorite, selectModel };
}
