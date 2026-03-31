# Configuration Guide - FreeAI v2.0

## 🔑 API Keys & Configuration

This guide explains all configurable settings in your FreeAI application.

---

## 📸 Image Upload Configuration

### Current ImgBB API Key:
```javascript
const IMGBB_API_KEY = 'd2e46fa86f4509e6d26b5a9bb7332152';
```

### Where to Change:
**File**: `index.html` (Line ~259)

```javascript
// Image hosting API configuration
const IMGBB_API_KEY = 'd2e46fa86f4509e6d26b5a9bb7332152';
```

### How to Get Your Own ImgBB API Key:

1. **Visit**: https://imgbb.com/
2. **Sign up** or **Login**
3. Go to **API** section
4. Copy your **API Key**
5. Replace the key in `index.html`

### ImgBB Features:
- ✅ **Free image hosting** (No credit card needed)
- ✅ **32 MB file size limit** (Pro: 100 GB)
- ✅ **Forever storage** (Free tier)
- ✅ **Direct image URLs**
- ✅ **Deletion links** for uploaded images

---

## 🤖 AI Models Configuration

### Available Models via Puter.com:

```javascript
const AI_MODELS = [
    { id: 'gpt-5-nano', name: 'GPT-5 Nano', type: 'chat' },
    { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5', type: 'chat-stream' },
    { id: 'deepseek-v3.2', name: 'DeepSeek v3.2', type: 'reasoning' },
    { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', type: 'reasoning' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', type: 'chat-stream' },
    { id: 'grok-4-fast', name: 'Grok-4 Fast', type: 'chat-stream' }
];
```

### Where to Change:
**File**: `index.html` (Line ~263)

### Add or Remove Models:

**To add a new model:**
```javascript
const AI_MODELS = [
    // ... existing models
    { id: 'your-model-id', name: 'Model Display Name', type: 'chat' | 'chat-stream' | 'reasoning' }
];
```

**Model Types Explained:**
- `chat`: Regular response (no streaming)
- `chat-stream`: Real-time streaming response
- `reasoning`: Shows reasoning process (DeepSeek only)

---

## 🔗 Puter.com Integration

### SDK Configuration:
The Puter SDK is loaded from CDN in the HTML head:
```html
<script src="https://js.puter.com/v2/"></script>
```

### No API Key Needed!
- ✅ Puter uses **anonymous access** by default
- ✅ No registration required
- ✅ Free tier is unlimited
- ✅ Check https://puter.com/ for service status

### How Puter Works:
```javascript
// Simple chat
const response = await puter.ai.chat('Your question', {
    model: 'gpt-5-nano'
});

// With image
const response = await puter.ai.chat(
    'Question about image', 
    'https://image-url.com/image.jpg',
    { model: 'gemini-2.5-flash' }
);

// Streaming
const response = await puter.ai.chat('Question', {
    model: 'claude-sonnet-4.5',
    stream: true
});
for await (const part of response) {
    console.log(part?.text);
}
```

---

## 🎨 UI/UX Configuration

### Color Scheme (Customizable):

**Primary Gradient:**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Background Gradient:**
```css
background: linear-gradient(135deg, #c6d1ffff 0%, #472c67ff 100%);
```

**Where to Change**: `index.html` CSS section (Line ~20, ~220)

### Container Settings:
```css
.container {
    width: 100%;
    max-width: 900px;
    height: 90vh;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.95);
}
```

---

## 📝 Advanced Configuration Examples

### Example 1: Add a New AI Model

```javascript
const AI_MODELS = [
    // ... existing models
    { 
        id: 'meta-llama-3.1', 
        name: 'Meta Llama 3.1', 
        type: 'chat-stream' 
    }
];
```

### Example 2: Custom Image Upload Service

Change from ImgBB to another service:

```javascript
// For Imgur:
const IMGUR_CLIENT_ID = 'your-imgur-client-id';

async function uploadImageToImgur(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
        },
        body: formData
    });
    
    const data = await response.json();
    return data.data.link;
}
```

