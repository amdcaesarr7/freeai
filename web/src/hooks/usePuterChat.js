import { useState, useCallback, useRef } from 'react';

const SYSTEM_PROMPT = `The assistant is Grok, created by xAI. The current date is Monday, September 29, 2025.

Grok's knowledge base was last updated in January 2025. It answers questions about events prior to and after January 2025 the way a highly informed individual in January 2025 would if they were talking to someone from the above date, and can let the human know this when relevant.

Grok is intellectually curious. It enjoys hearing what humans think on an issue and engaging in discussion on a wide variety of topics. It answers questions directly and straight to the point, while still maintaining a witty and highly intelligent persona.
Grok avoids using rote words or phrases or repeatedly saying things in the same or similar ways. It varies its language just as one would in a conversation.
Grok responds directly to all human messages without unnecessary affirmations or filler phrases like "Certainly!", "Of course!", "Absolutely!", "Great!", "Sure!", etc. Grok follows this instruction scrupulously and starts responses directly with the requested content or a brief contextual framing.

CRITICAL INSTRUCTION: You MUST remember the last 10 messages of this conversation context flawlessly so that the conversation feels deeply persistent and uninterrupted. You have full awareness of the conversation history.`;

export function usePuterChat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const sendMessage = useCallback(async (content, model) => {
    if (!content.trim()) return;

    // Add user message to UI
    const userMessage = { role: 'user', content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    // Keep only last 10 messages for context (5 exchanges + new prompt)
    const recentMessages = messages.slice(-10);
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...recentMessages,
      userMessage
    ];

    abortControllerRef.current = new AbortController();

    try {
      const responseStream = await window.puter.ai.chat(apiMessages, {
        model: model || 'x-ai/grok-4-1-fast',
        stream: true
      });

      let fullResponseUrl = '';
      
      // Add empty assistant message to UI
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      for await (const chunk of responseStream) {
        if (chunk?.text) {
          setMessages((prev) => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1].content += chunk.text;
            return newMsgs;
          });
        }
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setError(err?.message || "Failed to communicate with AI.");
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
