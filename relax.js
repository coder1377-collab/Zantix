// relax.js - Logic for Breathing and Grounding Exercises

let breathingTimer;
let countdownTimer;
let breathingActive = false;
let currentPhaseSeconds = 0;

const breatheCircle = document.getElementById('breathe-circle');
const breatheText = document.getElementById('breathe-text');
const breatheTimerEl = document.getElementById('breathe-timer');
const breatheModal = document.getElementById('breathe-modal');
const breatheTitle = document.getElementById('breathe-title');
const breatheSubtitle = document.getElementById('breathe-subtitle');

// Setup Main Section Tabs (Activities vs Flashcards)
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const relaxGrid = document.getElementById('relax-grid');
  const flashcardDeckSection = document.getElementById('flashcard-deck-section');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const section = btn.getAttribute('data-section');
      
      if (section === 'flashcards') {
        if (relaxGrid) relaxGrid.style.display = 'none';
        if (flashcardDeckSection) {
          flashcardDeckSection.style.display = 'block';
          flashcardDeckSection.style.animation = 'none';
          flashcardDeckSection.offsetHeight;
          flashcardDeckSection.style.animation = 'fadeUp 0.5s ease both';
        }
      } else {
        if (flashcardDeckSection) flashcardDeckSection.style.display = 'none';
        if (relaxGrid) {
          relaxGrid.style.display = 'grid';
          relaxGrid.style.animation = 'none';
          relaxGrid.offsetHeight;
          relaxGrid.style.animation = 'fadeUp 0.5s ease both';
        }
      }
    });
  });
});

function startBreathing(type) {
  breatheModal.classList.add('active');
  breathingActive = true;
  
  // Find the button that triggered this to get its theme, or just hardcode map
  const themeMap = {
    'box': 'focus',
    '478': 'sleep',
    'belly': 'relax',
    'nostril': 'focus'
  };
  breatheModal.setAttribute('data-theme', themeMap[type]);
  
  if (type === 'box') {
    breatheTitle.textContent = "Box Breathing";
    breatheSubtitle.textContent = "Inhale 4s, Hold 4s, Exhale 4s, Hold 4s";
    runBreathingCycle([
      { text: 'Breathe in...', duration: 4, scale: 2.5 },
      { text: 'Hold...', duration: 4, scale: 2.5 },
      { text: 'Breathe out...', duration: 4, scale: 1 },
      { text: 'Hold...', duration: 4, scale: 1 }
    ]);
  } else if (type === '478') {
    breatheTitle.textContent = "4-7-8 Relaxing Breath";
    breatheSubtitle.textContent = "Inhale 4s, Hold 7s, Exhale 8s";
    runBreathingCycle([
      { text: 'Breathe in...', duration: 4, scale: 2.5 },
      { text: 'Hold...', duration: 7, scale: 2.5 },
      { text: 'Breathe out deeply...', duration: 8, scale: 1 }
    ]);
  } else if (type === 'belly') {
    breatheTitle.textContent = "Deep Belly Breathing";
    breatheSubtitle.textContent = "Inhale deeply 4s, Exhale slowly 6s";
    runBreathingCycle([
      { text: 'Deep inhale...', duration: 4, scale: 2.5 },
      { text: 'Slow exhale...', duration: 6, scale: 1 }
    ]);
  } else if (type === 'nostril') {
    breatheTitle.textContent = "Alternate Nostril Breathing";
    breatheSubtitle.textContent = "Close right, inhale left. Close left, exhale right.";
    runBreathingCycle([
      { text: 'Close right, Inhale left...', duration: 4, scale: 2.5 },
      { text: 'Hold...', duration: 2, scale: 2.5 },
      { text: 'Close left, Exhale right...', duration: 4, scale: 1 },
      { text: 'Close left, Inhale right...', duration: 4, scale: 2.5 },
      { text: 'Hold...', duration: 2, scale: 2.5 },
      { text: 'Close right, Exhale left...', duration: 4, scale: 1 }
    ]);
  }
}

