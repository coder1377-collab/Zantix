/**
 * Zantix — Your Dost Chatbot Frontend Logic
 * Handles: message sending, Gemini API communication via backend,
 * typing indicators, mood selection, auto-expanding textarea, theme toggle.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── CONFIG ───
  const API_URL = window.location.protocol === 'file:'
    ? 'http://localhost:5001/api/chat'
    : '/api/chat';

  // ─── DOM REFERENCES ───
  const messagesContainer = document.getElementById('messages-container');
  const welcomeScreen = document.getElementById('welcome-screen');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const charCount = document.getElementById('char-count');
  const clearChatBtn = document.getElementById('clear-chat');
  const clearChatMobileBtn = document.getElementById('clear-chat-mobile');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('chatbot-sidebar');
  const themeToggle = document.getElementById('theme-toggle');

  // ─── STATE ───
  let conversationHistory = [];
  let isWaitingForReply = false;

  // ─── THEME TOGGLE ───
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });


  // ─── SIDEBAR TOGGLE (Mobile) ───
  let overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  function toggleSidebar() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }

  sidebarToggle.addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', closeSidebar);


  // ─── AUTO-EXPANDING TEXTAREA ───
  chatInput.addEventListener('input', () => {
    // Auto-resize
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';

    // Update char count
    const len = chatInput.value.length;
    charCount.textContent = `${len}/2000`;

    // Toggle send button
    sendBtn.disabled = len === 0 || isWaitingForReply;
  });


  // ─── SEND MESSAGE ───
  function sendMessage(text) {
    if (!text.trim() || isWaitingForReply) return;

    // Hide welcome screen
    if (welcomeScreen) {
      welcomeScreen.style.display = 'none';
    }

    // Add user message to UI
    addMessage('user', text.trim());

    // Add to history
    conversationHistory.push({ role: 'user', content: text.trim() });

    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    charCount.textContent = '0/2000';
    sendBtn.disabled = true;

    // Show typing indicator
    showTypingIndicator();
    isWaitingForReply = true;

    // Send to backend
    fetchReply(text.trim());
  }

  // Send button click
  sendBtn.addEventListener('click', () => sendMessage(chatInput.value));

  // Enter key (Shift+Enter for newline)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chatInput.value);
    }
  });


  // ─── FETCH REPLY FROM BACKEND ───
  async function fetchReply(message) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          history: conversationHistory.slice(0, -1) // exclude current message (already sent)
        })
      });

      const data = await response.json();

      removeTypingIndicator();
      isWaitingForReply = false;

      if (response.ok && data.reply) {
        addMessage('ai', data.reply);
        conversationHistory.push({ role: 'model', content: data.reply });
      } else {
        showError(data.error || 'Something went wrong. Please try again.');
      }

    } catch (err) {
      removeTypingIndicator();
      isWaitingForReply = false;
      showError('Unable to connect. Make sure the server is running on http://localhost:5001');
    }

    sendBtn.disabled = chatInput.value.length === 0;
  }


  // ─── ADD MESSAGE TO UI ───
  function addMessage(role, text) {
    const row = document.createElement('div');
    row.className = `message-row ${role}`;

    const avatar = document.createElement('div');
    avatar.className = `msg-avatar ${role === 'ai' ? 'ai-av' : 'user-av'}`;

    if (role === 'ai') {
      avatar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`;
    } else {
      avatar.textContent = 'You';
    }

    const content = document.createElement('div');
    content.className = 'msg-content';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    // Format the text — convert markdown-like bold and newlines
    bubble.innerHTML = formatMessage(text);

    const time = document.createElement('div');
    time.className = 'msg-time';
    time.textContent = getTimeString();

    content.appendChild(bubble);
    content.appendChild(time);

    row.appendChild(avatar);
    row.appendChild(content);

    messagesContainer.appendChild(row);
    scrollToBottom();
  }


  // ─── FORMAT MESSAGE TEXT ───
  function formatMessage(text) {
    return text
      // Bold **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic *text*
      .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
      // Newlines
      .replace(/\n/g, '<br>');
  }


  // ─── TYPING INDICATOR ───
  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typing-indicator';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar ai-av';
    avatar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`;

    const dots = document.createElement('div');
    dots.className = 'typing-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';

    indicator.appendChild(avatar);
    indicator.appendChild(dots);
    messagesContainer.appendChild(indicator);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }


  // ─── ERROR DISPLAY ───
  function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-bubble';
    errorEl.innerHTML = `⚠️ ${message} <button class="retry-btn" onclick="this.parentElement.remove()">Dismiss</button>`;
    messagesContainer.appendChild(errorEl);
    scrollToBottom();
  }


  // ─── UTILITIES ───
  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }

  function getTimeString() {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }


  // ─── WELCOME CHIPS (initial suggestions) ───
  document.querySelectorAll('.welcome-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const msg = chip.getAttribute('data-msg');
      sendMessage(msg);
    });
  });


  // ─── MOOD QUICK BUTTONS ───
  document.querySelectorAll('.mood-quick-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      // Deselect others
      document.querySelectorAll('.mood-quick-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');

      const mood = this.getAttribute('data-mood');
      sendMessage(`I'm feeling ${mood} right now.`);
      closeSidebar();
    });
  });


  // ─── TOPIC CHIPS ───
  document.querySelectorAll('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const topic = chip.getAttribute('data-topic');
      sendMessage(topic);
      closeSidebar();
    });
  });


  // ─── CLEAR CHAT ───
  function clearChat() {
    conversationHistory = [];
    isWaitingForReply = false;

    // Remove all messages
    messagesContainer.innerHTML = '';

    // Re-create and show welcome screen
    const welcome = createWelcomeScreen();
    messagesContainer.appendChild(welcome);

    // Deselect mood buttons
    document.querySelectorAll('.mood-quick-btn').forEach(b => b.classList.remove('selected'));

    chatInput.value = '';
    chatInput.style.height = 'auto';
    charCount.textContent = '0/2000';
    sendBtn.disabled = true;
  }

  function createWelcomeScreen() {
    const div = document.createElement('div');
    div.className = 'welcome-screen';
    div.id = 'welcome-screen';
    div.innerHTML = `
      <div class="welcome-glow"></div>
      <div class="welcome-avatar">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      </div>
      <h2 class="welcome-title">Hey there 💚</h2>
      <p class="welcome-sub">I'm <strong>Your Dost</strong> — your anonymous AI companion.<br>This is a safe space. No judgment, no identity, no pressure.<br>Whatever you're feeling, I'm here to listen.</p>
      <div class="welcome-suggestions">
        <button class="welcome-chip" data-msg="I'm not doing great today...">😔 I'm not doing great</button>
        <button class="welcome-chip" data-msg="I just need someone to talk to">💬 Just want to talk</button>
        <button class="welcome-chip" data-msg="I'm feeling overwhelmed with everything">😰 Feeling overwhelmed</button>
        <button class="welcome-chip" data-msg="I had a rough day and need to vent">🌧️ Had a rough day</button>
      </div>
      <p class="welcome-disclaimer">🔒 Anonymous · Not a substitute for therapy · Available 24/7</p>
    `;

    // Re-bind chip listeners
    div.querySelectorAll('.welcome-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const msg = chip.getAttribute('data-msg');
        sendMessage(msg);
      });
    });

    return div;
  }

  clearChatBtn.addEventListener('click', clearChat);
  clearChatMobileBtn.addEventListener('click', () => {
    clearChat();
    closeSidebar();
  });


  // ─── FOCUS INPUT ON LOAD ───
  chatInput.focus();
});
