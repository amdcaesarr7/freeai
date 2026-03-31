<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CaesarrGPT - Reimagined</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://js.puter.com/v2/"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            height: 90vh;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        body.dark-theme {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        body.dark-theme .container {
            background: rgba(30, 30, 45, 0.95);
        }

        /* Header */
        .header {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            padding: 24px 28px;
            border-bottom: 1px solid rgba(102, 126, 234, 0.2);
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .header-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
            animation: float 3s ease-in-out infinite;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
        }

        .header-text h1 {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 0;
        }

        .header-text p {
            font-size: 14px;
            color: #888;
            margin: 4px 0 0 0;
        }

        body.dark-theme .header-text p {
            color: #aaa;
        }

        .header-controls {
            margin-left: auto;
            display: flex;
            gap: 12px;
        }

        .icon-btn {
            width: 40px;
            height: 40px;
            border: none;
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        .icon-btn:hover {
            background: rgba(102, 126, 234, 0.2);
            transform: translateY(-2px);
        }

        body.dark-theme .icon-btn {
            background: rgba(102, 126, 234, 0.15);
            color: #9ba3ff;
        }

        /* Chat Area */
        .chat-area {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: linear-gradient(to bottom, rgba(102, 126, 234, 0.02), transparent);
        }

        body.dark-theme .chat-area {
            background: linear-gradient(to bottom, rgba(102, 126, 234, 0.05), transparent);
        }

        .message {
            display: flex;
            gap: 12px;
            animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .message.user {
            justify-content: flex-end;
        }

        .message-avatar {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
        }

        .message.user .message-avatar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            order: 2;
        }

        .message.ai .message-avatar {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
        }

        body.dark-theme .message.ai .message-avatar {
            background: rgba(102, 126, 234, 0.2);
            color: #9ba3ff;
        }

        .message-bubble {
            max-width: 65%;
            padding: 16px 20px;
            border-radius: 18px;
            line-height: 1.6;
            font-size: 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }

        .message.user .message-bubble {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 4px;
        }

        .message.ai .message-bubble {
            background: white;
            color: #333;
            border-bottom-left-radius: 4px;
        }

        body.dark-theme .message.ai .message-bubble {
            background: rgba(50, 50, 70, 0.8);
            color: #e0e0e0;
        }

        /* Reasoning Display */
        .reasoning-container {
            display: flex;
            gap: 12px;
            animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reasoning-bubble {
            max-width: 65%;
            padding: 14px 18px;
            border-radius: 18px;
            background: rgba(102, 126, 234, 0.08);
            border: 1px solid rgba(102, 126, 234, 0.15);
            border-bottom-left-radius: 4px;
        }

        body.dark-theme .reasoning-bubble {
            background: rgba(102, 126, 234, 0.12);
            border-color: rgba(102, 126, 234, 0.25);
        }

        .reasoning-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            color: #667eea;
            font-weight: 600;
            font-size: 13px;
        }

        body.dark-theme .reasoning-header {
            color: #9ba3ff;
        }

        .thinking-dots {
            display: flex;
            gap: 4px;
        }

        .thinking-dots span {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #667eea;
            animation: bounce 1.4s infinite;
        }

        .thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
        .thinking-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-8px); }
        }

        .reasoning-text {
            font-size: 12px;
            color: #666;
            font-style: italic;
            line-height: 1.5;
        }

        body.dark-theme .reasoning-text {
            color: #aaa;
        }

        /* Input Area */
        .input-area {
            padding: 24px 28px;
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(102, 126, 234, 0.15);
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        body.dark-theme .input-area {
            background: rgba(30, 30, 45, 0.7);
        }

        .model-selector {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 4px;
        }

        .model-btn {
            padding: 8px 16px;
            border: 2px solid rgba(102, 126, 234, 0.2);
            background: white;
            color: #667eea;
            border-radius: 12px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            transition: all 0.3s;
        }

        .model-btn:hover {
            border-color: rgba(102, 126, 234, 0.4);
            transform: translateY(-2px);
        }

        .model-btn.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: transparent;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        body.dark-theme .model-btn {
            background: rgba(50, 50, 70, 0.8);
            color: #9ba3ff;
            border-color: rgba(102, 126, 234, 0.3);
        }

        .input-group {
            display: flex;
            gap: 12px;
            align-items: flex-end;
        }

        textarea {
            flex: 1;
            padding: 14px 18px;
            border: 2px solid rgba(102, 126, 234, 0.2);
            border-radius: 16px;
            background: white;
            font-size: 15px;
            font-family: inherit;
            resize: none;
            outline: none;
            transition: all 0.3s;
            max-height: 120px;
        }

        textarea:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        body.dark-theme textarea {
            background: rgba(50, 50, 70, 0.9);
            color: #e0e0e0;
            border-color: rgba(102, 126, 234, 0.3);
        }

        .send-btn {
            width: 48px;
            height: 48px;
            border: none;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 14px;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .send-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .send-btn:active {
            transform: translateY(0);
        }

        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: transparent;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(102, 126, 234, 0.3);
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(102, 126, 234, 0.5);
        }

        @media (max-width: 768px) {
            .container {
                height: 100vh;
                border-radius: 0;
            }

            .message-bubble {
                max-width: 80%;
            }

            .reasoning-bubble {
                max-width: 80%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-icon">
                <i class="fas fa-brain"></i>
            </div>
            <div class="header-text">
                <h1>CaesarrGPT</h1>
                <p id="chatTitle">New Conversation</p>
            </div>
            <div class="header-controls">
                <button class="icon-btn" id="themeToggle" title="Toggle theme">
                    <i class="fas fa-moon"></i>
                </button>
            </div>
        </div>

        <div class="chat-area" id="chatArea">
            <div style="text-align: center; margin-top: 80px; opacity: 0.5;">
                <i class="fas fa-comments" style="font-size: 48px; color: #667eea; margin-bottom: 16px;"></i>
                <p style="font-size: 18px; color: #888;">Start a conversation!</p>
                <p style="font-size: 14px; color: #aaa; margin-top: 8px;">Watch me think through my responses 🧠</p>
            </div>
        </div>

        <div class="input-area">
            <div class="model-selector">
                <button class="model-btn active" data-model="gpt-5-nano">GPT-5 Nano</button>
                <button class="model-btn" data-model="claude-sonnet-4.5">Claude Sonnet</button>
                <button class="model-btn" data-model="deepseek-v3.2">DeepSeek</button>
                <button class="model-btn" data-model="gemini-2.5-flash">Gemini Flash</button>
            </div>
            <div class="input-group">
                <textarea id="userInput" placeholder="Ask me anything..." rows="1"></textarea>
                <button class="send-btn" id="sendBtn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    </div>

    <script>
        const IMGBB_API_KEY = 'd2e46fa86f4509e6d26b5a9bb7332152';
        const AI_MODELS = [
            { id: 'gpt-5-nano', name: 'GPT-5 Nano', type: 'chat' },
            { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5', type: 'chat-stream' },
            { id: 'deepseek-v3.2', name: 'DeepSeek v3.2', type: 'reasoning' },
            { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', type: 'chat-stream' }
        ];

        let currentModel = AI_MODELS[0];
        let messages = [];
        let isProcessing = false;

        const chatArea = document.getElementById('chatArea');
        const userInput = document.getElementById('userInput');
        const sendBtn = document.getElementById('sendBtn');
        const themeToggle = document.getElementById('themeToggle');
        const chatTitle = document.getElementById('chatTitle');

        // Theme toggle
        const isDark = localStorage.getItem('dark-theme') === 'true';
        if (isDark) {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            localStorage.setItem('dark-theme', isDark);
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });

        // Model selection
        document.querySelectorAll('.model-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const modelId = btn.dataset.model;
                currentModel = AI_MODELS.find(m => m.id === modelId);
                console.log('Selected model:', currentModel.name);
            });
        });

        // Auto-resize textarea
        userInput.addEventListener('input', () => {
            userInput.style.height = 'auto';
            userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
        });

        // Send message
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isProcessing) {
                e.preventDefault();
                sendMessage();
            }
        });

        async function sendMessage() {
            const message = userInput.value.trim();
            if (!message || isProcessing) return;

            isProcessing = true;
            sendBtn.disabled = true;
            userInput.disabled = true;

            // Check for inappropriate content
            if (containsBadWords(message)) {
                addUserMessage(message);
                await showReasoningWithWarning();
                isProcessing = false;
                sendBtn.disabled = false;
                userInput.disabled = false;
                userInput.value = '';
                userInput.style.height = 'auto';
                userInput.focus();
                return;
            }

            addUserMessage(message);
            messages.push({ role: 'user', content: message });
            userInput.value = '';
            userInput.style.height = 'auto';

            await getAIResponse(message);

            isProcessing = false;
            sendBtn.disabled = false;
            userInput.disabled = false;
            userInput.focus();
        }

        function containsBadWords(text) {
            const badWords = ['chutiya', 'bhenchod', 'madarchod', 'bhosdike', 'gandu', 'randi', 'harami', 
                             'fuck', 'shit', 'bitch', 'asshole', 'dick', 'bastard'];
            const lowerText = text.toLowerCase();
            return badWords.some(word => lowerText.includes(word));
        }

        async function showReasoningWithWarning() {
            const reasoningSteps = [
                "Analyzing input content...",
                "Detected inappropriate language...",
                "Preparing friendly response..."
            ];

            const reasoningDiv = document.createElement('div');
            reasoningDiv.className = 'reasoning-container';
            reasoningDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="reasoning-bubble">
                    <div class="reasoning-header">
                        <div class="thinking-dots">
                            <span></span><span></span><span></span>
                        </div>
                        <span>Thinking...</span>
                    </div>
                    <div class="reasoning-text" id="reasoningText"></div>
                </div>
            `;
            chatArea.appendChild(reasoningDiv);
            chatArea.scrollTop = chatArea.scrollHeight;

            const reasoningText = document.getElementById('reasoningText');
            for (let step of reasoningSteps) {
                reasoningText.textContent = `💭 ${step}`;
                await new Promise(resolve => setTimeout(resolve, 800));
            }

            reasoningDiv.remove();

            const warningMsg = "Hey! Let's keep our conversation respectful and friendly. I'm here to help with anything you need, but I'd appreciate if we could avoid inappropriate language. What can I assist you with today? 😊";
            addAIMessage(warningMsg);
            messages.push({ role: 'assistant', content: warningMsg });
        }

        async function getAIResponse(message) {
            const reasoningSteps = [
                "Understanding your question...",
                "Analyzing the context...",
                "Formulating response...",
                "Checking accuracy..."
            ];

            // Show reasoning
            const reasoningDiv = document.createElement('div');
            reasoningDiv.className = 'reasoning-container';
            reasoningDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="reasoning-bubble">
                    <div class="reasoning-header">
                        <div class="thinking-dots">
                            <span></span><span></span><span></span>
                        </div>
                        <span>Thinking...</span>
                    </div>
                    <div class="reasoning-text" id="reasoningText"></div>
                </div>
            `;
            chatArea.appendChild(reasoningDiv);
            chatArea.scrollTop = chatArea.scrollHeight;

            const reasoningText = document.getElementById('reasoningText');
            for (let step of reasoningSteps) {
                reasoningText.textContent = `💭 ${step}`;
                await new Promise(resolve => setTimeout(resolve, 700));
            }

            reasoningDiv.remove();

            // Get AI response
            try {
                const response = await puter.ai.chat(message, { model: currentModel.id });
                const aiText = extractResponseText(response);
                addAIMessage(aiText);
                messages.push({ role: 'assistant', content: aiText });

                // Update chat title after first exchange
                if (messages.length === 2) {
                    const title = message.substring(0, 40) + (message.length > 40 ? '...' : '');
                    chatTitle.textContent = title;
                }
            } catch (error) {
                addAIMessage(`❌ Sorry, something went wrong: ${error.message}`);
            }
        }

        function addUserMessage(text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user';
            messageDiv.innerHTML = `
                <div class="message-bubble">${escapeHtml(text)}</div>
                <div class="message-avatar">
                    <i class="fas fa-user"></i>
                </div>
            `;
            
            if (chatArea.querySelector('[style*="text-align: center"]')) {
                chatArea.innerHTML = '';
            }
            
            chatArea.appendChild(messageDiv);
            chatArea.scrollTop = chatArea.scrollHeight;
        }

        function addAIMessage(text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ai';
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-bubble">${escapeHtml(text)}</div>
            `;
            chatArea.appendChild(messageDiv);
            chatArea.scrollTop = chatArea.scrollHeight;
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML.replace(/\n/g, '<br>');
        }

        function extractResponseText(response) {
            if (typeof response === 'string') return response.trim();
            if (response?.text) return response.text.trim();
            if (response?.response) return response.response.trim();
            if (response?.content) return response.content.trim();
            return String(response).trim();
        }

        console.log('✅ CaesarrGPT Reimagined - Ready!');
    </script>
</body>
</html>