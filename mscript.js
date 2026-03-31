// Image hosting API configuration
const IMGBB_API_KEY = 'd2e46fa86f4509e6d26b5a9bb7332152';

// AI Models available via Puter
const AI_MODELS = [
    { id: 'gpt-5-nano', name: 'GPT-5 Nano', type: 'chat', desc: 'Fast responses' },
    { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5', type: 'chat-stream', desc: 'Quality reasoning' },
    { id: 'deepseek-v3.2', name: 'DeepSeek v3.2', type: 'reasoning', desc: 'Shows reasoning' },
    { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', type: 'reasoning', desc: 'Deep analysis' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', type: 'chat-stream', desc: 'Great with images' },
    { id: 'grok-4-fast', name: 'Grok-4 Fast', type: 'chat-stream', desc: 'Creative & fun' }
];

// Configuration
const MAX_CONTEXT_MESSAGES = 10; // Remember last 10 messages (5 exchanges)

// Chat management
let chats = JSON.parse(localStorage.getItem('freeai_chats')) || [];
let currentChatId = null;
let currentModel = AI_MODELS[0];
let currentImageUrl = null;
let isWaitingForResponse = false;

const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const uploadBtn = document.getElementById('uploadBtn');
const imageInput = document.getElementById('imageInput');
const modelDropdownBtn = document.getElementById('modelDropdownBtn');
const modelDropdown = document.getElementById('modelDropdown');
const selectedModelName = document.getElementById('selectedModelName');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const chatTitle = document.getElementById('chatTitle');
const chatHistorySidebar = document.getElementById('chatHistorySidebar');
const sidebarContent = document.getElementById('sidebarContent');
const sidebarNewChat = document.getElementById('sidebarNewChat');
const sidebarToggle = document.getElementById('sidebarToggle');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const panelCurrentModel = document.getElementById('panelCurrentModel');
const panelMessageCount = document.getElementById('panelMessageCount');
const panelChatTopic = document.getElementById('panelChatTopic');
const settingsBtn = document.getElementById('settingsBtn');
const deleteChatSettingsBtn = document.getElementById('deleteChatSettingsBtn');

console.log('✅ Initializing AI ChatBot with Puter');
console.log('📍 Available models:', AI_MODELS);

// Initialize model dropdown
function initializeModelSelector() {
    modelDropdown.innerHTML = '';
    AI_MODELS.forEach((model) => {
        const option = document.createElement('div');
        option.className = 'model-option' + (model.id === currentModel.id ? ' selected' : '');
        option.innerHTML = `
            <div class="model-option-label">
                <div class="model-option-name">${model.name}</div>
                <div class="model-option-type">${model.desc}</div>
            </div>
            ${model.id === currentModel.id ? '<i class="fas fa-check"></i>' : ''}
        `;
        option.onclick = () => selectModel(model);
        modelDropdown.appendChild(option);
    });
}

function selectModel(model) {
    currentModel = model;
    selectedModelName.textContent = model.name;
    modelDropdown.classList.remove('open');
    
    // Update dropdown UI
    document.querySelectorAll('.model-option').forEach(opt => {
        opt.classList.remove('selected');
        const checkIcon = opt.querySelector('i.fa-check');
        if (checkIcon) checkIcon.remove();
    });
    
    // Find and mark the selected option
    const allOptions = document.querySelectorAll('.model-option');
    allOptions.forEach(opt => {
        if (opt.textContent.includes(model.name)) {
            opt.classList.add('selected');
            const checkIcon = document.createElement('i');
            checkIcon.className = 'fas fa-check';
            opt.appendChild(checkIcon);
        }
    });
    
    updateRightPanel();
    console.log('🤖 Selected model:', model.name);
}

// Update right panel with current chat info
function updateRightPanel() {
    const chat = chats.find(c => c.id === currentChatId);
    if (chat && panelCurrentModel && panelMessageCount && panelChatTopic) {
        panelCurrentModel.textContent = currentModel.name;
        panelMessageCount.textContent = chat.messages.length;
        panelChatTopic.textContent = chat.topic || 'New Conversation';
    }
}

// Model dropdown toggle with proper logic
if (modelDropdownBtn) {
    modelDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = modelDropdown.classList.contains('open');
        
        // Close all dropdowns first
        document.querySelectorAll('.model-dropdown').forEach(d => d.classList.remove('open'));
        
        // Toggle current dropdown
        if (!isOpen) {
            modelDropdown.classList.add('open');
        }
    });
} else {
    console.warn('⚠️ modelDropdownBtn not found in DOM; model selector disabled');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.model-selector')) {
        modelDropdown.classList.remove('open');
    }
});

