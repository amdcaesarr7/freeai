import { useState, useCallback, useRef } from 'react';

const STANDARD_SYSTEM_PROMPT = `You are a helpful AI assistant. You provide clear, direct answers and assist the user with their queries.
Be conversational, thoughtful, and provide detailed responses when appropriate.
You maintain context from the conversation history to provide coherent, persistent interactions.`;

const CODING_SYSTEM_PROMPT = `You are an expert coding assistant. Provide clean, well-structured code with brief explanations.
Focus on best practices, efficiency, and clarity. Keep explanations concise but thorough.
You have full awareness of the conversation history and context.`;

export function usePuterChat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const sendMessage = useCallback(async (content, modelId, isCodingMode, imagePayload = null) => {
    if (!content.trim() && !imagePayload) return;

    setIsTyping(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    // Add user message to UI
    const userMessage = { role: 'user', content: content.trim(), image: imagePayload };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const availableModels = await window.puter.ai.listModels();
      
      // Handle /gen (Generative Image)
      if (content.trim().startsWith('/gen ')) {
        const imageModel = availableModels.find(m => m.id.includes('gemini') || m.id.includes('gpt-image')) || { id: 'gpt-image-1-mini' };
        
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Generating image...' }]);
        const genPrompt = content.replace('/gen ', '').trim();
        
        const imageElement = await window.puter.ai.txt2img(genPrompt, {
          model: imageModel.id
        });
        
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { role: 'assistant', content: '', image: imageElement.src };
          return newMsgs;
        });

      } else {
        // Handle Chat (Text or Vision)
        const systemPrompt = isCodingMode ? CODING_SYSTEM_PROMPT : STANDARD_SYSTEM_PROMPT;
        
        const verifiedModel = availableModels.find(m => m.id === modelId) || 
                             availableModels.find(m => m.id.includes('sonnet')) ||
                             availableModels.find(m => m.id.includes('claude')) ||
                             availableModels[0];

        if (!verifiedModel) throw new Error("No AI models available.");

        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

        // Construct messages in the format required by Puter AI
        const recentMessages = messages.map(m => {
          // If message has an image and text, use the array format
          if (m.image) {
            return {
              role: m.role,
              content: [
                { type: 'text', text: m.content || 'Attached image' },
                { type: 'file', puter_path: m.image }
              ]
            };
          }
          return { role: m.role, content: m.content };
        }).slice(-10);

        const currentContent = imagePayload 
          ? [
              { type: 'text', text: content.trim() || 'What is in this image?' },
              { type: 'file', puter_path: imagePayload }
            ]
          : content.trim();

        const isO1Model = verifiedModel.id.toLowerCase().includes('o1-');
        let apiMessages = [];

        if (isO1Model) {
            // o1 models do not support the 'system' role
            let o1Content = currentContent;
            if (Array.isArray(currentContent)) {
               const textObj = currentContent.find(c => c.type === 'text');
               const userText = textObj ? textObj.text : "Image attached.";
               o1Content = [
                  { type: 'text', text: `[System Instructions: ${systemPrompt}]\n\n${userText}` },
                  ...currentContent.filter(c => c.type !== 'text')
               ];
            } else {
               o1Content = `[System Instructions: ${systemPrompt}]\n\n${currentContent}`;
            }

            apiMessages = [
              ...recentMessages,
              { role: 'user', content: o1Content }
            ];
        } else {
            apiMessages = [
              { role: 'system', content: systemPrompt },
              ...recentMessages,
              { role: 'user', content: currentContent }
            ];
        }

        const supportsStream = !isO1Model;

        const responseStream = await window.puter.ai.chat(apiMessages, {
          model: verifiedModel.id,
          stream: supportsStream
        });

        if (supportsStream) {
            for await (const chunk of responseStream) {
              if (chunk?.text) {
                setMessages((prev) => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1].content += chunk.text;
                  return newMsgs;
                });
              }
            }
        } else {
            const responseText = typeof responseStream === 'string' 
              ? responseStream 
              : responseStream?.message?.content || responseStream?.text || "";

            if (responseText) {
              setMessages((prev) => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1].content += responseText;
                return newMsgs;
              });
            }
        }
      }
    } catch (err) {
      console.error("Puter Error:", err);
      setError(err?.message || "Failed to communicate with AI.");
      setMessages((prev) => {
        const newMsgs = [...prev];
        if (newMsgs[newMsgs.length - 1]?.role === 'assistant' && !newMsgs[newMsgs.length - 1]?.content && !newMsgs[newMsgs.length - 1]?.image) {
          newMsgs.pop();
        }
        return newMsgs;
      });
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  }, [messages]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsTyping(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isTyping, error, sendMessage, stopGeneration, clearChat };
}
