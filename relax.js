// relax.js - Logic for Breathing and Grounding Exercises

let breathingTimer;
let breathingActive = false;

const breatheCircle = document.getElementById('breathe-circle');
const breatheText = document.getElementById('breathe-text');
const breatheModal = document.getElementById('breathe-modal');
const breatheTitle = document.getElementById('breathe-title');
const breatheSubtitle = document.getElementById('breathe-subtitle');

function startBreathing(type) {
  breatheModal.classList.add('active');
  breathingActive = true;
  
  if (type === 'box') {
    breatheTitle.textContent = "Box Breathing";
    breatheSubtitle.textContent = "Inhale 4s, Hold 4s, Exhale 4s, Hold 4s";
    runBoxBreathing();
  } else if (type === '478') {
    breatheTitle.textContent = "4-7-8 Relaxing Breath";
    breatheSubtitle.textContent = "Inhale 4s, Hold 7s, Exhale 8s";
    run478Breathing();
  } else if (type === 'belly') {
    breatheTitle.textContent = "Deep Belly Breathing";
    breatheSubtitle.textContent = "Inhale deeply 4s, Exhale slowly 6s";
    runBellyBreathing();
  }
}

function stopBreathingModal() {
  breatheModal.classList.remove('active');
  breathingActive = false;
  clearTimeout(breathingTimer);
  breatheCircle.style.transform = 'scale(1)';
  breatheCircle.style.transition = 'none';
  breatheText.textContent = "Ready";
}

// 1. Box Breathing (4-4-4-4)
function runBoxBreathing() {
  if (!breathingActive) return;
  
  // Inhale
  breatheText.textContent = "Inhale";
  breatheCircle.style.transition = 'transform 4s linear';
  breatheCircle.style.transform = 'scale(2.5)';
  
  breathingTimer = setTimeout(() => {
    if (!breathingActive) return;
    
    // Hold 1
    breatheText.textContent = "Hold";
    breatheCircle.style.transition = 'none';
    
    breathingTimer = setTimeout(() => {
      if (!breathingActive) return;
      
      // Exhale
      breatheText.textContent = "Exhale";
      breatheCircle.style.transition = 'transform 4s linear';
      breatheCircle.style.transform = 'scale(1)';
      
      breathingTimer = setTimeout(() => {
        if (!breathingActive) return;
        
        // Hold 2
        breatheText.textContent = "Hold";
        breatheCircle.style.transition = 'none';
        
        breathingTimer = setTimeout(() => {
          runBoxBreathing();
        }, 4000);
      }, 4000);
    }, 4000);
  }, 4000);
}

// 2. 4-7-8 Breathing
function run478Breathing() {
  if (!breathingActive) return;
  
  breatheText.textContent = "Inhale";
  breatheCircle.style.transition = 'transform 4s linear';
  breatheCircle.style.transform = 'scale(2.5)';
  
  breathingTimer = setTimeout(() => {
    if (!breathingActive) return;
    
    breatheText.textContent = "Hold";
    breatheCircle.style.transition = 'none';
    
    breathingTimer = setTimeout(() => {
      if (!breathingActive) return;
      
      breatheText.textContent = "Exhale";
      breatheCircle.style.transition = 'transform 8s linear';
      breatheCircle.style.transform = 'scale(1)';
      
      breathingTimer = setTimeout(() => {
        run478Breathing();
      }, 8000);
    }, 7000);
  }, 4000);
}

// 3. Deep Belly Breathing (4-6)
function runBellyBreathing() {
  if (!breathingActive) return;
  
  breatheText.textContent = "Deep Inhale";
  breatheCircle.style.transition = 'transform 4s linear';
  breatheCircle.style.transform = 'scale(2.5)';
  
  breathingTimer = setTimeout(() => {
    if (!breathingActive) return;
    
    breatheText.textContent = "Slow Exhale";
    breatheCircle.style.transition = 'transform 6s linear';
    breatheCircle.style.transform = 'scale(1)';
    
    breathingTimer = setTimeout(() => {
      runBellyBreathing();
    }, 6000);
  }, 4000);
}


/* ================= GROUNDING EXERCISES ================= */
const groundingModal = document.getElementById('grounding-modal');
const gTitle = document.getElementById('g-title');
const gDesc = document.getElementById('g-desc');
const gStepsContainer = document.getElementById('g-steps-container');

const groundingData = {
  '54321': {
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
    title: "Progressive Muscle Relaxation",
    desc: "Tense each muscle group for 5 seconds, then suddenly release and relax for 10 seconds. Click each step as you complete it.",
    steps: [
      "Hands & Arms: Clench your fists tightly. Release.",
      "Face & Forehead: Squeeze your eyes shut and clench your jaw. Release.",
      "Shoulders & Neck: Pull your shoulders up to your ears. Release.",
      "Chest & Stomach: Take a deep breath, hold it, and tighten your stomach. Release.",
      "Legs & Feet: Squeeze your thighs and curl your toes. Release."
    ]
  }
};

function openGroundingModal(type) {
  const data = groundingData[type];
  gTitle.textContent = data.title;
  gDesc.textContent = data.desc;
  
  gStepsContainer.innerHTML = '';
  
  data.steps.forEach((stepText, index) => {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'g-step';
    stepDiv.innerHTML = `
      <div class="g-step-num">${index + 1}</div>
      <div style="flex:1;">
        <p style="font-weight: 500; color: var(--heading-color);">${stepText}</p>
      </div>
    `;
    
    stepDiv.addEventListener('click', () => {
      stepDiv.classList.toggle('completed');
    });
    
    gStepsContainer.appendChild(stepDiv);
  });
  
  groundingModal.classList.add('active');
}

function closeGroundingModal() {
  groundingModal.classList.remove('active');
}