// Chat management
function createNewChat() {
    const chatId = Date.now().toString();
    const newChat = {
        id: chatId,
        title: `Chat ${chats.length + 1}`,
        topic: 'New Conversation',
        messages: [],
        createdAt: new Date().toISOString()
    };
    chats.unshift(newChat);
    saveChatHistory();
    loadChat(chatId);
}

function loadChat(chatId) {
    currentChatId = chatId;
    const chat = chats.find(c => c.id === chatId);
    if (!chat) {
        createNewChat();
        return;
    }

    // Display chat topic as the title
    chatTitle.textContent = chat.topic || 'New Conversation';
    
    // Clear and load messages
    chatArea.innerHTML = '';
    currentImageUrl = null;
    imagePreviewContainer.innerHTML = '';
    
    chat.messages.forEach(msg => {
        addMessage(msg.text, msg.sender, false, false, msg.reasoning);
    });

    // Update sidebar and right panel
    updateSidebarChatList();
    updateRightPanel();
    closeSidebar();

    console.log('📖 Loaded chat:', chat.topic);
}

function saveChatHistory() {
    localStorage.setItem('freeai_chats', JSON.stringify(chats));
}

function addMessageToChat(text, sender, reasoning = null) {
    if (!currentChatId) {
        createNewChat();
    }
    const chat = chats.find(c => c.id === currentChatId);
    if (chat) {
        chat.messages.push({ text, sender, timestamp: Date.now(), reasoning });
        saveChatHistory();
    }
}

function clearCurrentChat() {
    if (currentChatId) {
        const chat = chats.find(c => c.id === currentChatId);
        if (chat) {
            chat.messages = [];
            saveChatHistory();
            chatArea.innerHTML = '';
            currentImageUrl = null;
            imagePreviewContainer.innerHTML = '';
            console.log('🧹 Cleared current chat');
        }
    }
}

// Get conversation context for AI (last N messages)
function getConversationContext() {
    const chat = chats.find(c => c.id === currentChatId);
    if (!chat || chat.messages.length === 0) return '';
    
    // Get last N messages for context
    const recentMessages = chat.messages.slice(-MAX_CONTEXT_MESSAGES);
    
    let context = 'Previous conversation:\n';
    recentMessages.forEach(msg => {
        const role = msg.sender === 'user' ? 'User' : 'Assistant';
        context += `${role}: ${msg.text}\n`;
    });
    
    return context + '\n';
}

// Build prompt with topic and context
function buildPromptWithContext(userText) {
    const chat = chats.find(c => c.id === currentChatId);
    const topic = chat?.topic?.trim();
    const context = getConversationContext();

    let fullPrompt = '';
    
    // Add topic if available
    if (topic && topic !== 'New Conversation') {
        fullPrompt += `Conversation topic: "${topic}"\n\n`;
    }
    
    // Add conversation context
    if (context && chat.messages.length > 0) {
        fullPrompt += context;
    }
    
    // Add current user message
    fullPrompt += `User: ${userText}`;
    
    return fullPrompt;
}

