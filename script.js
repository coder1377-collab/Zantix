document.addEventListener('DOMContentLoaded', () => {
  // ─── USER ID GENERATION ───
  let zantixUserId = localStorage.getItem('zantix_user_id');
  if (!zantixUserId) {
    zantixUserId = 'user-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
    localStorage.setItem('zantix_user_id', zantixUserId);
  }

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

    const topicClass = escapeHtml(post.topic).toLowerCase().replace(/[^a-z0-9]/g, '-');
    const topicEmojis = {
      'exam stress': '⚡',
      'loneliness': '🌌',
      'family': '❤️',
      'career': '🧭',
      'general': '🌱'
    };
    const topicEmoji = topicEmojis[post.topic.toLowerCase()] || '✨';
    const hugCount = post.hugs || (Math.floor(post.votes * 0.4) + 12);

    card.innerHTML = `
      <div class="vote-rail" data-vote="0">
        <button class="vote-btn upvote" type="button" aria-label="Upvote" title="Upvote">▲</button>
        <span class="vote-count">${post.votes}</span>
        <button class="vote-btn downvote" type="button" aria-label="Downvote" title="Downvote">▼</button>
      </div>
      <div class="discussion-content">
        <div class="discussion-meta reddit-post-meta">
          <span class="reddit-sub-tag">r/ZantixSanctuary</span>
          <span class="disc-author-chip">• Posted by <strong style="color:var(--heading-color);">Anonymous Student</strong></span>
          <span class="disc-time">${escapeHtml(post.time)}</span>
          <span class="topic-tag tag-${topicClass}" style="margin-left:auto;">${topicEmoji} ${escapeHtml(post.topic)}</span>
        </div>
        <h2 class="disc-title">${escapeHtml(post.title)}</h2>
        <p class="disc-body">${escapeHtml(post.body)}</p>
        <div class="discussion-actions">
          <button class="discussion-action reply-trigger" type="button">
            <span>💬 Comments</span> <span class="reply-c-num">${post.replies.length}</span>
          </button>
          <button class="discussion-action support-btn" type="button">
            <span>💚 Virtual Hug</span> <span class="hug-c-num">${hugCount}</span>
          </button>
          <button class="discussion-action save-btn" type="button">🔖 Save</button>
          <button class="discussion-action share-btn" type="button" onclick="alert('Anonymous share link copied to clipboard! ✨')">↗ Share</button>
        </div>
        
        <div class="replies-panel" style="display: none;">
          <div class="replies-list">
            ${repliesHtml}
          </div>
          <form class="reply-composer">
            <input class="reply-input" placeholder="Write a supportive reply anonymously..." required></input>
            <button class="reply-submit-btn" type="submit">Send Reply ✨</button>
          </form>
        </div>
      </div>
    `;

    const voteRail = card.querySelector('.vote-rail');
    const voteCountSpan = card.querySelector('.vote-count');
    const upvoteBtn = card.querySelector('.upvote');
    const downvoteBtn = card.querySelector('.downvote');
    
    const updatePostVotes = async (newVoteValue) => {
      try {
        if (newVoteValue === 1) await fetch(`/api/community/posts/${post._id || post.id}/upvote`, { method: 'POST' });
      } catch (e) { console.error(e); }
      const currentVotes = (post.upvotes !== undefined ? post.upvotes : post.votes) || 0;
      const newTotal = currentVotes + newVoteValue;
      voteCountSpan.textContent = newTotal;
      card.dataset.votes = newTotal;
      replayAnimation(voteCountSpan, 'vote-pop');
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
    const hugNumSpan = supportBtn ? supportBtn.querySelector('.hug-c-num') : null;
    supportBtn.addEventListener('click', () => {
      const isNowActive = supportBtn.classList.toggle('active');
      if (hugNumSpan) {
        let currentHugs = parseInt(hugNumSpan.textContent || '0');
        hugNumSpan.textContent = isNowActive ? currentHugs + 1 : Math.max(0, currentHugs - 1);
      }
      if (isNowActive) {
        const floatHug = document.createElement('span');
        floatHug.className = 'floating-hug-particle';
        floatHug.textContent = '+1 Hug 💚';
        supportBtn.appendChild(floatHug);
        setTimeout(() => floatHug.remove(), 1200);
      }
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

    replyComposer.addEventListener('submit', async (e) => {
      e.preventDefault();
      const replyText = replyInput.value.trim();
      if (!replyText) return;

      const newReply = { body: replyText, time: 'Just now', authorAvatar: 'A' };

      try {
        await fetch(`/api/community/posts/${post._id || post.id}/reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReply)
        });
      } catch (err) { console.error(err); }
      
      const replyItemDiv = document.createElement('div');
      replyItemDiv.className = 'reply-item';
      replyItemDiv.innerHTML = `
        <div class="reply-meta">Anonymous · Just now</div>
        <div class="reply-body">${escapeHtml(newReply.body)}</div>
      `;
      repliesList.appendChild(replyItemDiv);
      
      replyInput.value = '';
      repliesList.scrollTop = repliesList.scrollHeight;
      
      if (!post.replies) post.replies = [];
      post.replies.push(newReply);
      replyCountNum.textContent = post.replies.length;
      card.dataset.repliesCount = post.replies.length;
    });

    return card;
  };

  const renderPosts = async () => {
    if (!communityPosts) return;
    
    let posts = [];
    try {
      const res = await fetch('/api/community/posts');
      if (res.ok) posts = await res.json();
      else posts = JSON.parse(localStorage.getItem(communityStorageKey) || '[]');
    } catch (e) {
      posts = JSON.parse(localStorage.getItem(communityStorageKey) || '[]');
    }
    
    communityPosts.innerHTML = '';
    
    const activeTopicBtn = document.querySelector('.topic-pill.active');
    const activeTopic = activeTopicBtn ? (activeTopicBtn.dataset.topic || activeTopicBtn.textContent.trim()) : 'All';
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
    const activeSort = activeSortBtn ? (activeSortBtn.dataset.sort || activeSortBtn.textContent.trim()) : 'Top';
    
    const getVotes = p => (p.upvotes !== undefined ? p.upvotes : p.votes) || 0;
    
    if (activeSort === 'Top') {
      filtered.sort((a, b) => getVotes(b) - getVotes(a));
    } else if (activeSort === 'New') {
      // Assuming API returns newest first or we just reverse
      filtered.reverse();
    } else if (activeSort === 'Unanswered') {
      filtered = filtered.filter(post => !post.replies || post.replies.length === 0);
      filtered.sort((a, b) => getVotes(b) - getVotes(a));
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
        if (post.votes === undefined && post.upvotes !== undefined) post.votes = post.upvotes;
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

    communityCompose.addEventListener('submit', async (event) => {
      event.preventDefault();
      const title = communityTitle.value.trim();
      const body = communityBody.value.trim();
      const topic = communityTopic.value;

      if (!title || !body) {
        if (communityComposeStatus) communityComposeStatus.textContent = 'Add a title and story before posting.';
        return;
      }

      const post = { title, body, topic, authorAvatar: 'A' };
      
      try {
        await fetch('/api/community/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post)
        });
      } catch (e) { console.error(e); }
      
      communityCompose.reset();
      updateComposerTheme();
      replayAnimation(communityCompose, 'just-posted');
      if (communityComposeStatus) communityComposeStatus.textContent = 'Posted anonymously to the community.';
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

  const IDB_NAME = 'ZantixDB';
  const IDB_VERSION = 1;
  const IDB_STORE = 'private_vents';

  const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
    });
  };

  const saveVentAudioToDB = async (blob) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const request = store.put(blob, 'latest_audio');
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
    });
  };

  const loadVentAudioFromDB = async () => {
    try {
      const db = await initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const request = store.get('latest_audio');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (e) { return null; }
  };

  const deleteVentAudioFromDB = async () => {
    try {
      const db = await initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        const request = store.delete('latest_audio');
        request.onsuccess = resolve;
        request.onerror = () => reject(request.error);
      });
    } catch (e) {}
  };

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

  loadVentAudioFromDB().then((blob) => {
    if (blob) {
      const audioUrl = URL.createObjectURL(blob);
      showVoiceRecording(audioUrl);
      setVoiceVentStatus('Your latest voice vent is saved privately on this device.');
    }
  });

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
            
            saveVentAudioToDB(audioBlob).then(() => {
              const audioUrl = URL.createObjectURL(audioBlob);
              showVoiceRecording(audioUrl);
              setVoiceVentStatus('Recording saved privately in database (low memory mode).');
              setVentStatus('Voice recording saved.');
            }).catch(() => {
              setVoiceVentStatus('Could not save the recording.');
              setVentStatus('Could not save the recording.');
            });

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
      deleteVentAudioFromDB();
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
      deleteVentAudioFromDB();
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
        
        this.textContent = `${emoji} ${count}`;
      });
    }
  });

  // ─── DAILY DASHBOARD: MOOD & STREAK ───
  const moodSelectBtns = document.querySelectorAll('.mood-card-btn, .mood-chip');
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

  const syncMoodLogs = async () => {
    try {
      const res = await fetch('/api/mood', { headers: { 'X-User-Id': zantixUserId } });
      if (res.ok) {
        const logs = await res.json();
        if (logs && logs.length > 0) {
           localStorage.setItem(MOOD_LOGS_KEY, JSON.stringify(logs));
        }
      }
    } catch(e) {}
  };
  syncMoodLogs();

  const loadMoodLogs = () => JSON.parse(localStorage.getItem(MOOD_LOGS_KEY) || '[]');
  const saveMoodLogs = (logs) => {
    localStorage.setItem(MOOD_LOGS_KEY, JSON.stringify(logs));
    fetch('/api/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-User-Id': zantixUserId },
      body: JSON.stringify(logs)
    }).catch(e => console.error('Failed to sync mood logs', e));
  };
  
  // ─── EXTENDED GAMIFIED STREAK STATE ───
  const loadStreak = () => {
    let s = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}');
    // Ensure all gamification elements exist
    if (s.currentStreak === undefined) s.currentStreak = 0;
    if (s.lastLogDate === undefined) s.lastLogDate = '';
    if (s.history === undefined) s.history = [];
    if (s.maxStreak === undefined) s.maxStreak = s.currentStreak;
    
    if (s.zanCoins === undefined) s.zanCoins = 0;
    if (s.zanXP === undefined) s.zanXP = 0;
    if (s.streakFreezeCount === undefined) s.streakFreezeCount = 0;
    if (s.purchasedSkins === undefined) s.purchasedSkins = ['default'];
    if (s.activeSkin === undefined) s.activeSkin = 'default';
    if (s.completedQuests === undefined) s.completedQuests = [];
    if (s.questResetDate === undefined) s.questResetDate = '';
    return s;
  };

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

  // Level calculator: 50 XP per level
  const getLevelInfo = (xp) => {
    const level = Math.floor(xp / 50) + 1;
    const xpInLevel = xp % 50;
    const reqXP = 50;
    
    let rank = '🌱 Novice';
    if (level >= 15) rank = '🌌 Cosmic Ascendant';
    else if (level >= 10) rank = '🧘 Zen Initiate';
    else if (level >= 6) rank = '⚡ Focus Adept';
    else if (level >= 3) rank = '🌿 Mind Practitioner';

    return { level, rank, xpInLevel, reqXP };
  };

  // Synthesize retro sounds using Web Audio API
  const playRewardSound = (type = 'success') => {
    const isSoundOn = localStorage.getItem('zantixSoundFX') !== 'off';
    if (!isSoundOn) return;

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'purchase') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880.00, now); // A5
        osc.frequency.setValueAtTime(1318.51, now + 0.06); // E6
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.setValueAtTime(150, now + 0.1);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      console.warn("AudioContext not supported or blocked: ", e);
    }
  };

  // Suggestions Map for mood selector panel
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

  const CHECKIN_QUESTIONS = [
    {
      id: 'water',
      emoji: '💧',
      question: 'How much water did you drink today?',
      options: [
        { value: '0-2', label: '0–2 glasses' },
        { value: '3-5', label: '3–5 glasses' },
        { value: '6-8', label: '6–8 glasses' },
        { value: '8+', label: '8+ glasses' }
      ]
    },
    {
      id: 'angryTwice',
      emoji: '😤',
      question: 'Did you get angry more than twice today?',
      options: [
        { value: 'no', label: 'No' },
        { value: 'once', label: 'Once or twice' },
        { value: 'yes', label: 'Yes, more than twice' }
      ]
    },
    {
      id: 'sleep',
      emoji: '😴',
      question: 'How many hours did you sleep last night?',
      options: [
        { value: '<5', label: 'Less than 5 hours' },
        { value: '5-6', label: '5–6 hours' },
        { value: '7-8', label: '7–8 hours' },
        { value: '9+', label: '9+ hours' }
      ]
    },
    {
      id: 'exercise',
      emoji: '🏃',
      question: 'Did you move your body today?',
      options: [
        { value: 'none', label: 'Not at all' },
        { value: 'light', label: 'Light activity (walk, stretch)' },
        { value: 'moderate', label: 'Moderate workout' },
        { value: 'intense', label: 'Intense exercise' }
      ]
    },
    {
      id: 'meals',
      emoji: '🍽️',
      question: 'Did you eat at least 2 proper meals?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'partially', label: 'Partially' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      id: 'screenTime',
      emoji: '📱',
      question: 'How much non-work screen time did you have today?',
      options: [
        { value: '<1h', label: 'Under 1 hour' },
        { value: '1-3h', label: '1–3 hours' },
        { value: '3-5h', label: '3–5 hours' },
        { value: '5h+', label: '5+ hours' }
      ]
    },
    {
      id: 'social',
      emoji: '💬',
      question: 'Did you talk to someone you trust today?',
      options: [
        { value: 'yes', label: 'Yes, meaningfully' },
        { value: 'briefly', label: 'Briefly' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      id: 'outdoors',
      emoji: '🌤️',
      question: 'Did you spend time outdoors today?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      id: 'anxiousDay',
      emoji: '😰',
      question: 'Did you feel anxious or worried for most of the day?',
      options: [
        { value: 'not', label: 'Not really' },
        { value: 'sometimes', label: 'Sometimes' },
        { value: 'often', label: 'Often' },
        { value: 'all-day', label: 'Most of the day' }
      ]
    }
  ];

  const computeWellnessScore = (checkin) => {
    if (!checkin) return null;
    let score = 50;

    const waterScores = { '0-2': -8, '3-5': 4, '6-8': 10, '8+': 12 };
    score += waterScores[checkin.water] || 0;

    if (checkin.angryTwice === 'no') score += 10;
    else if (checkin.angryTwice === 'once') score += 2;
    else score -= 12;

    const sleepScores = { '<5': -12, '5-6': -4, '7-8': 12, '9+': 8 };
    score += sleepScores[checkin.sleep] || 0;

    const exerciseScores = { none: -6, light: 6, moderate: 10, intense: 8 };
    score += exerciseScores[checkin.exercise] || 0;

    if (checkin.meals === 'yes') score += 8;
    else if (checkin.meals === 'partially') score += 2;
    else score -= 6;

    const screenScores = { '<1h': 6, '1-3h': 0, '3-5h': -6, '5h+': -10 };
    score += screenScores[checkin.screenTime] || 0;

    if (checkin.social === 'yes') score += 8;
    else if (checkin.social === 'briefly') score += 3;
    else score -= 4;

    if (checkin.outdoors === 'yes') score += 6;
    else score -= 2;

    const anxiousScores = { not: 8, sometimes: -2, often: -8, 'all-day': -14 };
    score += anxiousScores[checkin.anxiousDay] || 0;

    return Math.min(100, Math.max(0, score));
  };

  const getWellnessInsights = (checkin, score) => {
    const factors = [];
    if (!checkin) return { summary: '', factors: [] };

    if (checkin.water === '0-2' || checkin.water === '3-5') {
      factors.push('Low water intake — dehydration can affect mood and energy.');
    }
    if (checkin.angryTwice === 'yes') {
      factors.push('High anger frequency today — consider a calming exercise or private vent.');
    }
    if (checkin.sleep === '<5' || checkin.sleep === '5-6') {
      factors.push('Short sleep — rest is strongly linked to emotional balance.');
    }
    if (checkin.exercise === 'none') {
      factors.push('No movement today — even a short walk can lift mood.');
    }
    if (checkin.meals === 'no' || checkin.meals === 'partially') {
      factors.push('Irregular eating — steady meals help stabilize energy.');
    }
    if (checkin.screenTime === '3-5h' || checkin.screenTime === '5h+') {
      factors.push('High screen time — a digital break may help you reset.');
    }
    if (checkin.social === 'no') {
      factors.push('Limited social connection — reaching out to someone you trust can help.');
    }
    if (checkin.outdoors === 'no') {
      factors.push('No time outdoors — fresh air and sunlight support wellbeing.');
    }
    if (checkin.anxiousDay === 'often' || checkin.anxiousDay === 'all-day') {
      factors.push('Elevated anxiety today — grounding or breathing exercises may help.');
    }

    let summary;
    if (score >= 75) {
      summary = 'Your daily habits look supportive today. Keep nurturing what\'s working.';
    } else if (score >= 55) {
      summary = 'A mixed day — a few small shifts could boost how you feel tomorrow.';
    } else {
      summary = 'Several factors may be weighing on you today. Be gentle with yourself.';
    }

    if (factors.length === 0) {
      factors.push('Solid basics today — hydration, rest, and movement are in a good place.');
    }

    return { summary, factors };
  };

  const moodOrbEmojis = { Good: '😊', Okay: '😐', Anxious: '😰', Low: '😔', Angry: '😡' };

  const updateOrbTheme = (mood) => {
    const orbEmoji = document.getElementById('orb-emoji');
    const orbInstruction = document.getElementById('orb-instruction-text');
    const body = document.body;

    if (!body.classList.contains('mood-page-theme')) return;

    ['Good', 'Okay', 'Anxious', 'Low', 'Angry'].forEach(m => {
      body.classList.remove('theme-' + m);
    });

    if (mood) {
      body.classList.add('theme-' + mood);
      if (orbEmoji) orbEmoji.textContent = moodOrbEmojis[mood] || '🌿';
      if (orbInstruction) orbInstruction.textContent = `Synced — you're feeling ${mood.toLowerCase()} today`;
    } else {
      if (orbEmoji) orbEmoji.textContent = '🌿';
      if (orbInstruction) orbInstruction.textContent = 'Complete your check-in to sync the Orb';
    }
  };

  const updateOrbProgress = (step, totalSteps, onMoodStep = false) => {
    const ringFill = document.getElementById('orb-ring-fill');
    const stepCounter = document.getElementById('orb-step-counter');
    const circumference = 2 * Math.PI * 128;
    let progress = 0;

    if (onMoodStep) {
      progress = 1;
    } else if (totalSteps > 0) {
      progress = step / (totalSteps + 1);
    }

    if (ringFill) {
      ringFill.style.strokeDasharray = `${circumference}`;
      ringFill.style.strokeDashoffset = `${circumference * (1 - progress)}`;
    }
    if (stepCounter) {
      if (onMoodStep) {
        stepCounter.textContent = 'Final step — pick your mood';
      } else if (step === 0) {
        stepCounter.textContent = 'Step 0 of 10';
      } else {
        stepCounter.textContent = `Step ${step} of 10`;
      }
    }
  };

  const updateMoodStatusPill = (todayLog) => {
    const statusPill = document.getElementById('mood-status-pill');
    if (!statusPill) return;

    if (todayLog && todayLog.checkin) {
      statusPill.textContent = 'Checked in today ✓';
      statusPill.className = 'mood-status-pill is-complete';
    } else if (todayLog) {
      statusPill.textContent = 'Mood logged — finish check-in';
      statusPill.className = 'mood-status-pill is-partial';
    } else {
      statusPill.textContent = 'Not checked in';
      statusPill.className = 'mood-status-pill';
    }
  };

  const initMoodDatePill = () => {
    const datePill = document.getElementById('mood-date-pill');
    if (!datePill) return;
    const now = new Date();
    datePill.textContent = now.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStreakLevel = (count) => {
    if (count >= 14) return { rank: "🧘 Zen Master", badgeId: "badge-zen" };
    if (count >= 7) return { rank: "🌸 Self-Care Hero", badgeId: "badge-hero" };
    if (count >= 3) return { rank: "🌿 Mindful", badgeId: "badge-mindful" };
    return { rank: "🌱 Beginner", badgeId: null };
  };

  // Breathing simulation on Mood Tracker page
  const runBreathingCycle = () => {
    if (!isBreathingActive) return;
    if (breathingCircle) breathingCircle.className = "breathing-circle inhale";
    if (breathingText) breathingText.textContent = "Breathe In";
    
    breathingTimeoutId = setTimeout(() => {
      if (!isBreathingActive) return;
      if (breathingText) breathingText.textContent = "Hold";
      
      breathingTimeoutId = setTimeout(() => {
        if (!isBreathingActive) return;
        if (breathingCircle) breathingCircle.className = "breathing-circle exhale";
        if (breathingText) breathingText.textContent = "Breathe Out";
        
        breathingTimeoutId = setTimeout(() => {
          if (!isBreathingActive) return;
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

  // ─── BASIC DASHBOARD / MOOD LOGGING PAGE UI ───
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
        circle.className = 'history-circle' + (dayLog ? ' active mood-' + (dayLog.mood || '').toLowerCase() : '');
        circle.textContent = dayLog ? moodEmojis[dayLog.mood] : '·';
        
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
    
    const levelInfo = getLevelInfo(streak.zanXP);
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

    if (todayLog && todayLog.mood) {
      updateOrbTheme(todayLog.mood);
    }

    updateMoodStatusPill(todayLog);
    
    const milestones = document.querySelectorAll('.milestone-badge-item');
    if (milestones.length >= 4) {
      milestones.forEach(m => m.classList.remove('active'));
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

  // ─── HIGH TECH STREAK DASHBOARD ENGINE ───
  const updateAdvancedStreakDashboard = () => {
    const todayStr = getTodayDateString();
    const logs = loadMoodLogs();
    const streak = loadStreak();
    const levelInfo = getLevelInfo(streak.zanXP);

    // Apply Active Skin to body
    document.body.className = 'streak-page-theme advanced-streak-mode theme-' + streak.activeSkin;

    // 1. Core Reactor Panel updates
    const countEl = document.getElementById('reactor-streak-count');
    if (countEl) countEl.textContent = streak.currentStreak;

    const rankEl = document.getElementById('reactor-rank-title');
    if (rankEl) rankEl.textContent = levelInfo.rank;

    const quoteEl = document.getElementById('reactor-quote-msg');
    if (quoteEl) {
      if (streak.currentStreak >= 14) {
        quoteEl.textContent = '"You are a true master of self-care. Your reactor burns at maximum cosmic density! 🧘"';
      } else if (streak.currentStreak >= 7) {
        quoteEl.textContent = '"A solar flare burn! Your dedication is inspiring. Keep glowing! 🌸"';
      } else if (streak.currentStreak >= 3) {
        quoteEl.textContent = '"A healthy bio-glow is starting to develop. Consistency builds strong mental health. 🌿"';
      } else if (streak.currentStreak > 0) {
        quoteEl.textContent = '"Core activated. Check in daily to grow your wellness shield. ⚡"';
      } else {
        quoteEl.textContent = '"Log your daily mood to power up the Quantum wellness core."';
      }
    }

    const xpLabel = document.getElementById('level-display-label');
    if (xpLabel) xpLabel.textContent = `Level ${levelInfo.level} Rank`;

    const xpRatio = document.getElementById('xp-progress-ratio');
    if (xpRatio) xpRatio.textContent = `${levelInfo.xpInLevel} / ${levelInfo.reqXP} XP`;

    const xpFill = document.getElementById('xp-progress-fill');
    if (xpFill) {
      const pct = Math.min(100, Math.round((levelInfo.xpInLevel / levelInfo.reqXP) * 100));
      xpFill.style.width = `${pct}%`;
    }

    // Balances
    const coinsVal = document.getElementById('currency-zancoins-val');
    if (coinsVal) coinsVal.textContent = streak.zanCoins;

    const freezesVal = document.getElementById('currency-freezes-val');
    if (freezesVal) freezesVal.textContent = streak.streakFreezeCount;

    // 2. Metric Analytics
    const consistencyVal = document.getElementById('stat-consistency-val');
    if (consistencyVal) {
      // Calculate consistency rate of last 30 days
      let loggedCount = 0;
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (logs.some(l => l.date === dateStr)) loggedCount++;
      }
      const pct = Math.round((loggedCount / 30) * 100);
      consistencyVal.textContent = `${pct}%`;
    }

    const maxStreakVal = document.getElementById('stat-max-streak-val');
    if (maxStreakVal) {
      if (streak.currentStreak > streak.maxStreak) {
        streak.maxStreak = streak.currentStreak;
        saveStreak(streak);
      }
      maxStreakVal.textContent = streak.maxStreak;
    }

    const totalLogsVal = document.getElementById('stat-total-logs-val');
    if (totalLogsVal) totalLogsVal.textContent = logs.length;

    // 3. Heatmap contribution grid population
    const heatmapGrid = document.getElementById('heatmap-grid-weeks');
    const heatmapMonths = document.getElementById('heatmap-months-row');
    if (heatmapGrid) {
      heatmapGrid.innerHTML = '';
      
      const dayOfWeek = new Date().getDay();
      const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const currentMonday = new Date();
      currentMonday.setDate(currentMonday.getDate() + distanceToMon);
      
      const startGridDate = new Date(currentMonday);
      startGridDate.setDate(currentMonday.getDate() - 11 * 7); // Start 11 weeks ago Monday
      
      // Render 84 blocks
      const moodClasses = { Good: 'logged-good', Okay: 'logged-okay', Anxious: 'logged-anxious', Low: 'logged-low', Angry: 'logged-angry' };
      
      for (let dayOffset = 0; dayOffset < 84; dayOffset++) {
        const d = new Date(startGridDate);
        d.setDate(startGridDate.getDate() + dayOffset);
        
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const log = logs.find(l => l.date === dateStr);
        
        const square = document.createElement('div');
        square.className = 'heatmap-day-square';
        if (log) {
          square.classList.add(moodClasses[log.mood] || 'logged-okay');
        }
        
        // Tooltip bindings
        const dateLabel = d.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
        const moodText = log ? `Mood: ${log.mood}` : 'No check-in';
        let tooltipText = `${dateLabel} (${moodText})`;
        if (log && log.checkin && log.wellnessScore != null) {
          tooltipText += ` · Wellness: ${log.wellnessScore}/100`;
        }
        
        square.addEventListener('mouseenter', (e) => {
          const tooltip = document.getElementById('heatmap-tooltip');
          if (!tooltip) return;
          tooltip.textContent = tooltipText;
          tooltip.style.display = 'block';
          
          const rect = square.getBoundingClientRect();
          const parentRect = square.offsetParent.getBoundingClientRect();
          tooltip.style.left = `${rect.left - parentRect.left + rect.width / 2}px`;
          tooltip.style.top = `${rect.top - parentRect.top - 8}px`;
        });
        
        square.addEventListener('mouseleave', () => {
          const tooltip = document.getElementById('heatmap-tooltip');
          if (tooltip) tooltip.style.display = 'none';
        });
        
        heatmapGrid.appendChild(square);
      }
      
      // Month labels
      if (heatmapMonths) {
        heatmapMonths.innerHTML = '';
        let prevMonth = -1;
        for (let w = 0; w < 12; w++) {
          const monDate = new Date(startGridDate);
          monDate.setDate(startGridDate.getDate() + w * 7);
          const m = monDate.getMonth();
          const mName = monDate.toLocaleString('default', { month: 'short' });
          
          const labelSpan = document.createElement('span');
          if (m !== prevMonth) {
            labelSpan.textContent = mName;
            prevMonth = m;
          } else {
            labelSpan.textContent = '';
          }
          heatmapMonths.appendChild(labelSpan);
        }
      }
    }

    // 4. Quest list populator
    const questsList = document.getElementById('quests-list');
    if (questsList) {
      questsList.innerHTML = '';
      
      // Compute quest statuses
      const loggedToday = logs.some(l => l.date === todayStr);
      const breathedToday = localStorage.getItem('zantixBreathedToday') === todayStr;
      
      const ventDraft = localStorage.getItem('zantixPrivateVentDraft') || '';
      const ventWords = ventDraft.trim().split(/\s+/).filter(Boolean).length;
      const ventedToday = ventWords >= 50;

      const quests = [
        {
          id: 'quest-mood',
          title: 'Synchronize Wellness Protocol',
          desc: 'Log your current emotional vibe in the Mood Tracker today.',
          progress: loggedToday ? '1/1' : '0/1',
          percent: loggedToday ? 100 : 0,
          completed: loggedToday,
          claimed: streak.completedQuests.includes('quest-mood'),
          xp: 15, coins: 10,
          actionLabel: 'Go Log Mood',
          actionFn: () => { window.location.href = 'mood-tracker.html'; }
        },
        {
          id: 'quest-breathe',
          title: 'Breath of Serenity Cycle',
          desc: 'Complete a brief deep breathing grounding cycle to calm your cortex.',
          progress: breathedToday ? '1/1' : '0/1',
          percent: breathedToday ? 100 : 0,
          completed: breathedToday,
          claimed: streak.completedQuests.includes('quest-breathe'),
          xp: 20, coins: 15,
          actionLabel: 'Breathe Now',
          actionFn: () => { startPageBreathingSession(); }
        },
        {
          id: 'quest-vent',
          title: 'Deep Core Decompression',
          desc: 'Write down a mental vent note inside the private drawer (>50 words).',
          progress: `${Math.min(50, ventWords)}/50 words`,
          percent: Math.min(100, Math.round((ventWords / 50) * 100)),
          completed: ventedToday,
          claimed: streak.completedQuests.includes('quest-vent'),
          xp: 30, coins: 20,
          actionLabel: 'Write Vent',
          actionFn: () => { window.location.href = 'private-vent.html'; }
        },
        {
          id: 'quest-streak-3',
          title: 'Thermal Core Charge',
          desc: 'Keep the streak reactor active by maintaining a 3+ day wellness streak.',
          progress: `${Math.min(3, streak.currentStreak)}/3 days`,
          percent: Math.min(100, Math.round((streak.currentStreak / 3) * 100)),
          completed: streak.currentStreak >= 3,
          claimed: streak.completedQuests.includes('quest-streak-3'),
          xp: 50, coins: 30,
          actionLabel: 'Grow Streak',
          actionFn: () => { alert("Check in daily to build your streak!"); }
        }
      ];

      quests.forEach(q => {
        const row = document.createElement('div');
        row.className = `quest-item-row${q.claimed ? ' completed' : ''}`;
        
        let bountyHTML = '';
        if (q.claimed) {
          bountyHTML = `<span style="color: #22c55e; font-weight: 700; font-size: var(--fs-xs);">Claimed ✔</span>`;
        } else if (q.completed) {
          bountyHTML = `
            <button class="shop-buy-btn equip-btn" style="padding: 4px 10px;" data-claim-id="${q.id}">
              Claim Bounty
            </button>`;
        } else {
          bountyHTML = `
            <button class="shop-buy-btn" style="padding: 4px 10px;" id="act-${q.id}">
              ${q.actionLabel}
            </button>`;
        }

        row.innerHTML = `
          <div class="quest-checkbox-circle">✓</div>
          <div class="quest-details">
            <h5>${q.title}</h5>
            <p>${q.desc}</p>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="quest-xp-progress">
                <div class="quest-xp-progress-fill" style="width: ${q.percent}%;"></div>
              </div>
              <span style="font-size: 0.65rem; color: var(--soft); font-weight: 700;">${q.progress}</span>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
            <div class="quest-rewards-badge">
              <span class="xp">+${q.xp} XP</span>
              <span class="coin">+${q.coins} Coins</span>
            </div>
            ${bountyHTML}
          </div>
        `;

        questsList.appendChild(row);

        // Bind claim
        if (q.completed && !q.claimed) {
          const btn = row.querySelector(`[data-claim-id="${q.id}"]`);
          if (btn) {
            btn.addEventListener('click', () => {
              streak.completedQuests.push(q.id);
              streak.zanCoins += q.coins;
              streak.zanXP += q.xp;
              saveStreak(streak);
              playRewardSound('success');
              updateAdvancedStreakDashboard();
            });
          }
        } else if (!q.completed) {
          const actBtn = row.querySelector(`#act-${q.id}`);
          if (actBtn) {
            actBtn.addEventListener('click', q.actionFn);
          }
        }
      });
    }

    // 5. Streak Shop render
    const shopGrid = document.getElementById('shop-items-grid');
    if (shopGrid) {
      shopGrid.innerHTML = '';
      
      const shopItems = [
        {
          id: 'item-freeze',
          title: 'Quantum Streak Shield',
          art: '❄️',
          desc: 'Shields your active streak for 1 missed day. Consumed automatically.',
          price: 50,
          isSkin: false
        },
        {
          id: 'skin-cyber',
          title: 'Cyber Neon Aura',
          art: '🩵',
          desc: 'Transmute reactor core colors into glowing electric grid waves.',
          price: 100,
          isSkin: true,
          skinKey: 'cyber'
        },
        {
          id: 'skin-void',
          title: 'Cosmic Void Aura',
          art: '💜',
          desc: 'Infuse your visual core with deep space purple nebula fields.',
          price: 150,
          isSkin: true,
          skinKey: 'void'
        },
        {
          id: 'skin-gold',
          title: 'Golden Eclipse Aura',
          art: '💛',
          desc: 'Ignite a solar flare amber ring system surrounding the core.',
          price: 120,
          isSkin: true,
          skinKey: 'gold'
        }
      ];

      shopItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'shop-item-card';
        if (item.isSkin && streak.purchasedSkins.includes(item.skinKey)) {
          card.classList.add('unlocked-skin');
        }

        let buttonHTML = '';
        if (item.isSkin) {
          const owned = streak.purchasedSkins.includes(item.skinKey);
          if (owned) {
            const active = streak.activeSkin === item.skinKey;
            if (active) {
              buttonHTML = `<button class="shop-buy-btn equipped" disabled>Equipped</button>`;
            } else {
              buttonHTML = `<button class="shop-buy-btn equip-btn" data-equip-skin="${item.skinKey}">Equip Skin</button>`;
            }
          } else {
            buttonHTML = `
              <button class="shop-buy-btn" data-buy-id="${item.id}">
                🪙 ${item.price} Coins
              </button>`;
          }
        } else {
          // Streak freeze shield
          buttonHTML = `
            <button class="shop-buy-btn" data-buy-id="${item.id}">
              🪙 ${item.price} Coins
            </button>`;
        }

        card.innerHTML = `
          <div class="item-art">${item.art}</div>
          <h5>${item.title}</h5>
          <p>${item.desc}</p>
          ${buttonHTML}
        `;

        shopGrid.appendChild(card);

        // Bind Buy/Equip
        const buyBtn = card.querySelector(`[data-buy-id="${item.id}"]`);
        if (buyBtn) {
          buyBtn.addEventListener('click', () => {
            if (streak.zanCoins >= item.price) {
              streak.zanCoins -= item.price;
              if (item.isSkin) {
                streak.purchasedSkins.push(item.skinKey);
                playRewardSound('purchase');
                alert(`✨ Core aura unlocked: ${item.title}! Go ahead and equip it.`);
              } else {
                streak.streakFreezeCount++;
                playRewardSound('purchase');
                alert(`❄️ Streak Shield purchased successfully! Keep consistency safe.`);
              }
              saveStreak(streak);
              updateAdvancedStreakDashboard();
            } else {
              playRewardSound('error');
              alert(`❌ Insufficient ZanCoins! Claim active quests or log mood to get more.`);
            }
          });
        }

        const equipBtn = card.querySelector(`[data-equip-skin]`);
        if (equipBtn) {
          equipBtn.addEventListener('click', () => {
            const skinKey = equipBtn.dataset.equipSkin;
            streak.activeSkin = skinKey;
            saveStreak(streak);
            playRewardSound('success');
            updateAdvancedStreakDashboard();
          });
        }

      });
    }

    // 6. Hologram Badges Populator
    const badgesGrid = document.getElementById('badges-grid');
    if (badgesGrid) {
      badgesGrid.innerHTML = '';
      
      const badgeTiers = [
        { title: 'Seedling Novice', desc: 'Achieve Level 1 wellness', icon: '🌱', levelReq: 1 },
        { title: 'Mind Practitioner', desc: 'Achieve Level 3 wellness', icon: '🌿', levelReq: 3 },
        { title: 'Serene Hero', desc: 'Achieve Level 7 wellness', icon: '🌸', levelReq: 7 },
        { title: 'Quantum Zen Master', desc: 'Achieve Level 12 wellness', icon: '🧘', levelReq: 12 }
      ];

      badgeTiers.forEach(tier => {
        const unlocked = levelInfo.level >= tier.levelReq;
        const card = document.createElement('div');
        card.className = `holo-badge-card ${unlocked ? 'active' : 'locked'}`;

        card.innerHTML = `
          <div class="holo-badge-icon">${unlocked ? tier.icon : '🔒'}</div>
          <h4>${tier.title}</h4>
          <p>${tier.desc}</p>
          <span class="holo-status-label ${unlocked ? 'unlocked' : 'locked'}">
            ${unlocked ? 'Unlocked' : `Level ${tier.levelReq}`}
          </span>
        `;
        badgesGrid.appendChild(card);
      });
    }
  };

  // Full screen breathing session modal generator inside the page
  const startPageBreathingSession = () => {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'breathing-modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(12px);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-family: 'Plus Jakarta Sans', sans-serif;
    `;
    
    const style = document.createElement('style');
    style.id = 'breathing-modal-styles';
    style.textContent = `
      @keyframes modalBreathe {
        0%, 100% { transform: scale(0.85); box-shadow: 0 0 30px rgba(0, 240, 255, 0.3); }
        35%, 65% { transform: scale(1.2); box-shadow: 0 0 80px rgba(0, 240, 255, 0.6); }
      }
      .modal-bubble {
        width: 160px; height: 160px;
        border-radius: 50%;
        border: 3px solid #00f0ff;
        background: rgba(0, 240, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        font-weight: 700;
        margin-bottom: 30px;
        animation: modalBreathe 10s ease-in-out infinite;
        transition: all 0.5s ease;
      }
    `;
    document.head.appendChild(style);

    overlay.innerHTML = `
      <div class="modal-bubble" id="modal-breath-bubble">Breathe In</div>
      <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 8px;">Sync Your Breath</h2>
      <p style="color: rgba(255,255,255,0.7); max-width: 400px; text-align: center; font-size: 0.9rem; line-height: 1.5; margin-bottom: 24px;" id="modal-breath-instructions">Inhale deeply as the circle expands...</p>
      <div style="font-size: var(--fs-md); font-weight: 700; color: #00f0ff;" id="modal-breath-timer">15s remaining</div>
    `;
    document.body.appendChild(overlay);

    let timeLeft = 15;
    const bubble = document.getElementById('modal-breath-bubble');
    const instructions = document.getElementById('modal-breath-instructions');
    const timerDisplay = document.getElementById('modal-breath-timer');

    const updateBreathCycle = () => {
      if (timeLeft <= 0) {
        clearInterval(interval);
        localStorage.setItem('zantixBreathedToday', getTodayDateString());
        playRewardSound('success');
        
        // Instant small XP
        const streak = loadStreak();
        streak.zanXP += 5;
        saveStreak(streak);
        
        if (bubble) bubble.textContent = '🌿 Done!';
        if (instructions) instructions.textContent = 'Mindfulness session completed successfully!';
        if (timerDisplay) timerDisplay.textContent = '+5 XP rewarded';
        
        setTimeout(() => {
          overlay.remove();
          const customStyle = document.getElementById('breathing-modal-styles');
          if (customStyle) customStyle.remove();
          updateAdvancedStreakDashboard();
        }, 1500);
        return;
      }

      timeLeft--;
      if (timerDisplay) timerDisplay.textContent = `${timeLeft}s remaining`;

      const elapsed = 15 - timeLeft;
      const cycleSec = elapsed % 10;
      if (cycleSec < 4) {
        if (bubble) bubble.textContent = 'Breathe In';
        if (instructions) instructions.textContent = 'Inhale deeply as the circle expands...';
      } else if (cycleSec < 5.5) {
        if (bubble) bubble.textContent = 'Hold';
        if (instructions) instructions.textContent = 'Keep your breath steady...';
      } else if (cycleSec < 9) {
        if (bubble) bubble.textContent = 'Breathe Out';
        if (instructions) instructions.textContent = 'Slowly exhale as the circle shrinks...';
      } else {
        if (bubble) bubble.textContent = 'Hold';
        if (instructions) instructions.textContent = 'Wait before next inhale...';
      }
    };

    const interval = setInterval(updateBreathCycle, 1000);
  };

  // ─── STREAK FREEZE / missed day detector ───
  const processStreakMissedDays = () => {
    const todayStr = getTodayDateString();
    const yesterdayStr = getYesterdayDateString();
    let streak = loadStreak();

    // Check if daily quests should reset
    if (streak.questResetDate !== todayStr) {
      streak.questResetDate = todayStr;
      streak.completedQuests = [];
      saveStreak(streak);
    }

    if (streak.currentStreak > 0 && streak.lastLogDate !== todayStr && streak.lastLogDate !== yesterdayStr) {
      // User missed daily log!
      const lastLogTime = new Date(streak.lastLogDate).getTime();
      const yesterdayTime = new Date(yesterdayStr).getTime();
      const diffDays = Math.floor((yesterdayTime - lastLogTime) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        let freezesConsumed = 0;
        for (let i = 0; i < diffDays; i++) {
          if (streak.streakFreezeCount > 0) {
            streak.streakFreezeCount--;
            freezesConsumed++;
          } else {
            // No freezes remaining, streak breaks
            streak.currentStreak = 0;
            break;
          }
        }
        
        if (streak.currentStreak > 0) {
          // Shield protected the streak! Adjust lastLogDate to yesterday so it connects
          streak.lastLogDate = yesterdayStr;
          saveStreak(streak);
          setTimeout(() => {
            playRewardSound('success');
            alert(`❄️ Streak Shield Activated!\n\nConsumed ${freezesConsumed} Streak Freeze(s) to protect your active ${streak.currentStreak}-day check-in streak during your absence!`);
            updateAdvancedStreakDashboard();
          }, 800);
        } else {
          saveStreak(streak);
          setTimeout(() => {
            playRewardSound('error');
            alert(`💔 Streak Broken!\n\nYou missed your check-ins and ran out of Streak Shields. Your wellness core has cooled down.`);
            updateAdvancedStreakDashboard();
          }, 800);
        }
      }
    }
  };

  const handleMoodSelection = (selectedMood, checkinAnswers = null) => {
    const todayStr = getTodayDateString();
    const yesterdayStr = getYesterdayDateString();
    
    let logs = loadMoodLogs();
    let streak = loadStreak();
    
    const existingIndex = logs.findIndex(log => log.date === todayStr);
    let logAdded = false;

    if (existingIndex >= 0) {
      logs[existingIndex].mood = selectedMood;
      if (checkinAnswers) {
        logs[existingIndex].checkin = checkinAnswers;
        logs[existingIndex].wellnessScore = computeWellnessScore(checkinAnswers);
      }
    } else {
      const entry = { date: todayStr, mood: selectedMood };
      if (checkinAnswers) {
        entry.checkin = checkinAnswers;
        entry.wellnessScore = computeWellnessScore(checkinAnswers);
      }
      logs.push(entry);
      logAdded = true;
      
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

      // Gamification Reward: +15 XP, +10 Coins for checkin activity
      streak.zanXP += 15;
      streak.zanCoins += 10;
    }
    
    saveMoodLogs(logs);
    saveStreak(streak);
    
    // Play sound if check-in was added
    if (logAdded) {
      playRewardSound('success');
    }

    updateOrbTheme(selectedMood);
    updateDashboardUI();
    if (typeof updateCheckinUI === 'function') {
      updateCheckinUI();
    }
    if (document.getElementById('heatmap-grid-weeks')) {
      updateAdvancedStreakDashboard();
    }
  };

  // ─── DAILY CHECK-IN WIZARD (mood-tracker page) ───
  const checkinPanel = document.getElementById('daily-checkin-panel');
  let checkinStepIndex = 0;
  let checkinAnswers = {};
  let checkinOnMoodStep = false;
  let updateCheckinUI = () => {};

  if (checkinPanel) {
    const checkinStepLabel = document.getElementById('checkin-step-label');
    const checkinProgressFill = document.getElementById('checkin-progress-fill');
    const checkinStepDots = document.getElementById('checkin-step-dots');
    const checkinBody = document.getElementById('checkin-body');
    const checkinEmoji = document.getElementById('checkin-emoji');
    const checkinQuestionText = document.getElementById('checkin-question-text');
    const checkinOptions = document.getElementById('checkin-options');
    const checkinBackBtn = document.getElementById('checkin-back-btn');
    const checkinNextBtn = document.getElementById('checkin-next-btn');
    const moodFinalStep = document.getElementById('mood-final-step');
    const moodSelectionGrid = document.getElementById('mood-selection-grid');
    const wellnessInsightsCard = document.getElementById('wellness-insights-card');
    const wellnessScoreBadge = document.getElementById('wellness-score-badge');
    const wellnessScoreFill = document.getElementById('ws-fill');
    const wellnessSummaryText = document.getElementById('wellness-summary-text');
    const wellnessFactorsList = document.getElementById('wellness-factors-list');
    const retakeCheckinBtn = document.getElementById('retake-checkin-btn');
    const moodHeadingText = document.getElementById('mood-heading-text');
    const moodIntroText = document.getElementById('mood-intro-text');
    const totalSteps = CHECKIN_QUESTIONS.length;
    const wsCircumference = 2 * Math.PI * 38;

    const animateCheckinBody = () => {
      if (!checkinBody) return;
      checkinBody.classList.remove('checkin-animate');
      void checkinBody.offsetWidth;
      checkinBody.classList.add('checkin-animate');
    };

    const renderStepDots = () => {
      if (!checkinStepDots) return;
      checkinStepDots.innerHTML = '';
      for (let i = 0; i < totalSteps; i++) {
        const dot = document.createElement('span');
        dot.className = 'checkin-dot';
        if (i < checkinStepIndex) dot.classList.add('done');
        if (i === checkinStepIndex) dot.classList.add('current');
        checkinStepDots.appendChild(dot);
      }
    };

    const setWellnessRing = (score) => {
      if (wellnessScoreBadge) wellnessScoreBadge.textContent = score;
      if (wellnessScoreFill) {
        const offset = wsCircumference * (1 - score / 100);
        wellnessScoreFill.style.strokeDasharray = `${wsCircumference}`;
        wellnessScoreFill.style.strokeDashoffset = `${offset}`;
      }
    };

    const renderWellnessInsights = (todayLog) => {
      if (!wellnessInsightsCard || !todayLog || !todayLog.checkin) return;

      const score = todayLog.wellnessScore ?? computeWellnessScore(todayLog.checkin);
      const { summary, factors } = getWellnessInsights(todayLog.checkin, score);

      setWellnessRing(score);
      if (wellnessSummaryText) wellnessSummaryText.textContent = summary;
      if (wellnessFactorsList) {
        wellnessFactorsList.innerHTML = '';
        factors.forEach(factor => {
          const li = document.createElement('li');
          li.textContent = factor;
          wellnessFactorsList.appendChild(li);
        });
      }
      wellnessInsightsCard.style.display = 'block';
    };

    const advanceCheckinStep = () => {
      if (checkinStepIndex < totalSteps - 1) {
        checkinStepIndex += 1;
        renderCheckinStep();
      } else {
        showMoodStep();
      }
    };

    const renderCheckinStep = () => {
      const q = CHECKIN_QUESTIONS[checkinStepIndex];
      if (!q) return;

      if (checkinStepLabel) {
        checkinStepLabel.textContent = `Question ${checkinStepIndex + 1} of ${totalSteps}`;
      }
      if (checkinProgressFill) {
        checkinProgressFill.style.width = `${((checkinStepIndex + 1) / totalSteps) * 100}%`;
      }

      renderStepDots();
      updateOrbProgress(checkinStepIndex + 1, totalSteps, false);
      animateCheckinBody();

      if (checkinEmoji) checkinEmoji.textContent = q.emoji;
      if (checkinQuestionText) checkinQuestionText.textContent = q.question;

      const useCompactGrid = q.options.length >= 4;

      if (checkinOptions) {
        checkinOptions.innerHTML = '';
        checkinOptions.classList.toggle('is-compact', useCompactGrid);
        q.options.forEach(opt => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'checkin-option-btn';
          btn.textContent = opt.label;
          btn.dataset.value = opt.value;
          if (checkinAnswers[q.id] === opt.value) {
            btn.classList.add('active');
          }
          btn.addEventListener('click', () => {
            checkinAnswers[q.id] = opt.value;
            checkinOptions.querySelectorAll('.checkin-option-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (checkinNextBtn) checkinNextBtn.disabled = false;
            setTimeout(() => {
              if (checkinAnswers[q.id] === opt.value) advanceCheckinStep();
            }, 380);
          });
          checkinOptions.appendChild(btn);
        });
      }

      if (checkinBackBtn) checkinBackBtn.disabled = checkinStepIndex === 0;
      if (checkinNextBtn) {
        checkinNextBtn.disabled = !checkinAnswers[q.id];
        checkinNextBtn.innerHTML = checkinStepIndex === totalSteps - 1
          ? 'Pick your mood <span aria-hidden="true">→</span>'
          : 'Next <span aria-hidden="true">→</span>';
      }
    };

    const showMoodStep = () => {
      checkinOnMoodStep = true;
      checkinPanel.style.display = 'none';
      if (moodFinalStep) moodFinalStep.style.display = 'block';
      if (moodSelectionGrid) moodSelectionGrid.style.display = 'grid';
      if (moodHeadingText) moodHeadingText.textContent = 'Almost there';
      if (moodIntroText) {
        moodIntroText.textContent = 'One last tap — how would you describe your overall energy right now?';
      }
      updateOrbProgress(totalSteps, totalSteps, true);
      const orbInstruction = document.getElementById('orb-instruction-text');
      if (orbInstruction) orbInstruction.textContent = 'Choose your mood to complete sync';
    };

    const resetCheckinWizard = () => {
      checkinStepIndex = 0;
      checkinAnswers = {};
      checkinOnMoodStep = false;
      checkinPanel.style.display = 'block';
      if (moodFinalStep) moodFinalStep.style.display = 'none';
      if (moodSelectionGrid) moodSelectionGrid.style.display = 'none';
      if (wellnessInsightsCard) wellnessInsightsCard.style.display = 'none';
      if (moodHeadingText) moodHeadingText.textContent = 'Let\'s understand your day';
      if (moodIntroText) {
        moodIntroText.textContent = 'Quick questions about today, then how you\'re feeling — so Zantix can spot patterns in your wellbeing.';
      }
      updateOrbTheme(null);
      updateOrbProgress(0, totalSteps, false);
      renderCheckinStep();
    };

    updateCheckinUI = () => {
      const todayStr = getTodayDateString();
      const todayLog = loadMoodLogs().find(log => log.date === todayStr);

      updateMoodStatusPill(todayLog);

      if (todayLog && todayLog.checkin) {
        checkinPanel.style.display = 'none';
        if (moodFinalStep) moodFinalStep.style.display = 'none';
        if (moodSelectionGrid) moodSelectionGrid.style.display = 'grid';
        if (moodHeadingText) moodHeadingText.textContent = 'You\'re checked in';
        if (moodIntroText) {
          moodIntroText.textContent = 'Update your mood anytime, or retake the questionnaire for a fresh snapshot.';
        }
        renderWellnessInsights(todayLog);
        updateOrbProgress(10, totalSteps, false);
        checkinOnMoodStep = false;
      } else if (!checkinOnMoodStep) {
        if (wellnessInsightsCard) wellnessInsightsCard.style.display = 'none';
        checkinPanel.style.display = 'block';
        if (moodFinalStep) moodFinalStep.style.display = 'none';
        if (moodSelectionGrid) moodSelectionGrid.style.display = 'none';
        renderCheckinStep();
      }
    };

    if (checkinBackBtn) {
      checkinBackBtn.addEventListener('click', () => {
        if (checkinStepIndex > 0) {
          checkinStepIndex -= 1;
          renderCheckinStep();
        }
      });
    }

    if (checkinNextBtn) {
      checkinNextBtn.addEventListener('click', () => {
        const q = CHECKIN_QUESTIONS[checkinStepIndex];
        if (!q || !checkinAnswers[q.id]) return;
        advanceCheckinStep();
      });
    }

    if (retakeCheckinBtn) {
      retakeCheckinBtn.addEventListener('click', resetCheckinWizard);
    }

    initMoodDatePill();
    renderCheckinStep();
  }

  moodSelectBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const selectedMood = this.dataset.mood;

      if (checkinPanel) {
        if (!checkinOnMoodStep) {
          const todayLog = loadMoodLogs().find(log => log.date === getTodayDateString());
          if (todayLog && todayLog.checkin) {
            handleMoodSelection(selectedMood);
          }
          return;
        }
        handleMoodSelection(selectedMood, { ...checkinAnswers });
        checkinOnMoodStep = false;
        return;
      }

      handleMoodSelection(selectedMood);
    });
  });

  if (stopBreathingBtn) {
    stopBreathingBtn.addEventListener('click', stopBreathing);
  }

  // Sound effects toggle button binding
  const soundBtn = document.getElementById('sound-effects-toggle');
  if (soundBtn) {
    const savedSound = localStorage.getItem('zantixSoundFX');
    if (savedSound === 'off') {
      soundBtn.classList.remove('active');
      soundBtn.innerHTML = '<span>🔇 Synth FX: OFF</span>';
    }
    
    soundBtn.addEventListener('click', () => {
      const current = localStorage.getItem('zantixSoundFX');
      if (current === 'off') {
        localStorage.setItem('zantixSoundFX', 'on');
        soundBtn.classList.add('active');
        soundBtn.innerHTML = '<span>🔊 Synth FX: ON</span>';
        playRewardSound('success');
      } else {
        localStorage.setItem('zantixSoundFX', 'off');
        soundBtn.classList.remove('active');
        soundBtn.innerHTML = '<span>🔇 Synth FX: OFF</span>';
      }
    });
  }

  // Initial load checks
  processStreakMissedDays();

  if (historyGrid || checklistGrid) {
    updateDashboardUI();
  }

  if (checkinPanel) {
    updateCheckinUI();
  }

  if (document.getElementById('heatmap-grid-weeks')) {
    updateAdvancedStreakDashboard();
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

  // ─── DAILY / MIDNIGHT ENVELOPE CAPSULE SYSTEM ───
  const midnightCapsules = [
    {
      title: "Hey there, Night Owl 🌙",
      message: "It’s quiet right now. Whatever is keeping your mind awake tonight—exam pressure, overthinking, or feeling behind—take one deep breath. You don't have to figure out your whole life tonight. Rest is productive too.",
      dare: "Unclench your jaw, drop your shoulders away from your ears, and take one sip of water."
    },
    {
      title: "A Gentle Reminder ✨",
      message: "Comparison is the thief of joy. Everyone else’s highlight reel hides their 3 AM doubts too. You are running your own race at your own pace.",
      dare: "Give yourself permission to close any tabs or notes that are stressing you out right now."
    },
    {
      title: "You Are Enough 🌿",
      message: "A difficult semester or one rough exam is just a single page in your story—it is never the whole title. Look how many hard days you've already survived.",
      dare: "Put one hand on your chest, take a 4-second inhale, and remind yourself: 'I am doing the best I can.'"
    },
    {
      title: "Midnight Sanctuary 🌌",
      message: "When everything feels overwhelming, zoom in to just the next 10 minutes. You don't have to carry tomorrow's burdens tonight.",
      dare: "Write down or mentally release one worry you cannot control before sleeping."
    }
  ];

  function openMidnightCapsuleModal() {
    let backdrop = document.getElementById('midnight-modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'midnight-modal-backdrop';
      backdrop.className = 'midnight-modal-backdrop';
      document.body.appendChild(backdrop);
    }

    const todayStr = new Date().toDateString();
    let capsuleIdx = Math.floor(Math.random() * midnightCapsules.length);
    const savedIdx = localStorage.getItem('zantix_capsule_idx_' + todayStr);
    if (savedIdx !== null) {
      capsuleIdx = parseInt(savedIdx, 10) % midnightCapsules.length;
    } else {
      localStorage.setItem('zantix_capsule_idx_' + todayStr, capsuleIdx);
    }

    const capsule = midnightCapsules[capsuleIdx];

    backdrop.innerHTML = `
      <div class="midnight-envelope-card">
        <button class="midnight-close-btn" aria-label="Close modal">×</button>
        <span class="midnight-envelope-icon">💌</span>
        <h3 class="midnight-title">${capsule.title}</h3>
        <div class="midnight-subtitle">Your Daily Wellness Capsule</div>
        <div class="midnight-message-box">
          <p class="midnight-message-text">"${capsule.message}"</p>
          <div class="midnight-dare-box">
            <strong>✨ Gentle Micro-Dare:</strong> ${capsule.dare}
          </div>
        </div>
        <div class="midnight-actions">
          <button class="btn btn-primary midnight-done-btn">Thank you, got it 💚</button>
        </div>
      </div>
    `;

    const closeBtn = backdrop.querySelector('.midnight-close-btn');
    const doneBtn = backdrop.querySelector('.midnight-done-btn');

    const closeModal = () => {
      backdrop.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (doneBtn) doneBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    setTimeout(() => {
      backdrop.classList.add('active');
    }, 50);

    // Remove notification dot once opened today
    const sparkle = document.querySelector('.envelope-sparkle');
    if (sparkle) sparkle.style.display = 'none';
    localStorage.setItem('zantix_opened_capsule_' + todayStr, 'true');
  }

  // Automatically inject envelope button next to theme toggle if present
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn && themeToggleBtn.parentNode && !document.getElementById('daily-envelope-btn')) {
    const envelopeBtn = document.createElement('button');
    envelopeBtn.id = 'daily-envelope-btn';
    envelopeBtn.className = 'envelope-btn';
    envelopeBtn.setAttribute('aria-label', 'Open Daily Midnight Capsule');
    envelopeBtn.setAttribute('title', 'Your Daily Wellness Capsule');

    const todayStr = new Date().toDateString();
    const alreadyOpened = localStorage.getItem('zantix_opened_capsule_' + todayStr) === 'true';

    envelopeBtn.innerHTML = `
      💌
      <span class="envelope-sparkle" style="display: ${alreadyOpened ? 'none' : 'block'};"></span>
    `;

    envelopeBtn.addEventListener('click', openMidnightCapsuleModal);
    themeToggleBtn.parentNode.insertBefore(envelopeBtn, themeToggleBtn);
  }

  // Auto-open at night (12 AM to 4 AM) once per night
  const currentHour = new Date().getHours();
  const todayDateStr = new Date().toDateString();
  const seenMidnightToday = localStorage.getItem('zantix_seen_midnight_' + todayDateStr);

  if ((currentHour >= 0 && currentHour < 4) && !seenMidnightToday) {
    localStorage.setItem('zantix_seen_midnight_' + todayDateStr, 'true');
    setTimeout(() => {
      openMidnightCapsuleModal();
    }, 1200);
  }
});