function stopBreathingModal() {
  breatheModal.classList.remove('active');
  breathingActive = false;
  clearTimeout(breathingTimer);
  clearInterval(countdownTimer);
  breatheCircle.style.transform = 'scale(1)';
  breatheCircle.style.transition = 'none';
  breatheText.innerHTML = "Ready<br><span class='breathe-timer' id='breathe-timer'></span>";
}

function runBreathingCycle(phases) {
  let phaseIndex = 0;
  
  function nextPhase() {
    if (!breathingActive) return;
    
    const phase = phases[phaseIndex];
    breatheText.innerHTML = `${phase.text}<br><span class="breathe-timer" id="breathe-timer"></span>`;
    
    // Re-select timer since innerHTML replaced it
    const currentTimerEl = document.getElementById('breathe-timer');
    
    // Setup transition matching the duration
    breatheCircle.style.transition = `transform ${phase.duration}s ease-in-out, background 1s ease-in-out`;
    breatheCircle.style.transform = `scale(${phase.scale})`;
    
    // Countdown logic
    clearInterval(countdownTimer);
    let secondsLeft = phase.duration;
    currentTimerEl.textContent = secondsLeft;
    
    countdownTimer = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        currentTimerEl.textContent = secondsLeft;
      } else {
        clearInterval(countdownTimer);
      }
    }, 1000);
    
    breathingTimer = setTimeout(() => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      nextPhase();
    }, phase.duration * 1000);
  }
  
  nextPhase();
}

/* ================= GROUNDING EXERCISES ================= */
const groundingModal = document.getElementById('grounding-modal');
const gTitle = document.getElementById('g-title');
const gDesc = document.getElementById('g-desc');
const gStepsContainer = document.getElementById('g-steps-container');

// PMR specific variables
let pmrTimers = {};

const groundingData = {
  '54321': {
    theme: 'anxiety',
    title: "5-4-3-2-1 Grounding Technique",
    desc: "A powerful method to calm an anxious mind by focusing on your physical surroundings. Click each step as you complete it.",
    steps: [
      "Acknowledge 5 things you can SEE around you.",
      "Acknowledge 4 things you can physically FEEL.",
      "Acknowledge 3 things you can HEAR.",
      "Acknowledge 2 things you can SMELL.",
      "Acknowledge 1 thing you can TASTE."
    ]
  },
  'pmr': {
    theme: 'tension',
    title: "Progressive Muscle Relaxation",
    desc: "Click a step to begin its timer. Tense the muscle group for 5s, then release and relax for 10s.",
    steps: [
      "Hands & Arms: Clench your fists tightly.",
      "Face & Forehead: Squeeze your eyes shut and clench your jaw.",
      "Shoulders & Neck: Pull your shoulders up to your ears.",
      "Chest & Stomach: Take a deep breath, hold it, and tighten your stomach.",
      "Legs & Feet: Squeeze your thighs and curl your toes."
    ],
    hasTimer: true
  },
  'bodyscan': {
    theme: 'sleep',
    title: "Body Scan Meditation",
    desc: "Click a step to begin scanning. Focus your attention on each part without judgment for 15 seconds.",
    steps: [
      "Notice your feet resting on the floor or bed. Feel their weight and any sensations.",
      "Move your attention to your legs, feeling the calves and thighs.",
      "Bring awareness to your stomach and chest as they rise and fall with your breath.",
      "Notice your arms, hands, and fingers. Let them feel heavy and relaxed.",
      "Finally, notice your neck and face. Soften your jaw and relax the space between your eyebrows."
    ],
    hasTimer: true,
    timerDuration: 15
  }
};

