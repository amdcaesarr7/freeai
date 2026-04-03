import { useState, useEffect } from 'react';

const SUPPORTED_MODELS = [
  'claude-sonnet-4-5',
  'gpt-5.4-nano',
  'openai/gpt-5.2-chat',
  'gpt-5',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'reka',
  'grok-2',
  'deepseek',
  'llama'
];

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
        
        // Clean and format the list, filtering to only contain supported robust chat models
        const formattedModels = availableModels
          .filter(m => {
            const id = m.id.toLowerCase();
            if (id.includes('image') || id.includes('dall-e') || id.includes('vision')) return false;
            return SUPPORTED_MODELS.some(supportedId => id.includes(supportedId));
          })
          .map(m => ({
            id: m.id,
            name: m.name || m.id,
            provider: m.provider
          }));

        // Deduplicate in case puter returns multiple versions of the same model that matches our includes
        const uniqueModels = Array.from(new Map(formattedModels.map(item => [item.id, item])).values());

        setModels(uniqueModels);

        // Set default active model (prefer Claude or Grok if found)
        const defaultChoice = uniqueModels.find(m => m.id.includes('claude-sonnet')) || 
                              uniqueModels.find(m => m.id.includes('grok')) || 
                              uniqueModels[0];
                              
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
