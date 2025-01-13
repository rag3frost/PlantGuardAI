document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = 'AIzaSyACUClXDftmaracRcV_LXsxVxPSUUoCuDY'; // Your API key

    const chatContainer = document.querySelector('.chat-widget');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    if (!chatForm || !chatInput || !chatMessages) {
        console.error('Chat elements not found!');
        return;
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage('user', message);
        chatInput.value = '';

        // Show typing indicator
        addTypingIndicator();

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Remove typing indicator
            removeTypingIndicator();

            // Add AI response to chat
            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                addMessage('ai', aiResponse);
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('Error:', error);
            removeTypingIndicator();
            addMessage('ai', 'Sorry, I encountered an error. Please try again. Error: ' + error.message);
        }
    });

    function addMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <span class="sender-icon">${sender === 'user' ? '👤' : '🤖'}</span>
                <p>${message}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Initialize chat with a welcome message
    addMessage('ai', 'Hello! I am your AI assistant. How can I help you today?');
});

function toggleChat() {
    const chatWidget = document.querySelector('.chat-widget');
    const minimizeButton = document.getElementById('minimize-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.querySelector('.chat-input-container');
    
    if (chatWidget.style.height === '50px') {
        chatWidget.style.height = '500px';
        minimizeButton.textContent = '−';
        chatMessages.style.display = 'block';
        chatForm.style.display = 'block';
    } else {
        chatWidget.style.height = '50px';
        minimizeButton.textContent = '+';
        chatMessages.style.display = 'none';
        chatForm.style.display = 'none';
    }
} 