function openGroundingModal(type) {
  const data = groundingData[type];
  groundingModal.setAttribute('data-theme', data.theme);
  gTitle.textContent = data.title;
  gDesc.textContent = data.desc;
  
  gStepsContainer.innerHTML = '';
  
  // Clear any existing PMR timers
  Object.values(pmrTimers).forEach(timer => clearInterval(timer));
  pmrTimers = {};
  
  data.steps.forEach((stepText, index) => {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'g-step';
    
    let extraHTML = '';
    if (data.hasTimer) {
      extraHTML = `<span class="pmr-timer" id="pmr-timer-${index}">Click to start timer</span>`;
    }
    
    stepDiv.innerHTML = `
      <div class="g-step-num">${index + 1}</div>
      <div style="flex:1;">
        <p style="font-weight: 500; color: var(--heading-color);">${stepText}</p>
        ${extraHTML}
      </div>
    `;
    
    stepDiv.addEventListener('click', () => {
      if (!data.hasTimer) {
        stepDiv.classList.toggle('completed');
      } else {
        if (!stepDiv.classList.contains('completed') && !pmrTimers[index]) {
          startGroundingTimer(index, stepDiv, type);
        }
      }
    });
    
    gStepsContainer.appendChild(stepDiv);
  });
  
  groundingModal.classList.add('active');
}

function startGroundingTimer(index, stepDiv, type) {
  const timerEl = document.getElementById(`pmr-timer-${index}`);
  
  if (type === 'pmr') {
    let phase = 'tense'; // 'tense' or 'release'
    let secondsLeft = 5;
    
    timerEl.textContent = `TENSE: ${secondsLeft}s`;
    stepDiv.style.background = 'rgba(239, 68, 68, 0.1)'; // Red tension
    
    pmrTimers[index] = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        timerEl.textContent = phase === 'tense' ? `TENSE: ${secondsLeft}s` : `RELAX: ${secondsLeft}s`;
      } else {
        if (phase === 'tense') {
          phase = 'release';
          secondsLeft = 10;
          timerEl.textContent = `RELAX: ${secondsLeft}s`;
          stepDiv.style.background = 'rgba(16, 185, 129, 0.1)'; // Green relax
        } else {
          clearInterval(pmrTimers[index]);
          delete pmrTimers[index];
          timerEl.textContent = 'Completed';
          stepDiv.classList.add('completed');
          stepDiv.style.background = '';
        }
      }
    }, 1000);
  } else if (type === 'bodyscan') {
    let secondsLeft = 15;
    timerEl.textContent = `SCANNING: ${secondsLeft}s`;
    stepDiv.style.background = 'rgba(139, 92, 246, 0.1)'; // Purple focus
    
    pmrTimers[index] = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        timerEl.textContent = `SCANNING: ${secondsLeft}s`;
      } else {
        clearInterval(pmrTimers[index]);
        delete pmrTimers[index];
        timerEl.textContent = 'Completed';
        stepDiv.classList.add('completed');
        stepDiv.style.background = '';
      }
    }, 1000);
  }
}

function closeGroundingModal() {
  groundingModal.classList.remove('active');
  Object.values(pmrTimers).forEach(timer => clearInterval(timer));
  pmrTimers = {};
}

