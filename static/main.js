// Function to show a specific section and hide others
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    // Update URL with the section parameter
    const url = new URL(window.location.href);
    url.searchParams.set('section', sectionId);
    window.history.pushState({}, '', url);
}

// Function to handle initial section display based on URL parameter
function handleInitialSection() {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    
    if (section) {
        showSection(section);
    } else {
        showSection('home'); // Default to home if no section specified
    }
}

// Add event listener for when the page loads
document.addEventListener('DOMContentLoaded', handleInitialSection);

// Add event listener for browser back/forward buttons
window.addEventListener('popstate', handleInitialSection);

// Add this at the end of your existing main.js
function toggleChat() {
    const chatWidget = document.querySelector('.chat-widget');
    const minimizeButton = document.getElementById('minimize-chat');
    
    if (chatWidget.style.height === '50px') {
        chatWidget.style.height = '500px';
        minimizeButton.textContent = '−';
    } else {
        chatWidget.style.height = '50px';
        minimizeButton.textContent = '+';
    }
}