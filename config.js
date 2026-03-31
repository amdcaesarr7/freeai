// 🔑 API Configuration File
// Keep your API keys here and never commit this to version control

const CONFIG = {
    // Multiple API Keys for fallback
    apiKeys: [
        'AIzaSyDA_WDlSFNG7RaF-d6DMKWFYTMr_F4n5pY',
        'AIzaSyBYYQx66PvcYsyl4IhFX3Z4jLft_iJyrIM',
        'AIzaSyB36jC41Gf94mU_aGLNAbwBN5nIm2VRXko'
    ],

    // CORS Proxy to bypass browser restrictions
    corsProxy: 'https://api.allorigins.win/raw?url=',
    
    // Google Gemini API endpoint
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    
    // Model to use (Google Gemini)
    model: 'gemini-pro',
    
    // Max tokens per response
    maxTokens: 500
};

console.log('✅ Config loaded:', {
    keysCount: CONFIG.apiKeys.length,
    corsProxy: CONFIG.corsProxy,
    model: CONFIG.model
});