// Sidebar management functions
function updateSidebarChatList() {
    console.log('📋 Updating sidebar chat list...');
    sidebarContent.innerHTML = '';

    if (chats.length === 0) {
        sidebarContent.innerHTML = '<div style="padding: 15px; text-align: center; color: #888;">No chats yet</div>';
        return;
    }

    chats.forEach(chat => {
        const messageCount = chat.messages.length;
        const chatItem = document.createElement('div');
        chatItem.className = `chat-item ${chat.id === currentChatId ? 'active' : ''}`;
        chatItem.id = `chat-${chat.id}`;

        chatItem.innerHTML = `
            <div class="chat-item-label" title="${chat.title}">${chat.title}</div>
            <div class="chat-item-count">${messageCount}</div>
        `;

        chatItem.addEventListener('click', (e) => {
            loadChat(chat.id);
        });

        sidebarContent.appendChild(chatItem);
    });
}

function closeSidebar() {
    console.log('🔒 Closing sidebar');
    if (chatHistorySidebar) {
        chatHistorySidebar.classList.remove('active');
    }
}

function toggleSidebar() {
    console.log('🔄 Toggling sidebar');
    if (chatHistorySidebar) {
        chatHistorySidebar.classList.toggle('active');
    }
}

// Add event listener for chat history toggle button
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
}

// Close sidebar button inside the sidebar
if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
}

// Settings panel open/close handlers (simple show/hide)
if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        if (settingsPanel) settingsPanel.style.display = 'flex';
    });
}

if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => {
        if (settingsPanel) settingsPanel.style.display = 'none';
    });
}

// Image upload handling
uploadBtn.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('📸 Image selected:', file.name);
    showImageLoading();

    try {
        const uploadedUrl = await uploadImageToImgbb(file);
        currentImageUrl = uploadedUrl;
        displayImagePreview(uploadedUrl);
        console.log('✅ Image uploaded successfully:', uploadedUrl);
    } catch (error) {
        console.error('❌ Image upload failed:', error);
        addMessage('❌ Failed to upload image: ' + error.message, 'ai');
        imagePreviewContainer.innerHTML = '';
    }
});

async function uploadImageToImgbb(file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);

    const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    if (!data.success) {
        throw new Error('Image upload failed');
    }

    return data.data.url;
}

function displayImagePreview(imageUrl) {
    imagePreviewContainer.innerHTML = `
        <div class="image-container">
            <img src="${imageUrl}" alt="Uploaded image" class="image-preview">
            <button class="remove-image-btn" onclick="removeImage()">×</button>
        </div>
    `;
}

function removeImage() {
    currentImageUrl = null;
    imagePreviewContainer.innerHTML = '';
    imageInput.value = '';
    console.log('🗑️ Image removed');
}

function showImageLoading() {
    imagePreviewContainer.innerHTML = `
        <div style="padding: 10px; display: flex; align-items: center; gap: 10px; color: #667eea;">
            <div class="loading-spinner"></div>
            <span>Uploading image...</span>
        </div>
    `;
}

// Message handling - Enhanced with Shift+Enter support
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isWaitingForResponse) {
        e.preventDefault();
        sendMessage();
    }
    // Shift+Enter adds new line (default textarea behavior)
});

// Auto-resize textarea as user types
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 150) + 'px';
});

