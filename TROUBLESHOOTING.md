# 🔧 Troubleshooting Guide - FreeAI v2.0

## Common Issues & Solutions

---

## 📸 Image Upload Issues

### **Problem: "Image upload failed"**

**Possible Causes & Solutions:**

1. **File Too Large**
   - ImgBB free tier limit: **32 MB**
   - Solution: Compress image or choose smaller file
   - Try: PNG instead of BMP, JPG instead of high-res PNG

2. **Unsupported File Format**
   - Supported: JPEG, PNG, GIF, WebP, BMP, TIFF
   - Solution: Convert image to JPEG or PNG
   - Try: Online converter or image editor

3. **API Key Invalid**
   - Check: Line 259 in index.html
   - Verify: `d2e46fa86f4509e6d26b5a9bb7332152`
   - If wrong, get new key from imgbb.com

4. **Network Connection**
   - Solution: Check internet connection
   - Try: Refresh page (Ctrl+R)
   - Test: Visit imgbb.com directly

5. **Browser Cache Issues**
   - Solution: Clear cache (Ctrl+Shift+Del)
   - Try: Incognito mode
   - Try: Different browser

**Debug Steps:**
```
1. Open browser console (F12)
2. Look for error messages starting with "❌"
3. Check "Network" tab for failed requests
4. Note the exact error message
```

---

### **Problem: Image preview not showing**

**Solutions:**
1. Refresh the page (Ctrl+R)
2. Try a different image format
3. Check browser console for errors (F12)
4. Try uploading a smaller image
5. Clear browser cache

**Image Preview Issues:**
- If image doesn't display after upload:
  - The upload succeeded but display failed
  - This is rare but can happen with certain formats
  - Solution: Try JPG format instead

---

### **Problem: "Image analysis failed" after upload**

**This means:**
- Image uploaded successfully ✅
- AI model couldn't analyze it ❌

**Solutions:**
1. The image might be too complex
2. The AI model might have limitations
3. Try a different model (Gemini is best for images)
4. Try a simpler image
5. Add a specific text prompt with the image

**Best Model for Images:**
→ Use **Gemini 2.5 Flash** for image analysis

---

## 🤖 AI Model Issues

### **Problem: Model not responding**

**Solutions in Order:**

1. **Check Internet Connection**
   - No response usually means network issue
   - Try: Refresh page (Ctrl+R)
   - Try: Different model

2. **Puter.com Service Down?**
   - Visit: https://puter.com/
   - Check service status
   - Wait and retry

3. **Browser Cache Issue**
   - Solution: Hard refresh (Ctrl+Shift+R)
   - Try: Incognito/Private mode
   - Try: Different browser (Chrome/Firefox/Edge)

4. **Try Different Model**
   - Some models might be temporarily unavailable
   - GPT-5 Nano is usually most reliable
   - Try: Claude Sonnet 4.5

5. **Check Browser Console**
   - Press F12 → Console tab
   - Look for red error messages
   - Share error with support

---

### **Problem: Slow response time**

**Why it might be slow:**

| Model | Speed | Note |
|-------|-------|------|
| GPT-5 Nano | ⚡⚡⚡ Fast | Best for quick responses |
| Gemini 2.5 | ⚡⚡⚡ Fast | Great for images |
| Grok-4 | ⚡⚡⚡ Fast | Fun responses |
| Claude Sonnet | ⚡⚡ Medium | Quality over speed |
| DeepSeek v3.2 | ⚡⚡ Medium | Shows reasoning |
| DeepSeek Reasoner | ⚡ Slow | Deep analysis |

**Solutions:**
1. **Use faster model**: GPT-5 Nano or Gemini
2. **Shorter prompts**: Longer questions = slower responses
3. **Check connection**: Slow internet = slow responses
4. **Wait longer**: Some models take time to start

---

### **Problem: Model button not responding**

**Causes:**
1. JavaScript error
2. UI not fully loaded
3. Browser issue

