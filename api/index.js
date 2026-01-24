// Minimal serverless function for debugging
module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Simple health check
    if (req.url === '/api/health' || req.url === '/health') {
        return res.status(200).json({
            success: true,
            message: 'SkillBridge API is running on Vercel (minimal mode)',
            timestamp: new Date().toISOString(),
            url: req.url,
            method: req.method
        });
    }

    // Root endpoint
    if (req.url === '/api' || req.url === '/' || req.url === '/api/') {
        return res.status(200).json({
            success: true,
            message: 'Welcome to SkillBridge API',
            version: '1.0.0 - minimal',
            availableEndpoints: ['/api/health']
        });
    }

    // 404 for everything else
    return res.status(404).json({
        success: false,
        message: 'Route not found',
        requestedUrl: req.url
    });
};
