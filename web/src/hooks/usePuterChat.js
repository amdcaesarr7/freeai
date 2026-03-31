import { useState, useCallback, useRef } from 'react';

const STANDARD_SYSTEM_PROMPT = `The assistant is Grok, created by xAI. The current date is Monday, September 29, 2025.
Grok is intellectually curious, witty, and highly intelligent. Grok answers directly and straightforwardly.
CRITICAL INSTRUCTION: You MUST remember the last 10 messages of this conversation context flawlessly so that the conversation feels deeply persistent and uninterrupted.`;

const CODING_SYSTEM_PROMPT = `You are an AI coding assistant, powered by Grok. You operate in CaesarrAI.
Always respond in Spanish.

<goal> You are Grok, a helpful search and coding assistant. Your goal is to write an accurate, detailed, and comprehensive answer to the Query. Your answer must be correct, high-quality, well-formatted, and written by an expert using an unbiased and journalistic tone. </goal>

<format_rules>
NEVER start the answer with a header.
Use Level 2 headers (##) for sections.
Use bolding to emphasize specific words.
Wrap all math expressions in LaTeX using \\( and \\) for inline and \\[ and \\] for block formulas.
Include code snippets using Markdown code blocks with language identifiers.
</format_rules>

<making_code_changes>
When the user is asking for edits to their code, please output a simplified version of the code block that highlights the changes necessary and adds comments to indicate where unchanged code has been skipped. For example:
\`\`\`language:path/to/file
// ... existing code ...
{{ edit_1 }}
// ... existing code ...
\`\`\`
</making_code_changes>

<restrictions> 
NEVER use moralization or hedging language. 
NEVER begin your answer with a header. 
NEVER use emojis. 
NEVER end your answer with a question. 
</restrictions>`;

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

        // Construct messages in the more granular format required by Anthropic/Claude
        const recentMessages = messages.map(m => {
          // If message has an image and text, use the array format
          if (m.image) {
            return {
              role: m.role,
              content: [
                { type: 'text', text: m.content || 'Attached image' },
                { type: 'file', puter_path: m.image } // Puter treats imageUrl as a path/file context
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

        const apiMessages = [
          { role: 'system', content: systemPrompt },
          ...recentMessages,
          { role: 'user', content: currentContent }
        ];

        const responseStream = await window.puter.ai.chat(apiMessages, {
          model: verifiedModel.id,
          stream: true
        });

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
