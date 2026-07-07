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

// Setup Filter Tabs
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const exerciseCards = document.querySelectorAll('.exercise-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      exerciseCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
          // Reset animation by removing and adding element
          card.style.animation = 'none';
          card.offsetHeight; /* trigger reflow */
          card.style.animation = 'fadeUp 0.6s ease both';
        } else {
          card.classList.add('hidden');
        }
      });
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
