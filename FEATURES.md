# FreeAI - Enhanced Features Guide

## 🚀 New Features Overview

Your FreeAI application has been enhanced with powerful new capabilities powered by **Puter.com** AI infrastructure!

---

## ✨ Feature 1: Image Upload & Analysis

### Overview
Upload images directly in the chat and get AI-powered analysis using any of the available AI models.

### How to Use:
1. Click the **"Upload Image"** button in the input area
2. Select an image file from your device
3. The image will be uploaded to ImgBB hosting service
4. You can optionally add text prompt describing what you want analyzed
5. Click **Send** or just let the AI analyze the image

### Image Upload API
- **Service**: ImgBB (Free image hosting)
- **API Key**: `d2e46fa86f4509e6d26b5a9bb7332152`
- **Response Format**: JSON with image URLs and metadata

### Example Response:
```json
{
  "data": {
    "id": "2ndCYJK",
    "url": "https://i.ibb.co/w04Prt6/image.jpg",
    "display_url": "https://i.ibb.co/98W13PY/image.jpg",
    "delete_url": "https://ibb.co/2ndCYJK/delete_hash"
  },
  "success": true,
  "status": 200
}
```

---

## 🤖 Feature 2: Multiple AI Models

### Available Models:

#### 1. **GPT-5 Nano** (Default)
- **Type**: Fast chat model
- **Best for**: Quick responses, general questions
- **Usage**: Regular chat without streaming
- **Latency**: Very fast

```javascript
// Example usage in code
puter.ai.chat(`What is life?`, {
    model: 'gpt-5-nano',
})
```

#### 2. **Claude Sonnet 4.5**
- **Type**: Advanced reasoning model
- **Best for**: Complex questions, detailed analysis
- **Usage**: Streaming responses for real-time output
- **Features**: Superior reasoning capabilities

```javascript
// Example usage
const chat_resp = await puter.ai.chat('Tell me about quantum mechanics.', {
    model: 'claude-sonnet-4.5',
    stream: true
});
for await (const part of chat_resp) {
    console.log(part?.text);
}
```

#### 3. **DeepSeek v3.2**
- **Type**: Advanced model with reasoning
- **Best for**: In-depth analysis, problem-solving
- **Usage**: Streaming with reasoning output
- **Special**: Shows reasoning process

```javascript
// Example usage
const chat_resp = await puter.ai.chat('Solve this problem...', {
    model: 'deepseek-v3.2',
    stream: true
});
for await (const part of chat_resp) {
    if (part?.reasoning) console.log('Reasoning:', part.reasoning);
    else console.log('Response:', part?.text);
}
```

#### 4. **DeepSeek Reasoner**
- **Type**: Pure reasoning model
- **Best for**: Complex logical problems, step-by-step solutions
- **Usage**: Streaming with extensive reasoning

```javascript
// Example usage
const reasoner_resp = await puter.ai.chat('Complex question...', {
    model: 'deepseek-reasoner',
    stream: true
});
```

#### 5. **Gemini 2.5 Flash**
- **Type**: Fast multimodal model
- **Best for**: Image analysis, quick responses, creative tasks
- **Usage**: Streaming responses
- **Features**: Excellent image understanding

```javascript
// Example usage
const flash_resp = await puter.ai.chat(
    'Tell me something interesting about quantum mechanics.',
    {model: 'gemini-2.5-flash', stream: true}
);
for await (const part of flash_resp) {
    if (part?.text) console.log(part.text);
}
```

#### 6. **Grok-4 Fast**
- **Type**: Fast reasoning model
- **Best for**: Creative writing, general knowledge, humor
- **Usage**: Streaming responses
- **Personality**: Unique conversational style

```javascript
// Example usage
const resp = await puter.ai.chat('Tell me something interesting...', {
    model: 'grok-4-fast',
    stream: true
});
for await (const part of resp) {
    console.log(part?.text);
}
```

---

## 🎯 How to Use the AI Models

### Step 1: Select a Model
Click on any of the model buttons at the top of the chat interface:
- **GPT-5 Nano**
- **Claude Sonnet 4.5**
- **DeepSeek v3.2**
- **DeepSeek Reasoner**
- **Gemini 2.5 Flash**
- **Grok-4 Fast**

The selected model will be highlighted in purple/gradient.

### Step 2: Type Your Question
Enter your question or prompt in the input field.

### Step 3: Send Your Message
Click the send button (✈️ icon) or press **Enter**.

### Step 4: Get Streaming Response
Watch as the AI model streams its response in real-time (for models that support streaming).

---