**Solutions:**
1. Wait 2-3 seconds for page to fully load
2. Refresh page (F5 or Ctrl+R)
3. Open console (F12) to check for errors
4. Try different browser
5. Clear cache (Ctrl+Shift+Del)

---

### **Problem: "GPT-5 Nano" model says "not available"**

**Note:** Some models might be temporarily unavailable or renamed

**Solutions:**
1. Try: Claude Sonnet 4.5 (usually always available)
2. Try: Gemini 2.5 Flash
3. Check Puter.com status page
4. Wait a few minutes and retry

---

## 💬 Chat/Message Issues

### **Problem: Message not sending**

**Quick Fixes:**
1. Check message isn't empty
2. Make sure Enter key works
3. Try clicking Send button instead
4. Refresh page (Ctrl+R)

**What's needed:**
- ✅ Either text message OR image
- ✅ Internet connection
- ✅ Valid AI model selected

---

### **Problem: Response never appears**

**Possible Issues:**

1. **Typing indicator stuck**
   - Solution: Send another message
   - This cancels the previous request

2. **Network timeout**
   - Solution: Check internet connection
   - Try: Reload page

3. **Model is processing**
   - For long responses, wait 10+ seconds
   - Don't send new message until first completes

4. **Browser is frozen**
   - Solution: Close browser and reopen
   - Try: Ctrl+Shift+R (hard refresh)

---

### **Problem: Response text is garbled or wrong**

**Possible Causes:**
1. Character encoding issue (rare)
2. Very long response doesn't display well
3. Special characters cause display issues

**Solutions:**
1. Refresh page (Ctrl+R)
2. Try shorter prompt
3. Use different model
4. Check browser console for errors

---

### **Problem: Can't clear chat history**

**Causes:**
1. Clear button not responding
2. JavaScript error

**Solutions:**
1. Click the trash can icon (🗑️)
2. Refresh page (Ctrl+R)
3. Open console (F12) to check errors
4. Try browser's local storage clearing:
   - Press F12 → Application tab
   - Storage → Local Storage
   - Clear all

---

## 🎨 UI/Display Issues

### **Problem: Buttons not visible/clickable**

**Causes:**
1. CSS didn't load
2. Browser zoom too high/low
3. Screen resolution issue

**Solutions:**
1. Hard refresh: Ctrl+Shift+R
2. Reset zoom: Ctrl+0
3. Maximize browser window
4. Try full screen: F11 (then F11 again to exit)
5. Try different resolution (scale down)

---

### **Problem: Model selector buttons not showing**

**Solutions:**
1. Refresh page (F5)
2. Hard refresh (Ctrl+Shift+R)
3. Check browser console (F12)
4. Try different browser
5. Clear browser cache

**What you should see:**
- 6 buttons in a row at top of input area
- Default button is highlighted
- Button text: GPT-5 Nano, Claude Sonnet 4.5, etc.

---

### **Problem: Image preview not displaying**

**Solutions:**
1. Refresh page (Ctrl+R)
2. Try uploading different image
3. Try JPG format
4. Check console (F12) for errors
5. Disable browser extensions

---

### **Problem: Chat text overlapping or cut off**

**Causes:**
1. Window too narrow
2. Very long words in message
3. Browser zoom issue

**Solutions:**
1. Maximize window
2. Press Ctrl+0 to reset zoom
3. Widen browser window
4. Try full screen (F11)

---

## 🌐 Browser-Specific Issues

### **Chrome/Chromium Issues**

**If nothing works:**
1. Chrome Settings → Clear browsing data
2. Select: Cookies and cache
3. Range: All time
4. Click Clear

**Check:**
- Extensions don't interfere (disable all)
- Hardware acceleration enabled
- JavaScript enabled

### **Firefox Issues**

**Solutions:**
1. Menu → History → Clear Recent History
2. Select: Cache, Cookies
3. Refresh page

**Common Issue:**
- CORS might be stricter in Firefox
- Try Chrome if needed

### **Safari Issues**

**Solutions:**
1. Safari → Preferences → Privacy
2. Clear all website data
3. Reload page

**Note:**
- Image upload works differently in Safari
- Try Chrome for better compatibility

