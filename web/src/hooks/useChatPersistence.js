import { useEffect, useCallback } from 'react';

const CHATS_DIR = 'chats'; // Root-level directory to simplify path issues
const AUTO_SAVE_INTERVAL = 3000; // Save every 3 seconds

export function useChatPersistence(messages, messageHistory, chatId) {
  // Generate a chat ID if not provided
  const getChatId = useCallback((id) => {
    if (id) return id;
    const now = new Date();
    return `chat_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
  }, []);

  const actualChatId = getChatId(chatId);

  // Ensure chats directory exists with error handling
  const ensureChatsDir = useCallback(async () => {
    try {
      try {
        await window.puter.fs.stat(CHATS_DIR);
      } catch (err) {
        // Directory doesn't exist, create it
        try {
          await window.puter.fs.mkdir(CHATS_DIR);
        } catch (mkdirErr) {
          // If mkdir fails, try alternative approach
          console.warn('Failed to create chats directory:', mkdirErr);
          // Store directly in root as fallback
          return null;
        }
      }
      return CHATS_DIR;
    } catch (err) {
      console.warn('Error ensuring chats directory:', err);
      return null;
    }
  }, []);

  // Save chat to Puter FS
  const saveChat = useCallback(async (msgs) => {
    if (msgs.length === 0) return;

    try {
      const chatsDir = await ensureChatsDir();
      const filename = chatsDir ? `${chatsDir}/${actualChatId}.json` : `${actualChatId}.json`;

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

      await window.puter.fs.write(filename, JSON.stringify(chatData, null, 2));
      console.log(`Chat saved: ${filename}`);
    } catch (err) {
      console.warn('Failed to save chat to Puter FS:', err);
    }
  }, [actualChatId, ensureChatsDir]);

  // Load chat from Puter FS
  const loadChat = useCallback(async (id) => {
    try {
      const chatsDir = await ensureChatsDir();
      const filename = chatsDir ? `${chatsDir}/${id}.json` : `${id}.json`;
      
      const blob = await window.puter.fs.read(filename);
      const content = await blob.text();
      const chatData = JSON.parse(content);
      return chatData.messages;
    } catch (err) {
      console.warn('Failed to load chat from Puter FS:', err);
      return [];
    }
  }, [ensureChatsDir]);

  // List all saved chats
  const loadAllChats = useCallback(async () => {
    try {
      const chatsDir = await ensureChatsDir();
      if (!chatsDir) return [];

      const entries = await window.puter.fs.readdir(chatsDir);
      const chats = [];

      for (const entry of entries) {
        if (entry.name.endsWith('.json')) {
          try {
            const filename = `${chatsDir}/${entry.name}`;
            const blob = await window.puter.fs.read(filename);
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
  }, [ensureChatsDir]);

  // Delete a saved chat
  const deleteChat = useCallback(async (id) => {
    try {
      const chatsDir = await ensureChatsDir();
      const filename = chatsDir ? `${chatsDir}/${id}.json` : `${id}.json`;
      await window.puter.fs.delete(filename);
    } catch (err) {
      console.warn('Failed to delete chat from Puter FS:', err);
    }
  }, [ensureChatsDir]);

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