### Example 3: Custom Styling

Change input field color:
```css
input {
    background: rgba(255, 200, 100, 0.8); /* Orange tint */
    border-color: #ff6b00;
}

input:focus {
    border-color: #ff6b00;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
}
```

---

## 🌐 Hosting Configuration

### Current Setup:
- **Framework**: Vanilla JavaScript (No build required)
- **Hosting**: Static file hosting (GitHub Pages, Netlify, etc.)
- **Dependencies**: None (uses CDN)

### To Host Yourself:

**Option 1: GitHub Pages**
1. Create GitHub repository
2. Upload `index.html`, `config.js`, `package.json`
3. Enable Pages in repo settings
4. Visit `yourname.github.io/repo-name`

**Option 2: Netlify**
1. Connect GitHub repo
2. Set build command: (none needed)
3. Deploy!

**Option 3: Local Server**
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then visit: http://localhost:8000
```

---

## 🔐 Security Best Practices

### API Keys:
- ✅ ImgBB API key is **public-safe** (rate-limited)
- ✅ Puter.com uses **no authentication** needed
- ✅ No sensitive data in frontend code

### CORS Considerations:
- ✅ ImgBB allows CORS from browsers
- ✅ Puter.com handles CORS properly
- ✅ No proxy server needed

### If Deploying Commercially:
1. Move ImgBB key to backend server
2. Implement authentication if needed
3. Add rate limiting
4. Monitor API usage

---

## 📊 Performance Tuning

### Optimize Image Upload:
```javascript
// Compress image before upload
async function compressImage(file) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
        canvas.width = img.width * 0.8;
        canvas.height = img.height * 0.8;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => uploadImageToImgbb(blob));
    };
    img.src = URL.createObjectURL(file);
}
```

### Cache Responses:
```javascript
const responseCache = new Map();

async function getCachedResponse(message, model) {
    const key = `${model}:${message}`;
    if (responseCache.has(key)) {
        return responseCache.get(key);
    }
    
    const response = await puter.ai.chat(message, { model });
    responseCache.set(key, response);
    return response;
}
```

---

## 🐛 Debugging Configuration

### Enable Debug Logging:
All debug logs are already in console. Open DevTools with `F12` and go to **Console** tab to see:
- ✅ Model selection
- ✅ Image upload progress
- ✅ API calls
- ✅ Streaming responses
- ✅ Error messages

### Check API Status:
```javascript
// Add to console to test Puter
await puter.ai.chat('Hello', { model: 'gpt-5-nano' })
```

---

## 📝 Configuration Checklist

Before deploying:

- [ ] Test image upload functionality
- [ ] Verify all AI models work
- [ ] Check image preview displays correctly
- [ ] Test streaming responses
- [ ] Clear browser cache and test
- [ ] Test on mobile devices
- [ ] Check console for errors (F12)
- [ ] Verify all buttons are clickable

---

## 🆘 Troubleshooting Configuration Issues

### ImgBB API Not Working:
1. Check API key is correct
2. Verify file size < 32 MB
3. Check image format supported
4. Try: https://api.imgbb.com/1/upload in browser

### Puter Models Not Responding:
1. Check internet connection
2. Visit https://puter.com/ for status
3. Try different model
4. Clear browser cache
5. Try incognito mode

### Styling Issues:
1. Clear browser cache (Ctrl+Shift+Del)
2. Check CSS syntax
3. Verify no CSS conflicts
4. Try different browser

---

## 📚 Additional Resources

- **Puter.com Docs**: https://docs.puter.com/
- **ImgBB API**: https://api.imgbb.com/
- **Font Awesome Icons**: https://fontawesome.com/
- **JavaScript Async/Await**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

---

## ✅ You're All Set!

Your FreeAI application is fully configured and ready to use with:
- ✅ 6 powerful AI models
- ✅ Image upload & analysis
- ✅ Real-time streaming
- ✅ No API keys to manage (for normal use)

Happy configuring! 🎉
