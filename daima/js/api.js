// API密钥配置
const API_KEY = "5970215e0527722bdb6f023878631b44.mzii92qd9t0K1wB3"; // 智谱AI平台的API Key

// 生成JWT Token
async function generateToken() {
    const [id, secret] = API_KEY.split('.');
    const now = Date.now();
    
    const payload = {
        api_key: id,
        exp: now + 3600 * 1000, // 1小时后过期
        timestamp: now
    };
    
    const header = {
        alg: 'HS256',
        sign_type: 'SIGN'
    };
    
    try {
        const token = jwt.sign(payload, secret, { 
            algorithm: 'HS256', 
            header: header 
        });
        return token;
    } catch (error) {
        console.error('Token generation failed:', error);
        return null;
    }
}

// 调用AI接口
async function chatWithAI(message) {
    const maxRetries = 3;
    let retryCount = 0;
    
    async function tryRequest() {
        try {
            const headers = {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            };

            const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    model: 'glm-4',
                    messages: [
                        {
                            role: 'user',
                            content: message
                        }
                    ]
                })
            });

            if (!response.ok) {
                if (retryCount < maxRetries) {
                    retryCount++;
                    return await tryRequest();
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('AI chat failed:', error);
            if (retryCount < maxRetries) {
                retryCount++;
                return await tryRequest();
            }
            return '抱歉，我现在无法回答。请稍后再试。';
        }
    }
    
    return tryRequest();
} 