async function sendMessage() {
    if (isWaitingForResponse) return;

    const message = userInput.value.trim();
    if (!message && !currentImageUrl) {
        console.warn('⚠️ Empty message and no image - ignoring');
        return;
    }

    isWaitingForResponse = true;
    sendBtn.disabled = true;
    userInput.disabled = true;

    console.log('📤 Send message triggered');
    const displayText = message || '(Image analysis)';
    addMessage(displayText, 'user');
    addMessageToChat(displayText, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';

    showTyping();
    await getAIResponse(message);

    isWaitingForResponse = false;
    sendBtn.disabled = false;
    userInput.disabled = false;
    userInput.focus();
}

function addMessage(text, sender, saveToChat = true, useTypewriter = false, reasoning = null) {
    console.log(`📝 Adding message - Sender: ${sender}, Type: ${typeof text}`, text);
    
    if (typeof text !== 'string') {
        console.warn('⚠️ Message text is not a string!', text);
        text = String(text);
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    
    let formattedText = escapeHtml(text)
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    
    messageDiv.appendChild(messageBubble);
    
    // Add reasoning section BEFORE text if present
    if (reasoning && sender === 'ai') {
        const reasoningDiv = document.createElement('div');
        reasoningDiv.className = 'reasoning-box';
        const reasoningId = 'reasoning-' + Date.now();
        
        reasoningDiv.innerHTML = `
            <div class="reasoning-header" onclick="window.toggleReasoning('${reasoningId}')">
                <i class="fas fa-chevron-down reasoning-toggle"></i>
                <i class="fas fa-lightbulb"></i> 
                <span>Thinking Process</span>
            </div>
            <div class="reasoning-content" id="${reasoningId}">${escapeHtml(reasoning).replace(/\n/g, '<br>')}</div>
        `;
        messageBubble.appendChild(reasoningDiv);
    }
    
    // Add text wrapper AFTER reasoning
    const textWrapper = document.createElement('div');
    textWrapper.className = 'message-text';
    messageBubble.appendChild(textWrapper);
    
    chatArea.appendChild(messageDiv);
    
    if (useTypewriter && sender === 'ai') {
        const baseSpeed = 20;
        const textLength = text.length;
        const speed = Math.max(10, Math.min(baseSpeed, 1000 / textLength));
        
        typewriterEffect(textWrapper, formattedText, speed);
    } else {
        textWrapper.innerHTML = formattedText;
    }
    
    if (saveToChat) {
        addMessageToChat(text, sender, reasoning);
    }
}

async function typewriterEffect(element, text, speedMs) {
    let charIndex = 0;
    let displayText = '';
    
    return new Promise((resolve) => {
        const typeInterval = setInterval(() => {
            if (charIndex < text.length) {
                displayText += text[charIndex];
                element.innerHTML = displayText;
                charIndex++;
            } else {
                clearInterval(typeInterval);
                element.innerHTML = text;
                resolve();
            }
        }, speedMs);
    });
}

window.toggleReasoning = function(reasoningId) {
    const reasoningContent = document.getElementById(reasoningId);
    if (!reasoningContent) return;
    
    const reasoningBox = reasoningContent.parentElement;
    const toggleIcon = reasoningBox.querySelector('.reasoning-toggle');
    
    reasoningContent.classList.toggle('collapsed');
    if (toggleIcon) {
        toggleIcon.classList.toggle('rotated');
    }
    
    console.log('🔄 Toggled reasoning:', reasoningId);
}

function showTyping() {
    console.log('⏳ Showing typing indicator...');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai';
    messageDiv.id = 'typing';
    messageDiv.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Extract conversation topic using AI
async function extractConversationTopic(messages) {
    if (!currentChatId || messages.length < 2) return;
    
    try {
        const messageText = messages.slice(-6).map(m => `${m.sender}: ${m.text}`).join('\n');
        const topicPrompt = `Based on this conversation, provide a very brief topic title (max 8 words):\n\n${messageText}\n\nTopic:`;
        
        console.log('🏷️ Extracting conversation topic...');
        const topicResponse = await puter.ai.chat(topicPrompt, { model: 'gpt-5-nano' });
        const topic = extractResponseText(topicResponse);
        
        const chat = chats.find(c => c.id === currentChatId);
        if (chat && topic) {
            chat.topic = topic.substring(0, 60);
            chat.title = chat.topic;
            saveChatHistory();
            chatTitle.textContent = chat.topic;
            updateSidebarChatList();
            updateRightPanel();
            console.log('✅ Topic updated:', chat.topic);
        }
    } catch (error) {
        console.log('⚠️ Could not extract topic:', error.message);
    }
}

async function getAIResponse(message) {
    console.log(`🤖 Fetching AI response using ${currentModel.name}`);
    let typingElement = document.getElementById('typing');

    try {
        // Build prompt with context and topic
        const promptWithContext = buildPromptWithContext(message);
        
        if (currentImageUrl && message) {
            console.log('📸 Analyzing image with prompt and context');
            const aiResponseRaw = await puter.ai.chat(promptWithContext, currentImageUrl, {
                model: currentModel.id
            });
            const { text: aiResponse, reasoning } = extractResponseWithReasoning(aiResponseRaw);
            if (typingElement) typingElement.remove();
            addMessage(aiResponse, 'ai', true, true, reasoning);
            removeImage();
            
            const chat = chats.find(c => c.id === currentChatId);
            if (chat) {
                await extractConversationTopic(chat.messages);
            }
        } else if (currentImageUrl) {
            console.log('📸 Analyzing image');
            const aiResponseRaw = await puter.ai.chat('What do you see in this image?', currentImageUrl, {
                model: currentModel.id
            });
            const { text: aiResponse, reasoning } = extractResponseWithReasoning(aiResponseRaw);
            if (typingElement) typingElement.remove();
            addMessage(aiResponse, 'ai', true, true, reasoning);
            removeImage();
            
            const chat = chats.find(c => c.id === currentChatId);
            if (chat) {
                await extractConversationTopic(chat.messages);
            }
        } else if (currentModel.type === 'reasoning' || currentModel.type === 'chat-stream') {
            console.log('📡 Streaming response with context');
            await streamingChat(promptWithContext);
        } else {
            console.log('💬 Regular chat response with context');
            const aiResponseRaw = await puter.ai.chat(promptWithContext, {
                model: currentModel.id
            });
            const { text: aiResponse, reasoning } = extractResponseWithReasoning(aiResponseRaw);
            if (typingElement) typingElement.remove();
            addMessage(aiResponse, 'ai', true, true, reasoning);
            
            const chat = chats.find(c => c.id === currentChatId);
            if (chat) {
                await extractConversationTopic(chat.messages);
            }
        }
    } catch (error) {
        console.error('❌ Error occurred:', error);
        let typingElement = document.getElementById('typing');
        if (typingElement) {
            typingElement.remove();
        }
        addMessage(`❌ Error: ${error.message}`, 'ai', true, false);
    }
}

async function streamingChat(message) {
    let fullResponse = '';
    let fullReasoning = '';
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    messageDiv.appendChild(messageBubble);
    chatArea.appendChild(messageDiv);
    
    // Add reasoning box inside bubble FIRST if available
    let reasoningDiv = null;
    let textWrapper = null;
    
    if (currentModel.type === 'reasoning') {
        const reasoningId = 'reasoning-' + Date.now();
        reasoningDiv = document.createElement('div');
        reasoningDiv.className = 'reasoning-box';
        reasoningDiv.innerHTML = `
            <div class="reasoning-header" onclick="window.toggleReasoning('${reasoningId}')">
                <i class="fas fa-chevron-down reasoning-toggle"></i>
                <i class="fas fa-lightbulb"></i> 
                <span>Thinking Process</span>
            </div>
            <div class="reasoning-content" id="${reasoningId}"></div>
        `;
        messageBubble.appendChild(reasoningDiv);
    }
    
    // Add text wrapper AFTER reasoning
    textWrapper = document.createElement('div');
    textWrapper.className = 'message-text';
    messageBubble.appendChild(textWrapper);

    try {
        const chat_resp = await puter.ai.chat(message, {
            model: currentModel.id,
            stream: true
        });

        const typingElement = document.getElementById('typing');
        if (typingElement) {
            typingElement.remove();
        }

        for await (const part of chat_resp) {
            if (part?.reasoning) {
                fullReasoning += part.reasoning;
                if (reasoningDiv) {
                    const reasoningContent = reasoningDiv.querySelector('.reasoning-content');
                    reasoningContent.innerHTML = escapeHtml(fullReasoning).replace(/\n/g, '<br>');
                }
            } else if (part?.text) {
                fullResponse += part.text;
            }
            
            let formattedResponse = escapeHtml(fullResponse)
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
            textWrapper.innerHTML = formattedResponse;
        }

        addMessageToChat(fullResponse, 'ai', fullReasoning || null);
        
        const chat = chats.find(c => c.id === currentChatId);
        if (chat) {
            await extractConversationTopic(chat.messages);
        }
    } catch (error) {
        console.error('❌ Streaming error:', error);
        const typingElement = document.getElementById('typing');
        if (typingElement) {
            typingElement.remove();
        }
        addMessage(`❌ Error: ${error.message}`, 'ai', true, false);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function extractResponseText(response) {
    if (typeof response === 'string') {
        return response.trim();
    }
    
    if (response && typeof response === 'object') {
        if (response.text) {
            let text = response.text;
            if (typeof text === 'string') return text.trim();
            if (typeof text === 'object') return extractResponseText(text);
        }
        if (response.response) {
            let text = response.response;
            if (typeof text === 'string') return text.trim();
            if (typeof text === 'object') return extractResponseText(text);
        }
        if (response.content) {
            let text = response.content;
            if (typeof text === 'string') return text.trim();
            if (typeof text === 'object') return extractResponseText(text);
        }
        if (response.message) {
            let text = response.message;
            if (typeof text === 'string') return text.trim();
            if (typeof text === 'object') return extractResponseText(text);
        }
        if (Array.isArray(response) && response.length > 0) {
            return extractResponseText(response[0]);
        }
        return JSON.stringify(response).trim();
    }
    
    return String(response).trim();
}

function extractResponseWithReasoning(response) {
    let text = '';
    let reasoning = null;
    
    if (typeof response === 'string') {
        text = response.trim();
    } else if (response && typeof response === 'object') {
        if (response.reasoning) {
            reasoning = response.reasoning;
        }
        
        if (response.text) {
            text = extractResponseText(response.text);
        } else if (response.response) {
            text = extractResponseText(response.response);
        } else if (response.content) {
            text = extractResponseText(response.content);
        } else if (response.message) {
            text = extractResponseText(response.message);
        } else if (Array.isArray(response) && response.length > 0) {
            return extractResponseWithReasoning(response[0]);
        } else {
            text = JSON.stringify(response).trim();
        }
    }
    
    return { text, reasoning };
}

if (sidebarNewChat) {
    sidebarNewChat.addEventListener('click', () => {
        console.log('➕ Creating new chat from sidebar');
        createNewChat();
    });
}

if (deleteChatSettingsBtn) {
    deleteChatSettingsBtn.addEventListener('click', () => {
        if (!currentChatId) return;
        const chatIndex = chats.findIndex(c => c.id === currentChatId);
        if (chatIndex !== -1) {
            if (confirm('Are you sure you want to delete this chat?')) {
                console.log('🗑️ Deleting chat:', chats[chatIndex].topic);
                chats.splice(chatIndex, 1);
                saveChatHistory();
                
                if (chats.length === 0) {
                    createNewChat();
                } else {
                    loadChat(chats[0].id);
                }
                updateSidebarChatList();
                console.log('✅ Chat deleted');
            }
        }
    });
}

// Dark theme always enabled
document.body.classList.add('dark-theme');
if (themeToggleBtn) {
    themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    themeToggleBtn.style.pointerEvents = 'none';
    themeToggleBtn.style.opacity = '0.5';
}

// Initialize
if (modelDropdown) {
    initializeModelSelector();
} else {
    console.info('ℹ️ Model dropdown not present — skipping model selector initialization');
}
if (chats.length === 0) {
    createNewChat();
} else {
    loadChat(chats[0].id);
}
updateSidebarChatList();
console.log('✅ AI ChatBot initialized successfully!');