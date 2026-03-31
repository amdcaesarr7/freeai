import { useEffect, useCallback } from 'react';

const CHATS_DIR = '/CaesarrAI/chats';
const AUTO_SAVE_INTERVAL = 3000; // Save every 3 seconds

export function useChatPersistence(messages, messageHistory, chatId) {
  // Generate a chat ID if not provided
  const getChatId = useCallback((id) => {
    if (id) return id;
    const now = new Date();
    return `chat_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
  }, []);

  const actualChatId = getChatId(chatId);

  // Save chat to Puter FS
  const saveChat = useCallback(async (msgs) => {
    if (msgs.length === 0) return;

    try {
      // Ensure the chats directory exists
      try {
        await window.puter.fs.stat(CHATS_DIR);
      } catch (err) {
        // Directory doesn't exist, create it
        await window.puter.fs.mkdir(CHATS_DIR);
      }

      const chatData = {
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

      const filename = `${CHATS_DIR}/${actualChatId}.json`;
      await window.puter.fs.write(filename, JSON.stringify(chatData, null, 2));
    } catch (err) {
      console.warn('Failed to save chat to Puter FS:', err);
    }
  }, [actualChatId]);

  // Load chat from Puter FS
  const loadChat = useCallback(async (id) => {
    try {
      const filename = `${CHATS_DIR}/${id}.json`;
      const blob = await window.puter.fs.read(filename);
      const content = await blob.text();
      const chatData = JSON.parse(content);
      return chatData.messages;
    } catch (err) {
      console.warn('Failed to load chat from Puter FS:', err);
      return [];
    }
  }, []);

  // List all saved chats
  const loadAllChats = useCallback(async () => {
    try {
      try {
        await window.puter.fs.stat(CHATS_DIR);
      } catch (err) {
        return [];
      }

      const entries = await window.puter.fs.readdir(CHATS_DIR);
      const chats = [];

      for (const entry of entries) {
        if (entry.name.endsWith('.json')) {
          try {
            const blob = await window.puter.fs.read(`${CHATS_DIR}/${entry.name}`);
            const content = await blob.text();
            const chatData = JSON.parse(content);
            chats.push({
              id: chatData.id,
              timestamp: chatData.timestamp,
              messageCount: chatData.messageCount,
              preview: chatData.messages.slice(0, 1).map(m => m.content.substring(0, 50)).join(' ')
            });
          } catch (err) {
            console.warn(`Failed to load chat ${entry.name}:`, err);
          }
        }
      }

      // Sort by timestamp (newest first)
      return chats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (err) {
      console.warn('Failed to list chats from Puter FS:', err);
      return [];
    }
  }, []);

  // Delete a saved chat
  const deleteChat = useCallback(async (id) => {
    try {
      const filename = `${CHATS_DIR}/${id}.json`;
      await window.puter.fs.delete(filename);
    } catch (err) {
      console.warn('Failed to delete chat from Puter FS:', err);
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
    currentChatId: actualChatId
  };
}
