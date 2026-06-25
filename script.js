document.addEventListener('DOMContentLoaded', () => {
  // ─── THEME TOGGLE ───
  const themeToggle = document.getElementById('theme-toggle');
  
  // Set initial theme based on saved preference, default to light
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

  // ─── SMOOTH SCROLL FOR BUTTONS ───
  // Smooth scroll helper
  const scrollToSection = (selector) => {
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openChatbot = () => {
    window.location.href = 'chatbot.html';
  };

  // Nav start talking button
  const navStartTalkingBtn = document.getElementById('nav-start-talking');
  if (navStartTalkingBtn) {
    navStartTalkingBtn.addEventListener('click', openChatbot);
  }

  // Hero action start talking button
  const heroStartTalkingBtn = document.getElementById('hero-start-talking');
  if (heroStartTalkingBtn) {
    heroStartTalkingBtn.addEventListener('click', openChatbot);
  }

  // Hero action explore community button
  const heroExploreCommunityBtn = document.getElementById('hero-explore-community');
  if (heroExploreCommunityBtn) {
    heroExploreCommunityBtn.addEventListener('click', () => {
      window.location.href = 'community.html';
    });
  }

  // ─── COMMUNITY PAGE ───
  const communityCompose = document.getElementById('community-compose');
  const communityPosts = document.getElementById('community-posts');
  const communityTitle = document.getElementById('community-title');
  const communityBody = document.getElementById('community-body');
  const communityTopic = document.getElementById('community-topic');
  const communityComposeStatus = document.getElementById('community-compose-status');
  const communityDownloadBtn = document.getElementById('community-download');
  const communityDownloadStatus = document.getElementById('community-download-status');
  const communityStorageKey = 'zantixCommunityPosts';

  const defaultCommunityPosts = [
    {
      id: 'seed-1',
      topic: 'Exam Stress',
      title: "How do you stop feeling like one bad test decides your whole future?",
      body: "I studied for weeks and still blanked out. Everyone is telling me to move on, but my chest feels tight whenever I think about the next exam.",
      votes: 128,
      replies: [
        { body: "One test can feel huge when you are exhausted. Take tonight to breathe, then look at only one chapter tomorrow.", time: "10 min ago" }
      ],
      time: "12 min ago"
    },
    {
      id: 'seed-2',
      topic: 'Loneliness',
      title: "Is it normal to have friends but still feel completely unseen?",
      body: "I laugh with people in college, but nobody really knows what I am carrying. It feels strange to be surrounded and still lonely.",
      votes: 96,
      replies: [],
      time: "35 min ago"
    },
    {
      id: 'seed-3',
      topic: 'Career',
      title: "My parents want one path, but I want another. How do I even begin?",
      body: "I do not want to hurt them, but I also do not want to build a life that feels borrowed from someone else.",
      votes: 74,
      replies: [],
      time: "1 hr ago"
    }
  ];

  const escapeHtml = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const replayAnimation = (element, className) => {
    if (!element) return;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  };

  // Initialize seed posts if empty
  if (!localStorage.getItem(communityStorageKey)) {
    localStorage.setItem(communityStorageKey, JSON.stringify(defaultCommunityPosts));
  }

  const createDiscussionCard = (post) => {
    const card = document.createElement('article');
    card.className = 'discussion-card';
    card.dataset.topic = post.topic;
    card.dataset.id = post.id;
    card.dataset.votes = post.votes;
    card.dataset.repliesCount = post.replies.length;
    
    let repliesHtml = '';
    post.replies.forEach(reply => {
      repliesHtml += `
        <div class="reply-item">
          <div class="reply-meta">Anonymous · ${reply.time}</div>
          <div class="reply-body">${escapeHtml(reply.body)}</div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="vote-rail" data-vote="0">
        <button class="vote-btn upvote" type="button" aria-label="Upvote">▲</button>
        <span class="vote-count">${post.votes}</span>
        <button class="vote-btn downvote" type="button" aria-label="Downvote">▼</button>
      </div>
      <div class="discussion-content">
        <div class="discussion-meta">Anonymous · <span class="topic-tag tag-${escapeHtml(post.topic).toLowerCase().replace(/\s+/g, '-')}">${escapeHtml(post.topic)}</span> · ${escapeHtml(post.time)}</div>
        <h2>${escapeHtml(post.title)}</h2>
        <p>${escapeHtml(post.body)}</p>
        <div class="discussion-actions">
          <button class="discussion-action reply-trigger" type="button">Reply · <span class="reply-c-num">${post.replies.length}</span></button>
          <button class="discussion-action support-btn" type="button">Support</button>
          <button class="discussion-action save-btn" type="button">Save</button>
        </div>
        
        <div class="replies-panel" style="display: none;">
          <div class="replies-list">
            ${repliesHtml}
          </div>
          <form class="reply-composer">
            <input class="reply-input" placeholder="Write a supportive reply anonymously..." required></input>
            <button class="reply-submit-btn" type="submit">Reply</button>
          </form>
        </div>
      </div>
    `;

    const voteRail = card.querySelector('.vote-rail');
    const voteCountSpan = card.querySelector('.vote-count');
    const upvoteBtn = card.querySelector('.upvote');
    const downvoteBtn = card.querySelector('.downvote');
    
    const updatePostVotes = (newVoteValue) => {
      const savedPosts = JSON.parse(localStorage.getItem(communityStorageKey) || '[]');
      const targetPost = savedPosts.find(p => p.id === post.id);
      if (targetPost) {
        targetPost.votes = post.votes + newVoteValue;
        localStorage.setItem(communityStorageKey, JSON.stringify(savedPosts));
        voteCountSpan.textContent = targetPost.votes;
        card.dataset.votes = targetPost.votes;
        replayAnimation(voteCountSpan, 'vote-pop');
      }
    };

    upvoteBtn.addEventListener('click', () => {
      const currentVote = parseInt(voteRail.dataset.vote || '0');
      if (currentVote === 1) {
        voteRail.dataset.vote = '0';
        upvoteBtn.classList.remove('active');
        updatePostVotes(0);
      } else {
        voteRail.dataset.vote = '1';
        upvoteBtn.classList.add('active');
        downvoteBtn.classList.remove('active');
        updatePostVotes(1);
      }
    });

    downvoteBtn.addEventListener('click', () => {
      const currentVote = parseInt(voteRail.dataset.vote || '0');
      if (currentVote === -1) {
        voteRail.dataset.vote = '0';
        downvoteBtn.classList.remove('active');
        updatePostVotes(0);
      } else {
        voteRail.dataset.vote = '-1';
        downvoteBtn.classList.add('active');
        upvoteBtn.classList.remove('active');
        updatePostVotes(-1);
      }
    });

    const supportBtn = card.querySelector('.support-btn');
    supportBtn.addEventListener('click', () => {
      supportBtn.classList.toggle('active');
    });

    const saveBtn = card.querySelector('.save-btn');
    saveBtn.addEventListener('click', () => {
      saveBtn.classList.toggle('active');
    });

    const replyTrigger = card.querySelector('.reply-trigger');
    const repliesPanel = card.querySelector('.replies-panel');
    replyTrigger.addEventListener('click', () => {
      const isHidden = repliesPanel.style.display === 'none';
      repliesPanel.style.display = isHidden ? 'block' : 'none';
      replyTrigger.classList.toggle('active', isHidden);
    });

    const replyComposer = card.querySelector('.reply-composer');
    const replyInput = card.querySelector('.reply-input');
    const repliesList = card.querySelector('.replies-list');
    const replyCountNum = card.querySelector('.reply-c-num');

    replyComposer.addEventListener('submit', (e) => {
      e.preventDefault();
      const replyText = replyInput.value.trim();
      if (!replyText) return;

      const newReply = { body: replyText, time: 'Just now' };

      const savedPosts = JSON.parse(localStorage.getItem(communityStorageKey) || '[]');
      const targetPost = savedPosts.find(p => p.id === post.id);
      if (targetPost) {
        targetPost.replies.push(newReply);
        localStorage.setItem(communityStorageKey, JSON.stringify(savedPosts));
        
        const replyItemDiv = document.createElement('div');
        replyItemDiv.className = 'reply-item';
        replyItemDiv.innerHTML = `
          <div class="reply-meta">Anonymous · Just now</div>
          <div class="reply-body">${escapeHtml(newReply.body)}</div>
        `;
        repliesList.appendChild(replyItemDiv);
        
        replyInput.value = '';
        repliesList.scrollTop = repliesList.scrollHeight;
        
        replyCountNum.textContent = targetPost.replies.length;
        card.dataset.repliesCount = targetPost.replies.length;
      }
    });

    return card;
  };

  const renderPosts = () => {
    if (!communityPosts) return;
    
    communityPosts.innerHTML = '';
    const posts = JSON.parse(localStorage.getItem(communityStorageKey) || '[]');
    
    const activeTopicBtn = document.querySelector('.topic-pill.active');
    const activeTopic = activeTopicBtn ? activeTopicBtn.textContent.trim() : 'All';
    let filtered = posts.filter(post => activeTopic === 'All' || post.topic === activeTopic);
    
    const searchInput = document.getElementById('community-search');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (query) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.body.toLowerCase().includes(query)
      );
    }
    
    const activeSortBtn = document.querySelector('.sort-chip.active');
    const activeSort = activeSortBtn ? activeSortBtn.textContent.trim() : 'Top';
    
    if (activeSort === 'Top') {
      filtered.sort((a, b) => b.votes - a.votes);
    } else if (activeSort === 'New') {
      filtered.reverse();
    } else if (activeSort === 'Unanswered') {
      filtered = filtered.filter(post => post.replies.length === 0);
      filtered.sort((a, b) => b.votes - a.votes);
    }
    
    if (filtered.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'empty-posts-message';
      emptyMsg.style.textAlign = 'center';
      emptyMsg.style.padding = '40px';
      emptyMsg.style.color = 'var(--soft)';
      emptyMsg.innerHTML = `<p>No anonymous stories found matching your selection.</p>`;
      communityPosts.appendChild(emptyMsg);
    } else {
      filtered.forEach((post, index) => {
        const card = createDiscussionCard(post);
        card.style.setProperty('--card-index', index);
        communityPosts.appendChild(card);
      });
    }
  };

  if (communityPosts) {
    renderPosts();
  }

  if (communityDownloadBtn) {
    communityDownloadBtn.addEventListener('click', () => {
      const posts = JSON.parse(localStorage.getItem(communityStorageKey) || '[]');

      if (!posts.length) {
        if (communityDownloadStatus) communityDownloadStatus.textContent = 'No posts to download yet.';
        return;
      }

      const exportedAt = new Date();
      const payload = {
        app: 'Zantix Community',
        exportedAt: exportedAt.toISOString(),
        totalPosts: posts.length,
        posts
      };
      const fileText = JSON.stringify(payload, null, 2);
      const blob = new Blob([fileText], { type: 'application/json' });
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      const dateSlug = exportedAt.toISOString().slice(0, 10);

      downloadLink.href = downloadUrl;
      downloadLink.download = `zantix-community-${dateSlug}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(downloadUrl);

      replayAnimation(communityDownloadBtn, 'downloaded');
      if (communityDownloadStatus) {
        communityDownloadStatus.textContent = `Downloaded ${posts.length} ${posts.length === 1 ? 'post' : 'posts'}.`;
      }
    });
  }

  if (communityCompose && communityPosts) {
    const updateComposerTheme = () => {
      if (!communityTopic) return;
      const topic = communityTopic.value;
      const themeClass = 'theme-' + topic.toLowerCase().replace(/\s+/g, '-');
      // Remove other theme classes
      communityCompose.className = 'community-composer';
      communityCompose.classList.add(themeClass);
    };

    if (communityTopic) {
      communityTopic.addEventListener('change', updateComposerTheme);
      updateComposerTheme();
    }

    communityCompose.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = communityTitle.value.trim();
      const body = communityBody.value.trim();
      const topic = communityTopic.value;

      if (!title || !body) {
        if (communityComposeStatus) communityComposeStatus.textContent = 'Add a title and story before posting.';
        return;
      }

      const post = { 
        id: 'post-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        title, 
        body, 
        topic, 
        votes: 1, 
        replies: [], 
        time: 'Just now' 
      };
      const savedPosts = JSON.parse(localStorage.getItem(communityStorageKey) || '[]');
      savedPosts.push(post);
      localStorage.setItem(communityStorageKey, JSON.stringify(savedPosts));
      
      communityCompose.reset();
      updateComposerTheme();
      replayAnimation(communityCompose, 'just-posted');
      if (communityComposeStatus) communityComposeStatus.textContent = 'Posted anonymously in this browser.';
      renderPosts();
    });
  }

  document.querySelectorAll('.topic-pill').forEach(topicBtn => {
    topicBtn.addEventListener('click', function() {
      document.querySelectorAll('.topic-pill').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      renderPosts();
    });
  });

  document.querySelectorAll('.sort-chip').forEach(sortBtn => {
    sortBtn.addEventListener('click', function() {
      document.querySelectorAll('.sort-chip').forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      renderPosts();
    });
  });

  const communitySearch = document.getElementById('community-search');
  if (communitySearch) {
    communitySearch.addEventListener('input', renderPosts);
  }

  // ─── PRIVATE VENT ───
  const ventInput = document.getElementById('private-vent-input');
  const ventWordCount = document.getElementById('vent-word-count');
  const ventStatus = document.getElementById('vent-status');
  const ventSaveBtn = document.getElementById('vent-save');
  const ventClearBtn = document.getElementById('vent-clear');
  const voiceVentToggle = document.getElementById('voice-vent-toggle');
  const voiceVentLabel = document.getElementById('voice-vent-label');
  const voiceVentStatus = document.getElementById('voice-vent-status');
  const voicePlaybackWrap = document.getElementById('voice-playback-wrap');
  const voiceVentAudio = document.getElementById('voice-vent-audio');
  const voiceDeleteBtn = document.getElementById('voice-delete');
  const ventStorageKey = 'zantixPrivateVentDraft';
  const ventMoodStorageKey = 'zantixPrivateVentMood';
  const ventAudioStorageKey = 'zantixPrivateVentAudio';
  let ventRecorder = null;
  let ventAudioChunks = [];
  let ventAudioStream = null;
  let isVoiceVentRecording = false;

  const updateVentWordCount = () => {
    if (!ventInput || !ventWordCount) return;

    const words = ventInput.value.trim().split(/\s+/).filter(Boolean);
    const count = words.length;
    ventWordCount.textContent = `${count} ${count === 1 ? 'word' : 'words'}`;
    
    // Word goal calculations
    const goalPercentText = document.getElementById('goal-progress-percent');
    const goalBarFill = document.getElementById('goal-progress-bar-fill');
    if (goalPercentText && goalBarFill) {
      const goal = 100;
      const percentage = Math.min(100, Math.round((count / goal) * 100));
      goalPercentText.textContent = `${percentage}%`;
      goalBarFill.style.width = `${percentage}%`;
      
      const goalLabelSpan = document.querySelector('.goal-label');
      if (goalLabelSpan) {
        if (count >= goal) {
          goalLabelSpan.innerHTML = 'Word Goal Reached! 🌟';
          goalBarFill.style.backgroundColor = '#22c55e'; // Green celebration
        } else {
          goalLabelSpan.textContent = `Word Goal (${goal} words)`;
          goalBarFill.style.backgroundColor = 'var(--sage)';
        }
      }
    }
  };

  const setVentStatus = (message) => {
    if (ventStatus) {
      ventStatus.textContent = message;
    }
  };

  const setVoiceVentStatus = (message) => {
    if (voiceVentStatus) {
      voiceVentStatus.textContent = message;
    }
  };

  const saveVentDraft = () => {
    if (!ventInput) return;

    localStorage.setItem(ventStorageKey, ventInput.value);
    updateVentWordCount();
  };

  if (ventInput) {
    ventInput.value = localStorage.getItem(ventStorageKey) || '';
    updateVentWordCount();

    ventInput.addEventListener('input', () => {
      saveVentDraft();
      setVentStatus('Draft saved privately on this device.');
    });
  }

  const showVoiceRecording = (audioData) => {
    if (!voiceVentAudio || !voicePlaybackWrap || !audioData) return;

    voiceVentAudio.src = audioData;
    voicePlaybackWrap.hidden = false;
  };

  const stopVoiceStream = () => {
    if (!ventAudioStream) return;

    ventAudioStream.getTracks().forEach(track => track.stop());
    ventAudioStream = null;
  };

  const setRecordingState = (isRecording) => {
    isVoiceVentRecording = isRecording;
    if (!voiceVentToggle) return;

    voiceVentToggle.classList.toggle('listening', isRecording);
    voiceVentToggle.setAttribute('aria-pressed', String(isRecording));
    if (voiceVentLabel) {
      voiceVentLabel.textContent = isRecording ? 'Stop Recording' : 'Start Recording';
    }
  };

  const savedAudio = localStorage.getItem(ventAudioStorageKey);
  if (savedAudio) {
    showVoiceRecording(savedAudio);
    setVoiceVentStatus('Your latest voice vent is saved privately on this device.');
  }

  if (voiceVentToggle) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      voiceVentToggle.disabled = true;
      voiceVentToggle.classList.add('disabled');
      setVoiceVentStatus('Audio recording is not supported in this browser.');
    } else {
      voiceVentToggle.addEventListener('click', async () => {
        if (isVoiceVentRecording && ventRecorder) {
          ventRecorder.stop();
          return;
        }

        try {
          ventAudioChunks = [];
          ventAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          ventRecorder = new MediaRecorder(ventAudioStream);

          ventRecorder.addEventListener('dataavailable', (event) => {
            if (event.data.size > 0) {
              ventAudioChunks.push(event.data);
            }
          });

          ventRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(ventAudioChunks, { type: ventRecorder.mimeType || 'audio/webm' });
            const reader = new FileReader();

            reader.addEventListener('loadend', () => {
              const audioData = reader.result;
              try {
                localStorage.setItem(ventAudioStorageKey, audioData);
                showVoiceRecording(audioData);
                setVoiceVentStatus('Recording saved privately on this device.');
                setVentStatus('Voice recording saved.');
              } catch (error) {
                setVoiceVentStatus('Recording was too long to save locally. Try a shorter voice vent.');
                setVentStatus('Could not save the recording.');
              }
            });

            reader.readAsDataURL(audioBlob);
            stopVoiceStream();
            setRecordingState(false);
          });

          ventRecorder.start();
          setRecordingState(true);
          setVoiceVentStatus('Recording now. Speak freely, then tap Stop Recording.');
          setVentStatus('Voice recording started.');
        } catch (error) {
          stopVoiceStream();
          setRecordingState(false);
          const message = error.name === 'NotAllowedError'
            ? 'Microphone permission was blocked.'
            : 'Could not start recording. Please try again.';
          setVoiceVentStatus(message);
          setVentStatus(message);
        }
      });
    }
  }

  if (voiceDeleteBtn) {
    voiceDeleteBtn.addEventListener('click', () => {
      localStorage.removeItem(ventAudioStorageKey);
      if (voiceVentAudio) voiceVentAudio.removeAttribute('src');
      if (voicePlaybackWrap) voicePlaybackWrap.hidden = true;
      setVoiceVentStatus('Recording deleted.');
      setVentStatus('Voice recording cleared.');
    });
  }

  document.querySelectorAll('.prompt-chip').forEach(prompt => {
    prompt.addEventListener('click', function() {
      if (!ventInput) return;

      const promptText = this.textContent.trim();
      const spacer = ventInput.value.trim() ? '\n\n' : '';
      ventInput.value = `${ventInput.value}${spacer}${promptText} `;
      ventInput.focus();
      saveVentDraft();
      setVentStatus('Prompt added. Keep going at your pace.');
    });
  });

  document.querySelectorAll('.vent-mood').forEach(btn => {
    const savedMood = localStorage.getItem(ventMoodStorageKey);
    if (savedMood && btn.textContent.trim() === savedMood) {
      document.querySelectorAll('.vent-mood').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    btn.addEventListener('click', function() {
      document.querySelectorAll('.vent-mood').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      localStorage.setItem(ventMoodStorageKey, this.textContent.trim());
      setVentStatus(`Marked as ${this.textContent.trim().toLowerCase()}.`);
    });
  });

  if (ventSaveBtn && ventInput) {
    ventSaveBtn.addEventListener('click', () => {
      saveVentDraft();
      setVentStatus('Saved. This draft stays private on your device.');
    });
  }

  if (ventClearBtn && ventInput) {
    ventClearBtn.addEventListener('click', () => {
      ventInput.value = '';
      localStorage.removeItem(ventStorageKey);
      localStorage.removeItem(ventAudioStorageKey);
      if (voiceVentAudio) voiceVentAudio.removeAttribute('src');
      if (voicePlaybackWrap) voicePlaybackWrap.hidden = true;
      updateVentWordCount();
      setVentStatus('Cleared. A fresh page is here whenever you need it.');
      ventInput.focus();
    });
  }

  // ─── MOOD SELECTION ───
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // ─── POST REACTIONS ───
  document.querySelectorAll('.react-btn').forEach(btn => {
    if (!btn.textContent.includes('Reply')) {
      btn.addEventListener('click', function() {
        // Toggle reacted state
        const isReacted = this.classList.contains('reacted');
        const parts = this.textContent.trim().split(' ');
        const emoji = parts[0];
        let count = parseInt(parts[1]);
        
        if (isReacted) {
          this.classList.remove('reacted');
          count = Math.max(0, count - 1);
        } else {
          this.classList.add('reacted');
          count = count + 1;
        }
        
        this.innerHTML = `${emoji} <span>${count}</span>`;
      });
    }
  });

  // ─── DAILY DASHBOARD: MOOD & STREAK ───
  const moodSelectBtns = document.querySelectorAll('.mood-card-btn');
  const moodCheckinStatus = document.getElementById('mood-checkin-status');
  const moodSuggestionPanel = document.getElementById('mood-suggestions-card');
  const suggestionTitle = document.getElementById('s-title');
  const suggestionText = document.getElementById('s-desc');
  const suggestionActions = document.getElementById('s-actions');
  
  const breathingBubbleContainer = document.getElementById('breathing-bubble-container');
  const breathingCircle = document.getElementById('breathing-circle');
  const breathingText = document.getElementById('breathing-text');
  const stopBreathingBtn = document.getElementById('stop-breathing-btn');
  
  const historyGrid = document.getElementById('history-grid');
  const streakCountDisplay = document.getElementById('streak-count-display');
  const streakLevelBadge = document.getElementById('streak-level-badge');
  const streakQuote = document.getElementById('streak-quote');
  const checklistGrid = document.getElementById('checklist-grid');
  
  const MOOD_LOGS_KEY = 'zantixMoodLogs';
  const STREAK_KEY = 'zantixStreak';
  
  let breathingTimeoutId = null;
  let isBreathingActive = false;

  const loadMoodLogs = () => JSON.parse(localStorage.getItem(MOOD_LOGS_KEY) || '[]');
  const saveMoodLogs = (logs) => localStorage.setItem(MOOD_LOGS_KEY, JSON.stringify(logs));
  
  const loadStreak = () => JSON.parse(localStorage.getItem(STREAK_KEY) || JSON.stringify({
    currentStreak: 0,
    lastLogDate: '',
    history: []
  }));
  const saveStreak = (streak) => localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  
  const getTodayDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  
  const getYesterdayDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getDayOfWeekName = (dateStr) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const parts = dateStr.split('-');
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return days[d.getDay()];
  };

  const suggestionsMap = {
    Good: {
      title: "Shining bright! ☀️",
      text: "You're feeling good today! Share that positive energy with others in the anonymous community feed, or capture this moment in your private vent diary.",
      actions: [
        { label: "Share Positivity", url: "community.html" },
        { label: "Gratitude Vent", url: "private-vent.html" }
      ]
    },
    Okay: {
      title: "A calm, steady space 🌊",
      text: "Feeling okay is a solid foundation. Explore our Relax page to do some brief grounding exercises or chat with Dost if you want a casual conversation.",
      actions: [
        { label: "Go to Relax Center", url: "relax.html" },
        { label: "Chat with Dost", url: "chatbot.html" }
      ]
    },
    Anxious: {
      title: "Slow down and center 🍃",
      text: "Anxiety can feel like a racing storm. Visit our Relax center to practice guided slow breath cycles and 5-4-3-2-1 grounding to bring you back to the present moment.",
      actions: [
        { label: "Relax & Ground", url: "relax.html" },
        { label: "Talk to Dost", url: "chatbot.html" }
      ]
    },
    Low: {
      title: "Gently holding space 🌧️",
      text: "It is okay to not be okay. Remember that your feelings are valid. You can talk to Dost for warm support, or let it all out in a private vent note.",
      actions: [
        { label: "Chat with Your Dost", url: "chatbot.html" },
        { label: "Write Private Vent", url: "private-vent.html" }
      ]
    },
    Angry: {
      title: "Releasing the pressure 🌋",
      text: "Anger holds a lot of energy. A great way to release it is by writing a raw, unfiltered note in your private vent, or using our progressive muscle relaxation exercises.",
      actions: [
        { label: "Write & Shred", url: "private-vent.html" },
        { label: "Calming Exercises", url: "relax.html" }
      ]
    }
  };

  const getStreakLevel = (count) => {
    if (count >= 14) return { rank: "🧘 Zen Master", badgeId: "badge-zen" };
    if (count >= 7) return { rank: "🌸 Self-Care Hero", badgeId: "badge-hero" };
    if (count >= 3) return { rank: "🌿 Mindful", badgeId: "badge-mindful" };
    return { rank: "🌱 Beginner", badgeId: null };
  };

  const runBreathingCycle = () => {
    if (!isBreathingActive) return;
    
    // Inhale
    if (breathingCircle) breathingCircle.className = "breathing-circle inhale";
    if (breathingText) breathingText.textContent = "Breathe In";
    
    breathingTimeoutId = setTimeout(() => {
      if (!isBreathingActive) return;
      
      // Hold
      if (breathingText) breathingText.textContent = "Hold";
      
      breathingTimeoutId = setTimeout(() => {
        if (!isBreathingActive) return;
        
        // Exhale
        if (breathingCircle) breathingCircle.className = "breathing-circle exhale";
        if (breathingText) breathingText.textContent = "Breathe Out";
        
        breathingTimeoutId = setTimeout(() => {
          if (!isBreathingActive) return;
          
          // Hold
          if (breathingText) breathingText.textContent = "Hold";
          
          breathingTimeoutId = setTimeout(runBreathingCycle, 1500);
        }, 3500);
      }, 1500);
    }, 3500);
  };

  const startBreathing = () => {
    isBreathingActive = true;
    if (moodSuggestionPanel) moodSuggestionPanel.style.display = "none";
    if (breathingBubbleContainer) breathingBubbleContainer.style.display = "flex";
    runBreathingCycle();
  };

  const stopBreathing = () => {
    isBreathingActive = false;
    clearTimeout(breathingTimeoutId);
    if (breathingBubbleContainer) breathingBubbleContainer.style.display = "none";
    if (moodSuggestionPanel) moodSuggestionPanel.style.display = "block";
    if (breathingCircle) breathingCircle.className = "breathing-circle";
  };

  const updateDashboardUI = () => {
    const todayStr = getTodayDateString();
    const logs = loadMoodLogs();
    const streak = loadStreak();
    
    const todayLog = logs.find(log => log.date === todayStr);
    
    if (moodCheckinStatus) {
      if (todayLog) {
        moodCheckinStatus.textContent = "Logged today";
        moodCheckinStatus.className = "status-badge logged";
      } else {
        moodCheckinStatus.textContent = "Not logged today";
        moodCheckinStatus.className = "status-badge";
      }
    }
    
    moodSelectBtns.forEach(btn => {
      const moodVal = btn.dataset.mood;
      if (todayLog && todayLog.mood === moodVal) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    if (todayLog) {
      const suggestion = suggestionsMap[todayLog.mood];
      if (suggestion && moodSuggestionPanel) {
        if (!isBreathingActive) {
          moodSuggestionPanel.style.display = "block";
        }
        if (suggestionTitle) suggestionTitle.textContent = suggestion.title;
        if (suggestionText) suggestionText.textContent = suggestion.text;
        
        if (suggestionActions) {
          suggestionActions.innerHTML = '';
          suggestion.actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'suggest-btn';
            btn.type = 'button';
            btn.textContent = action.label;
            if (action.action === 'breathe') {
              btn.addEventListener('click', startBreathing);
            } else if (action.url) {
              btn.addEventListener('click', () => { window.location.href = action.url; });
            }
            suggestionActions.appendChild(btn);
          });
        }
      }
    } else {
      if (moodSuggestionPanel) moodSuggestionPanel.style.display = "none";
      stopBreathing();
    }
    
    if (historyGrid) {
      historyGrid.innerHTML = '';
      const moodEmojis = { Good: "😊", Okay: "😐", Anxious: "😰", Low: "😔", Angry: "😡" };
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const dayName = getDayOfWeekName(dateStr);
        const dayLog = logs.find(log => log.date === dateStr);
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'history-day';
        
        const circle = document.createElement('div');
        circle.className = 'history-circle' + (dayLog ? ' active' : '');
        circle.textContent = dayLog ? moodEmojis[dayLog.mood] : '—';
        
        const label = document.createElement('span');
        label.className = 'day-label';
        label.textContent = i === 0 ? 'Today' : dayName;
        
        dayDiv.appendChild(circle);
        dayDiv.appendChild(label);
        historyGrid.appendChild(dayDiv);
      }
    }
    
    if (streakCountDisplay) {
      streakCountDisplay.textContent = streak.currentStreak;
    }
    
    const fireIcon = document.querySelector('.fire-icon');
    if (fireIcon) {
      if (streak.currentStreak > 0) {
        fireIcon.classList.add('active');
      } else {
        fireIcon.classList.remove('active');
      }
    }
    
    const levelInfo = getStreakLevel(streak.currentStreak);
    if (streakLevelBadge) {
      streakLevelBadge.textContent = levelInfo.rank;
    }
    
    if (streakQuote) {
      if (streak.currentStreak >= 7) {
        streakQuote.textContent = '"Amazing job! Seven days of consistency. You are dedicating real time to your wellbeing. 🌸"';
      } else if (streak.currentStreak >= 3) {
        streakQuote.textContent = '"You are building a wonderful habit of mindful presence. Keep going! 🌿"';
      } else if (streak.currentStreak > 0) {
        streakQuote.textContent = '"Log daily to grow your self-care streak. Every check-in helps you understand yourself better. ⚡"';
      } else {
        streakQuote.textContent = '"The journey of self-care begins with a single check-in."';
      }
    }
    
    document.querySelectorAll('.milestone-badge-item').forEach(badge => {
      badge.classList.remove('active');
    });
    const milestones = document.querySelectorAll('.milestone-badge-item');
    if (milestones.length >= 4) {
      if (streak.currentStreak >= 0) milestones[0].classList.add('active');
      if (streak.currentStreak >= 3) milestones[1].classList.add('active');
      if (streak.currentStreak >= 7) milestones[2].classList.add('active');
      if (streak.currentStreak >= 14) milestones[3].classList.add('active');
    }
    
    if (checklistGrid) {
      checklistGrid.innerHTML = '';
      
      const curr = new Date();
      const currentDay = curr.getDay();
      const distanceToMon = currentDay === 0 ? -6 : 1 - currentDay;
      
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(curr.getDate() + distanceToMon + i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const dayName = getDayOfWeekName(dateStr);
        const isToday = dateStr === todayStr;
        const isLogged = streak.history.includes(dateStr);
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'checklist-day';
        
        const box = document.createElement('div');
        box.className = 'checklist-box';
        if (isLogged) box.classList.add('checked');
        if (isToday) box.classList.add('today');
        box.textContent = '✓';
        
        const label = document.createElement('span');
        label.className = 'day-label';
        label.textContent = dayName;
        
        dayDiv.appendChild(box);
        dayDiv.appendChild(label);
        checklistGrid.appendChild(dayDiv);
      }
    }
  };

  const handleMoodSelection = (selectedMood) => {
    const todayStr = getTodayDateString();
    const yesterdayStr = getYesterdayDateString();
    
    let logs = loadMoodLogs();
    let streak = loadStreak();
    
    const existingIndex = logs.findIndex(log => log.date === todayStr);
    
    if (existingIndex >= 0) {
      logs[existingIndex].mood = selectedMood;
    } else {
      logs.push({ date: todayStr, mood: selectedMood });
      
      if (streak.lastLogDate === yesterdayStr) {
        streak.currentStreak += 1;
      } else if (streak.lastLogDate === todayStr) {
        // already logged
      } else {
        streak.currentStreak = 1;
      }
      
      streak.lastLogDate = todayStr;
      if (!streak.history.includes(todayStr)) {
        streak.history.push(todayStr);
      }
    }
    
    saveMoodLogs(logs);
    saveStreak(streak);
    updateDashboardUI();
  };

  moodSelectBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const selectedMood = this.dataset.mood;
      handleMoodSelection(selectedMood);
    });
  });

  if (stopBreathingBtn) {
    stopBreathingBtn.addEventListener('click', stopBreathing);
  }

  if (historyGrid || checklistGrid) {
    updateDashboardUI();
  }

  // ─── SCROLL REVEAL (INTERSECTION OBSERVER) ───
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
});
