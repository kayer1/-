document.addEventListener('DOMContentLoaded', function() {
    new Swiper('.swiper', {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });

    const notificationBar = document.querySelector('.notification-bar');
    const closeButton = document.querySelector('.notification-close');

    closeButton.addEventListener('click', function() {
        notificationBar.classList.add('hidden');
        document.body.style.paddingTop = '0';
    });

    setTimeout(() => {
        notificationBar.classList.add('hidden');
        document.body.style.paddingTop = '0';
    }, 5000);

    // AI助手对话框功能
    const sendButton = document.getElementById('sendMessage');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.querySelector('.chat-messages');

    if (!sendButton || !userInput || !chatMessages) {
        console.error('Chat elements not found:', {
            sendButton: !!sendButton,
            userInput: !!userInput,
            chatMessages: !!chatMessages
        });
        return;
    }

    // 清除原有的消息内容
    chatMessages.innerHTML = '';

    // 添加初始欢迎消息
    addMessage(`你好！我是AI助手。我可以：
    1. 回答关于张帅峰的简历问题
    2. 提供更多职业经历细节
    3. 解答技术相关问题
    
    请问有什么我可以帮你的吗？`, false);

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        if (!isUser) {
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = '🤖';
            messageDiv.appendChild(avatar);
        }
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = message;
        messageDiv.appendChild(content);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    }

    async function handleUserMessage() {
        const message = userInput.value.trim();
        if (message) {
            console.log('Sending message:', message);
            addMessage(message, true);
            userInput.value = '';
            
            try {
                // 显示加载状态
                const loadingMessage = addMessage('正在思考...', false);
                console.log('Calling AI API...');
                if (typeof chatWithAI !== 'function') {
                    throw new Error('chatWithAI function not found');
                }
                const response = await chatWithAI(message);
                console.log('AI response:', response);
                // 移除加载消息
                loadingMessage.remove();
                addMessage(response, false);
            } catch (error) {
                console.error('Chat error details:', {
                    message: error.message,
                    stack: error.stack,
                    error: error
                });
                addMessage('抱歉，发生了一些错误，请稍后再试。', false);
            }
        }
    }

    // 发送按钮点击事件
    sendButton.addEventListener('click', () => {
        console.log('Send button clicked');
        handleUserMessage();
    });

    // 输入框回车事件
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    // 简历预览和下载功能
    function openPreview() {
        const modal = document.getElementById('previewModal');
        const pdfPreview = document.getElementById('pdfPreview');
        pdfPreview.src = 'images/resume.pdf';
        modal.style.display = 'block';
        
        // 关闭模态框
        const closeBtn = document.querySelector('.close-modal');
        closeBtn.onclick = function() {
            modal.style.display = 'none';
            pdfPreview.src = '';
        }
        
        // 点击模态框外部关闭
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
                pdfPreview.src = '';
            }
        }
    }
    
    function downloadResume() {
        const link = document.createElement('a');
        link.href = 'images/resume.pdf';
        link.download = '张帅峰个人简历.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}); 