## 📸 Image Analysis Examples

### Example 1: Simple Image Analysis
1. Upload an image
2. Leave the prompt empty
3. Send
4. The model will analyze: "What do you see in this image?"

### Example 2: Specific Image Analysis
1. Upload an image
2. Type: "What colors do you see and what mood does it convey?"
3. Send
4. Get detailed image analysis

### Example 3: Image with Follow-up Questions
1. Upload an image of a dog
2. Type: "Identify the breed and describe its characteristics"
3. Send
4. The AI will analyze the image based on your question

---

## 🔑 API Keys & Configuration

### Current Configuration:
- **ImgBB API Key**: `d2e46fa86f4509e6d26b5a9bb7332152`
- **Puter API Endpoint**: `https://js.puter.com/v2/`
- **Image Hosting**: ImgBB (Free, no account needed)

### To Change Image Upload Service:
Edit the `IMGBB_API_KEY` variable in `index.html`:
```javascript
const IMGBB_API_KEY = 'your-api-key-here';
```

---

## 🔄 Response Streaming

Most models support real-time streaming responses. This means:
- ✅ You see the response as it's being generated
- ✅ Reduced perceived latency
- ✅ Better user experience for long responses
- ✅ Cancel at any time by sending a new message

---

## 💡 Tips & Tricks

### Maximize AI Performance:
1. **Be Specific**: Give detailed prompts for better results
2. **Choose Right Model**: 
   - Simple questions → GPT-5 Nano (fastest)
   - Complex analysis → Claude Sonnet 4.5 or DeepSeek
   - Creative tasks → Grok-4 Fast or Gemini
3. **Image Analysis**: Try multiple models for same image to compare results
4. **Reasoning Models**: DeepSeek models show their thinking process

### Keyboard Shortcuts:
- **Enter**: Send message
- **Escape** (future): Clear current message
- **Upload Button**: Click to add images

---

## 🛠️ Technical Architecture

### Frontend Stack:
- **Framework**: Vanilla JavaScript (No dependencies)
- **UI Library**: Font Awesome 6.4.0 (Icons)
- **AI Integration**: Puter.com JavaScript SDK v2
- **Image Hosting**: ImgBB Free API

### Backend Integration:
- **Image Upload**: ImgBB API → Returns hosted URL
- **AI Chat**: Puter.com API → Routes to selected AI model
- **Streaming**: Server-sent events for real-time responses

### Data Flow:
```
User Input → Puter SDK → Selected AI Model → Streaming Response → Display
    ↓
Image Upload → ImgBB API → Image URL → Pass to AI Model
```

---

## 🔐 Privacy & Security

- ✅ Images are hosted on ImgBB (third-party service)
- ✅ AI requests processed through Puter.com
- ✅ No data stored locally except chat history (session only)
- ✅ HTTPS encryption for all API calls
- ✅ No login required - completely anonymous

---

## 🐛 Troubleshooting

### Image Upload Fails:
1. Check file size (ImgBB has limits)
2. Verify image format (JPEG, PNG, GIF, etc.)
3. Check internet connection
4. API key might be invalid

### AI Model Not Responding:
1. Check Puter.com service status
2. Try a different AI model
3. Refresh the page
4. Check browser console for errors (F12)

### Streaming Response Stops:
1. Network connection interrupted
2. Model timeout (try shorter prompt)
3. Browser issue - try different browser
4. Try non-streaming model (GPT-5 Nano)

---

## 📞 Support & Contact

For issues with:
- **Image Upload**: Check ImgBB API documentation
- **AI Models**: Check Puter.com documentation
- **Application**: Review console logs (F12 → Console)

---

## 🔄 Changelog

### Version 2.0 (Current)
✅ Added image upload functionality via ImgBB
✅ Integrated 6 different AI models via Puter.com
✅ Real-time streaming responses
✅ Reasoning model support
✅ Image analysis capabilities
✅ Model selection UI with visual indicators
✅ Enhanced error handling
✅ Improved loading states

### Version 1.0
- Basic chat functionality with OpenAI API

---

## 🚀 Future Features (Planned)

- [ ] Chat history export
- [ ] Model comparison mode
- [ ] Temperature/parameter adjustment
- [ ] Voice input support
- [ ] Response caching
- [ ] Dark mode toggle
- [ ] Multiple conversation threads
- [ ] Custom system prompts

---

## 📝 License

This application uses:
- **Puter.com**: Free AI API service
- **ImgBB**: Free image hosting service
- **Font Awesome**: Free icon library

All services are free to use with the current configuration!

---

Happy chatting! 🎉
