// Initialize state
let streak = parseInt(localStorage.getItem('streak')) || 0;
let points = parseInt(localStorage.getItem('points')) || 0;
let completedToday = parseInt(localStorage.getItem('completedToday')) || 0;
let replacementsToday = parseInt(localStorage.getItem('replacementsToday')) || 0;
let skipsToday = parseInt(localStorage.getItem('skipsToday')) || 0;
let achievements = JSON.parse(localStorage.getItem('achievements')) || [];

let reflectionIndex = 0;

updateUI();

// --- Navigation ---
function hideAllScreens(){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('show'));}
function showScreen(id){hideAllScreens(); document.getElementById(id).classList.add('show');}
function showHome(){showScreen('home');}
function showTrigger(){showScreen('trigger');}
function showEmotion(){showScreen('emotion');}
function showDecision(){showScreen('decision');}
function showReplace(){showScreen('replace');}
function showTracking(){showScreen('tracking'); updateUI();}

// --- Update UI ---
function updateUI(){
  document.getElementById('streak').textContent=streak;
  document.getElementById('streakTracking').textContent=streak;
  document.getElementById('points').textContent=points;
  document.getElementById('pointsTracking').textContent=points;
  document.getElementById('replacements').textContent=replacementsToday;
  document.getElementById('replacementsTracking').textContent=replacementsToday;
  document.getElementById('skips').textContent=skipsToday;
  document.getElementById('skipsTracking').textContent=skipsToday;
}

// --- Complete habit ---
function completeHabit(skip=true){
  streak++;
  completedToday++;
  points += 10;
  if(skip) skipsToday++; else replacementsToday++;

  localStorage.setItem('streak', streak);
  localStorage.setItem('points', points);
  localStorage.setItem('completedToday', completedToday);
  localStorage.setItem('replacementsToday', replacementsToday);
  localStorage.setItem('skipsToday', skipsToday);

  // Achievements
  if(skip && !achievements.includes("Mindful Skipper")){
    achievements.push("Mindful Skipper");
    localStorage.setItem('achievements', JSON.stringify(achievements));
    displayMotivation("🏆 Achievement Unlocked: Mindful Skipper!");
  } else if(!skip && !achievements.includes("Habit Replacer")){
    achievements.push("Habit Replacer");
    localStorage.setItem('achievements', JSON.stringify(achievements));
    displayMotivation("🏆 Achievement Unlocked: Habit Replacer!");
  } else {
    displayMotivation(skip ? "🌟 You skipped mindfully — full reward!" : randomMotivation());
  }

  showTracking();
  launchStars();
  reflectionPrompt(skip);
}

// --- Replacement ---
function completeReplacement(action){ completeHabit(false); }

// --- Motivation ---
function randomMotivation(){
  const messages = ["✅ Great job!","🎉 You replaced a habit!","🌟 Keep it going!","💪 Awesome!","👏 Well done!"];
  return messages[Math.floor(Math.random()*messages.length)];
}
function displayMotivation(msg){document.getElementById('motivationMessage').textContent=msg;}

// --- Reflection Prompt ---
function reflectionPrompt(skip){
  const prompts = skip ?
    ["Why did you skip this habit?","How did skipping help?"] :
    ["How did replacing help you today?","What did you learn from this action?"];
  document.getElementById('reflectionPrompt').textContent = prompts[reflectionIndex % prompts.length];
  reflectionIndex++;
}

// --- Reset ---
function resetStreak(){
  streak=0; points=0; completedToday=0; replacementsToday=0; skipsToday=0;
  localStorage.setItem('streak', streak);
  localStorage.setItem('points', points);
  localStorage.setItem('completedToday', completedToday);
  localStorage.setItem('replacementsToday', replacementsToday);
  localStorage.setItem('skipsToday', skipsToday);
  showTracking();
}

// --- Star animation ---
function launchStars(){
  const canvas=document.getElementById('starCanvas');
  const ctx=canvas.getContext('2d');
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;

  const starCount=100;
  const stars=[];
  for(let i=0;i<starCount;i++){
    stars.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height-canvas.height,r:Math.random()*3+1,speed:Math.random()*2+1,opacity:Math.random(),flicker:Math.random()*0.05});
  }

  let frame=0;
  const anim=setInterval(()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s=>{
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,2*Math.PI);
      ctx.fillStyle=`rgba(255,255,255,${s.opacity})`;
      ctx.fill();
      s.y+=s.speed;
      s.opacity+=s.flicker;
      if(s.opacity>1) s.opacity=1;
      if(s.opacity<0) s.opacity=0;
      if(s.y>canvas.height) s.y=-5;
    });
    frame+=0.1;
  },16);

  setTimeout(()=>{clearInterval(anim); ctx.clearRect(0,0,canvas.width,canvas.height);},2000);
}
