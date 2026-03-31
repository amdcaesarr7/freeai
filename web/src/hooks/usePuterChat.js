import { useState, useCallback, useRef } from 'react';

const STANDARD_SYSTEM_PROMPT = `The assistant is Grok, created by xAI. The current date is Monday, September 29, 2025.
Grok is intellectually curious, witty, and highly intelligent. Grok answers directly and straightforwardly.
CRITICAL INSTRUCTION: You MUST remember the last 10 messages of this conversation context flawlessly so that the conversation feels deeply persistent and uninterrupted.`;

const CODING_SYSTEM_PROMPT = `You are an elite, max-stress 10x developer AI.
CRITICAL DIRECTIVES:
1. MAX STRESS CODING MODE IS ACTIVE. 
2. ZERO conversational filler. NO greetings, NO affirmations like "Certainly" or "Here is the code".
3. Provide ONLY the absolute best, most optimal code possible. Explain logic concisely only if complex.
4. You have full awareness of the conversation history.`;

export function usePuterChat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const sendMessage = useCallback(async (content, model, isCodingMode, imagePayload = null) => {
    if (!content.trim() && !imagePayload) return;

    const isImageGen = content.trim().startsWith('/gen ');
    
    // Add user message to UI
    const userMessage = { role: 'user', content: content.trim(), image: imagePayload };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      if (isImageGen) {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Generating image...' }]);
        
        const genPrompt = content.replace('/gen ', '').trim();
        const imageElement = await window.puter.ai.txt2img(genPrompt, {
          model: 'gemini-2.5-flash-image-preview',
          ratio: { w: 1024, h: 1024 }
        });
        
        // Return the HTMLImageElement source securely
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { role: 'assistant', content: '', image: imageElement.src };
          return newMsgs;
        });

      } else {
        // Chat or Vision Mode
        const systemPrompt = isCodingMode ? CODING_SYSTEM_PROMPT : STANDARD_SYSTEM_PROMPT;
        
        let responseStream;
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

        if (imagePayload) {
          // Vision Mode ignores history to guarantee format compatibility
          responseStream = await window.puter.ai.chat(
            content.trim() || 'Describe this image.', 
            imagePayload, 
            { model: model || 'gpt-4o', stream: true }
          );
        } else {
          // Standard text chat
          const recentMessages = messages.map(m => ({ role: m.role, content: m.content })).slice(-10);
          const apiMessages = [
            { role: 'system', content: systemPrompt },
            ...recentMessages,
            { role: 'user', content: content.trim() }
          ];

          responseStream = await window.puter.ai.chat(apiMessages, {
            model: model || 'grok-beta',
            stream: true
          });
        }

        for await (const chunk of responseStream) {
          if (chunk?.text) {
            setMessages((prev) => {
              const newMsgs = [...prev];
              newMsgs[newMsgs.length - 1].content += chunk.text;
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
        if (newMsgs[newMsgs.length - 1].role === 'assistant' && !newMsgs[newMsgs.length - 1].content && !newMsgs[newMsgs.length - 1].image) {
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

  const updateMessage = useCallback((index, newContent, model, isCodingMode) => {
    setMessages((prev) => {
      const newMsgs = prev.slice(0, index);
      return newMsgs;
    });
    sendMessage(newContent, model, isCodingMode);
  }, [sendMessage]);

  return { messages, isTyping, error, sendMessage, stopGeneration, clearChat, updateMessage };
}
