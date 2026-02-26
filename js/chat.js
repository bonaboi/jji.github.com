// ============================================================
// CHATBOT FUNCTIONALITY
// ============================================================

// Make these global so they work across pages
window.chatOpen = false;
window.chatStarted = false;

function toggleChat() {
    window.chatOpen = !window.chatOpen;
    const win = document.getElementById('chat-window');
    if (win) {
        if (window.chatOpen) {
            win.classList.add('open');
            if (!window.chatStarted) initChat();
        } else {
            win.classList.remove('open');
        }
    }
}

function initChat() {
    window.chatStarted = true;
    const d = getData();
    const messagesEl = document.getElementById('chat-messages');
    if (messagesEl) messagesEl.innerHTML = '';
    addBotMsg(d.site.botWelcome || 'Hi! Welcome! How can I help?');
    renderQuickBtns();
}

function renderQuickBtns() {
    const qb = document.getElementById('chat-quick-btns');
    if (!qb) return;
    
    qb.innerHTML = '';
    ['Services', 'Booking', 'Incall / Outcall', 'Rates', 'Discretion'].forEach(label => {
        const b = document.createElement('button');
        b.className = 'quick-btn';
        b.textContent = label;
        b.onclick = () => {
            sendChatMsg(label);
            if (qb) qb.innerHTML = '';
        };
        qb.appendChild(b);
    });
}

function addBotMsg(text) {
    const m = document.getElementById('chat-messages');
    if (!m) return;
    
    const d = document.createElement('div');
    d.className = 'msg bot';
    d.textContent = text;
    m.appendChild(d);
    m.scrollTop = m.scrollHeight;
}

function addUserMsg(text) {
    const m = document.getElementById('chat-messages');
    if (!m) return;
    
    const d = document.createElement('div');
    d.className = 'msg user';
    d.textContent = text;
    m.appendChild(d);
    m.scrollTop = m.scrollHeight;
}

function showTyping() {
    const m = document.getElementById('chat-messages');
    if (!m) return;
    
    // Remove existing typing indicator
    hideTyping();
    
    const d = document.createElement('div');
    d.className = 'typing-indicator';
    d.id = 'typing';
    d.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    m.appendChild(d);
    m.scrollTop = m.scrollHeight;
}

function hideTyping() {
    const t = document.getElementById('typing');
    if (t) t.remove();
}

function sendChat() {
    const inp = document.getElementById('chat-input');
    if (!inp) return;
    
    const text = inp.value.trim();
    if (!text) return;
    
    inp.value = '';
    sendChatMsg(text);
}

function sendChatMsg(text) {
    addUserMsg(text);
    
    const qb = document.getElementById('chat-quick-btns');
    if (qb) qb.innerHTML = '';
    
    showTyping();
    
    setTimeout(() => {
        hideTyping();
        addBotMsg(getBotReply(text.toLowerCase()));
    }, 700 + Math.random() * 600);
}

function getBotReply(msg) {
    const d = getData();
    
    // Check FAQ matches
    for (const faq of d.chatFAQ || []) {
        const kw = faq.q.toLowerCase().split(/\s+/).filter(w => w.length > 3 && msg.includes(w));
        if (kw.length >= 2) return faq.a;
    }
    
    // Keyword-based responses
    if (msg.includes('book') || msg.includes('appoint') || msg.includes('session') || msg.includes('schedul')) {
        return `Book via our Book Now page or reach us on ${d.channels.map(c => c.name).join(', ')}. We respond quickly!`;
    }
    
    if (msg.includes('service') || msg.includes('massage') || msg.includes('offer')) {
        return `We offer: ${d.services.map(s => s.name).join(', ')}. Any specific service you'd like to know more about?`;
    }
    
    if (msg.includes('price') || msg.includes('rate') || msg.includes('cost') || msg.includes('how much')) {
        return `Rates vary by service and duration. Contact us directly for a personalized quote!`;
    }
    
    if (msg.includes('incall') || msg.includes('outcall') || msg.includes('location')) {
        return `We offer both! Incall is at our private studio. Outcall — we come to your location with everything needed.`;
    }
    
    if (msg.includes('discreet') || msg.includes('private') || msg.includes('confidential')) {
        return `Absolutely. All sessions are 100% private and discreet. Your information is never shared.`;
    }
    
    if (msg.includes('certif') || msg.includes('qualif')) {
        return `Yes! View our professional certifications on the Certification page accessible from the menu.`;
    }
    
    if (msg.includes('hello') || msg.includes('hi ') || msg.includes('hey')) {
        return `Hi there! 💫 How can I help you today?`;
    }
    
    if (msg.includes('thank')) {
        return `You're welcome! Anything else I can help with?`;
    }
    
    if (msg.includes('contact') || msg.includes('reach') || msg.includes('phone')) {
        return `Reach us at ${d.site.phone} or via ${d.channels.map(c => `${c.name}: ${c.value}`).join(' · ')}.`;
    }
    
    return `Thanks for reaching out! For the best answer, contact us at ${d.site.phone} or use the booking page. We reply fast! 💛`;
}