import { useEffect, useCallback } from 'react';

const STORAGE_KEY = 'caesarr_chats';
const AUTO_SAVE_INTERVAL = 2000; // Save every 2 seconds

export function useChatPersistence(messages, messageHistory, chatId) {
  // Generate a chat ID if not provided
  const getChatId = useCallback((id) => {
    if (id) return id;
    const now = new Date();
    return `chat_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
  }, []);

  const actualChatId = getChatId(chatId);

  // Save chat to localStorage
  const saveChat = useCallback((msgs) => {
    if (msgs.length === 0) return;

    try {
      const allChats = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      
      allChats[actualChatId] = {
        id: actualChatId,
        timestamp: new Date().toISOString(),
        messageCount: msgs.length,
        messages: msgs.map(m => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : (m.content ? 'Message with content' : ''),
          image: m.image ? '[Image attached]' : null,
          timestamp: m.timestamp || new Date().toISOString()
        }))
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(allChats));
      console.log(`Chat saved to localStorage: ${actualChatId}`);
    } catch (err) {
      console.warn('Failed to save chat to localStorage:', err);
    }
  }, [actualChatId]);

  // Load chat from localStorage
  const loadChat = useCallback((id) => {
    try {
      const allChats = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return allChats[id]?.messages || [];
    } catch (err) {
      console.warn('Failed to load chat from localStorage:', err);
      return [];
    }
  }, []);

  // List all saved chats
  const loadAllChats = useCallback(() => {
    try {
      const allChats = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const chats = Object.values(allChats).map(chat => ({
        id: chat.id,
        timestamp: chat.timestamp,
        messageCount: chat.messageCount,
        title: chat.title || null,
        preview: chat.messages.slice(0, 1).map(m => m.content.substring(0, 50)).join(' ')
      }));

      // Sort by timestamp (newest first)
      return chats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (err) {
      console.warn('Failed to list chats from localStorage:', err);
      return [];
    }
  }, []);

  const updateChatTitle = useCallback((id, title) => {
    try {
      const allChats = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (allChats[id]) {
        allChats[id].title = title;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allChats));
      }
    } catch (err) {
      console.warn('Failed to update chat title:', err);
    }
  }, []);

  // Delete a saved chat
  const deleteChat = useCallback((id) => {
    try {
      const allChats = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      delete allChats[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allChats));
    } catch (err) {
      console.warn('Failed to delete chat from localStorage:', err);
    }
  }, []);

  // Auto-save chat when messages change
  useEffect(() => {
    if (messages.length === 0) return;

    const saveTimeout = setTimeout(() => {
      saveChat(messages);
    }, AUTO_SAVE_INTERVAL);

    return () => clearTimeout(saveTimeout);
  }, [messages, saveChat]);

  return {
    getChatId,
    saveChat,
    loadChat,
    loadAllChats,
    deleteChat,
    updateChatTitle,
    currentChatId: actualChatId
  };
}