// ─── CBT MINDSHIFT FLASHCARDS DECK (COLORFUL PREMIUM EDITION) ───
const flashcardsDeck = [
  {
    category: "IMPOSTER SYNDROME",
    themeClass: "card-theme-violet",
    front: "Everyone else has their life figured out except me.",
    back: "People only display their highlights, not their doubts. You are growing at exactly the right pace for your unique journey.",
    tip: "💡 Action: Take a slow breath and name 1 thing you completed today."
  },
  {
    category: "EXAM & PERFORMANCE PANIC",
    themeClass: "card-theme-coral",
    front: "I'm going to fail or mess everything up.",
    back: "One exam, presentation, or difficult week is a single page in your book—not the whole title. You have survived 100% of your hardest days so far.",
    tip: "💡 Action: Focus only on the next 15 minutes right now."
  },
  {
    category: "GUILT OVER REST",
    themeClass: "card-theme-emerald",
    front: "I should be working harder instead of resting right now.",
    back: "Rest is not a reward you have to earn through exhaustion. Rest is essential fuel for your brain and mental well-being.",
    tip: "💡 Action: Drop your shoulders away from your ears & take a sip of water."
  },
  {
    category: "LATE-NIGHT LONELINESS",
    themeClass: "card-theme-indigo",
    front: "I feel completely alone with what I am carrying.",
    back: "Loneliness lies and tells you nobody understands. Right now, thousands of students are awake feeling this exact same weight. You belong.",
    tip: "💡 Action: Put your hand over your chest and feel its steady beat."
  },
  {
    category: "CAREER & FUTURE ANXIETY",
    themeClass: "card-theme-amber",
    front: "What if I make the wrong career or life choice?",
    back: "No choice is permanent. Every path teaches you something valuable. You are allowed to pivot, experiment, and redefine your direction.",
    tip: "💡 Action: Remember that your 20s are for experimenting, not perfection."
  },
  {
    category: "SELF-DOUBT & BELONGING",
    themeClass: "card-theme-violet",
    front: "I feel like an imposter who doesn't belong here.",
    back: "Imposter syndrome only happens to people who are actively pushing their comfort zone. Feeling unsure means you are growing.",
    tip: "💡 Action: Remind yourself out loud: 'I earned my place here.'"
  },
  {
    category: "PROCRASTINATION PARALYSIS",
    themeClass: "card-theme-emerald",
    front: "I wasted too much time and it's too late to catch up.",
    back: "The next hour is completely yours. Start with just 10 minutes on one small task without judging the past.",
    tip: "💡 Action: Set a 10-minute timer and start one small step."
  },
  {
    category: "SPIRALING THOUGHTS",
    themeClass: "card-theme-cyan",
    front: "My anxiety means something terrible is about to happen.",
    back: "Anxiety is a false alarm from a tired nervous system—not a prophecy. Notice the alarm, take a deep breath, and let it pass.",
    tip: "💡 Action: Do one cycle of 4-7-8 breathing right now."
  }
];

let currentFlashcardIndex = 0;

function updateFlashcardUI() {
  const wrapper = document.getElementById('flashcard-card-wrapper');
  const frontEl = document.getElementById('flashcard-front-text');
  const backEl = document.getElementById('flashcard-back-text');
  const counterEl = document.getElementById('flashcard-counter');
  const categoryPill = document.getElementById('flashcard-category-pill');
  const tipText = document.getElementById('flashcard-tip-text');
  const progressFill = document.getElementById('flashcard-progress-fill');

  if (!frontEl || !backEl) return;

  const card = flashcardsDeck[currentFlashcardIndex];
  frontEl.textContent = `"${card.front}"`;
  backEl.textContent = `"${card.back}"`;

  if (categoryPill) {
    categoryPill.textContent = card.category;
  }
  if (tipText) {
    tipText.textContent = card.tip || "💡 Take one deep mindful breath.";
  }
  if (wrapper && card.themeClass) {
    // Remove all card themes then add active theme
    wrapper.classList.remove('card-theme-violet', 'card-theme-coral', 'card-theme-emerald', 'card-theme-indigo', 'card-theme-amber', 'card-theme-cyan');
    wrapper.classList.add(card.themeClass);
  }
  if (counterEl) {
    counterEl.textContent = `${currentFlashcardIndex + 1} / ${flashcardsDeck.length}`;
  }
  if (progressFill) {
    const percent = ((currentFlashcardIndex + 1) / flashcardsDeck.length) * 100;
    progressFill.style.width = `${percent}%`;
  }
}

function toggleFlashcardFlip() {
  const wrapper = document.getElementById('flashcard-card-wrapper');
  if (wrapper) {
    wrapper.classList.toggle('is-flipped');
  }
}

function nextFlashcard(event) {
  if (event) event.stopPropagation();
  const wrapper = document.getElementById('flashcard-card-wrapper');
  if (wrapper) wrapper.classList.remove('is-flipped');

  setTimeout(() => {
    currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcardsDeck.length;
    updateFlashcardUI();
  }, 120);
}

function prevFlashcard(event) {
  if (event) event.stopPropagation();
  const wrapper = document.getElementById('flashcard-card-wrapper');
  if (wrapper) wrapper.classList.remove('is-flipped');

  setTimeout(() => {
    currentFlashcardIndex = (currentFlashcardIndex - 1 + flashcardsDeck.length) % flashcardsDeck.length;
    updateFlashcardUI();
  }, 120);
}

function scrollToFlashcardsSection() {
  const section = document.getElementById('flashcard-deck-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateFlashcardUI();
});