### **Edge Issues**

**Solutions:**
1. Settings → Privacy → Clear browsing data
2. Clear everything
3. Restart Edge
4. Try again

---

## 🔍 Advanced Debugging

### **How to Check Console for Errors**

1. **Open Console:**
   - Windows: F12 or Ctrl+Shift+I
   - Mac: Cmd+Option+I

2. **Look for messages:**
   - 🔵 Blue = Info messages
   - 🟡 Yellow = Warnings
   - 🔴 Red = Errors (IMPORTANT)

3. **Common error patterns:**
   ```
   ❌ Image upload failed: [reason]
   ❌ Error: [model name]
   ❌ Connection error
   ```

4. **Copy error message:**
   - Right-click error → Copy message
   - Share for debugging

### **How to Check Network Requests**

1. **Open DevTools:** F12
2. **Click Network tab**
3. **Perform action** (e.g., upload image)
4. **Look for requests:**
   - ✅ Green = Success
   - 🔴 Red = Failed
   - Look for "api.imgbb.com" (image upload)
   - Look for "puter.com" (AI requests)

---

## 🆘 If Nothing Else Works

### **Nuclear Option - Reset Everything**

1. **Clear All Browser Data**
   - Ctrl+Shift+Del (all browsers)
   - Select "All time"
   - Clear cookies, cache, storage

2. **Close All Browser Instances**
   - Close all tabs and windows
   - Restart browser

3. **Reload Page**
   - Type URL again
   - Press Ctrl+Shift+R (hard refresh)

4. **Try Different Browser**
   - If issue persists, try Chrome/Firefox/Edge
   - If different browser works, it's a browser issue
   - If all browsers have issue, it's server-side

### **Contact Support**

When reporting issues, provide:
1. Error message from console (F12)
2. Browser type and version
3. Operating system
4. Which feature failed (upload, chat, model)
5. Steps to reproduce

---

## ✅ Quick Checklist

Before saying something is broken, verify:

- [ ] Internet connection is active
- [ ] Page is fully loaded (wait 2 seconds)
- [ ] JavaScript is enabled in browser
- [ ] Browser cache cleared (Ctrl+Shift+Del)
- [ ] Tried hard refresh (Ctrl+Shift+R)
- [ ] Tried different model
- [ ] Checked browser console (F12)
- [ ] Tried different browser
- [ ] Tried incognito/private mode
- [ ] Checked service status (puter.com)

If all pass: It's likely a network or service issue, not your browser!

---

## 📞 Getting More Help

### **Check These Resources:**

1. **Puter.com Status:**
   - Visit: https://puter.com/
   - Check if service is online

2. **ImgBB API Status:**
   - Visit: https://imgbb.com/
   - Can you access the website?

3. **Browser Compatibility:**
   - Latest Chrome: Always works best
   - Firefox: Usually works
   - Safari: Generally works
   - Edge: Good compatibility

4. **Console Logging:**
   - All actions are logged
   - Open F12 → Console
   - Look for helpful messages (they start with emojis)

---

## 🎯 Quick Solutions by Symptom

| Symptom | First Try | Second Try | Third Try |
|---------|-----------|-----------|-----------|
| No response | Ctrl+Shift+R | Different model | Different browser |
| Upload fails | Try JPG | Smaller file | F12 check console |
| Slow response | Use GPT-5 | Shorter prompt | Wait longer |
| Button not working | Refresh page | Hard refresh | Incognito mode |
| Text garbled | Refresh page | Different model | Clear cache |
| Can't see buttons | Hard refresh | Ctrl+0 (zoom) | F12 check errors |

---

## 🎉 Success Indicators

When everything works, you should see:

✅ Model buttons appear immediately
✅ Upload button is clickable
✅ Messages send without delay
✅ AI responds within 10 seconds
✅ Image preview displays
✅ Streaming response appears in real-time
✅ No errors in console (F12)

---

**Remember:** Most issues are temporary and resolve with a refresh!

If you're stuck, try the "Nuclear Option" above - it fixes ~95% of issues! 🚀
