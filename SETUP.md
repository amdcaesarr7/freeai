# AI ChatBot Backend Setup

## Problem Solved
- ✅ **CORS Error**: Backend acts as a proxy, bypassing browser CORS restrictions
- ✅ **API Keys Hidden**: Sensitive keys are now on the server, not exposed in frontend
- ✅ **Automatic Retry**: Server retries with different API keys on failures

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Steps

1. **Navigate to the freeai directory:**
   ```bash
   cd "c:\Users\admin\Documents\.Caesar Codess!\freeai"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This installs:
   - Express.js (web server)
   - CORS (cross-origin support)
   - node-fetch (HTTP requests)

3. **Start the backend server:**
   ```bash
   npm start
   ```
   
   You should see:
   ```
   ✅ Server running at http://localhost:3000
   📁 Serving files from current directory
   🔌 API endpoint: POST http://localhost:3000/api/chat
   ```

4. **Open the chatbot in your browser:**
   - Go to `http://localhost:3000`
   - OR `http://127.0.0.1:3000`

## How It Works

1. **Frontend (index.html)** sends message to `http://localhost:3000/api/chat`
2. **Backend (server.js)** receives message and forwards to OpenAI API with a valid key
3. **Backend** handles:
   - CORS (browser can now communicate)
   - API key rotation (tries different keys)
   - Error handling
   - Console logging for debugging
4. **Response** is sent back to frontend and displayed

## Features

- 🔑 **18 API Keys**: Server rotates through all provided keys
- 🔄 **Automatic Retry**: Tries next key if current one fails
- 📊 **Detailed Logging**: Server logs all requests and responses
- 🛡️ **Secure**: API keys not exposed in browser
- 💻 **CORS Enabled**: Works with any frontend origin

## Troubleshooting

### Error: "Cannot find module 'express'"
- Run: `npm install`

### Error: "EADDRINUSE: address already in use :::3000"
- Another process is using port 3000
- Kill it or change PORT in server.js

### Error: "Server connection error"
- Make sure server.js is running
- Check if backend is on `http://localhost:3000`
- Console will show exact error

### API keys not working
- Check that API keys are valid OpenAI keys
- Look at server console logs for detailed error messages
- API keys must start with `sk-`

## Console Logging

Both frontend and backend log detailed information:

**Frontend Console (Browser F12):**
- Messages sent/received
- Typing indicators
- Connection status

**Backend Console (Terminal):**
- API key being used
- Request details
- OpenAI API responses
- Retry attempts
- Error details

## Architecture

```
┌─────────────────┐
│  Browser        │
│  (index.html)   │
└────────┬────────┘
         │
         │ HTTP POST (message)
         │ http://localhost:3000/api/chat
         │
┌────────▼────────┐
│  server.js      │
│  (Node.js)      │
│  - CORS enabled │
│  - Key rotation │
│  - Error handle │
└────────┬────────┘
         │
         │ HTTPS (with API key)
         │ https://api.openai.com/...
         │
┌────────▼────────┐
│  OpenAI API     │
│  (gpt-3.5-turbo)│
└─────────────────┘
```

## Port Configuration

- **Backend Server**: Port 3000
- To change, edit `server.js` line with `PORT = 3000`

## Keep Backend Running

The backend server must be running for the chatbot to work. Keep your terminal/command prompt open where you ran `npm start`.
