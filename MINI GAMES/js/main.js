// main.js — stage handling, navigation, and persistence

const STAGE_COUNT = 15;

function getState() {
    try {
        return JSON.parse(localStorage.getItem('miniGamesState')) || { unlocked: 1, scores: {}, results: {} };
    } catch (e) {
        return { unlocked: 1, scores: {}, results: {} };
    }
}

function saveState(state) {
    localStorage.setItem('miniGamesState', JSON.stringify(state));
}

function renderStages() {
    const container = document.getElementById('stagesGrid');
    if (!container) return;
    container.innerHTML = '';
    const state = getState();

    for (let i = 1; i <= STAGE_COUNT; i++) {
        const card = document.createElement('div');
        card.className = 'game-card';

        const title = document.createElement('div');
        title.className = 'game-title';
        title.textContent = `Game ${i}`;

        const desc = document.createElement('div');
        desc.className = 'game-desc';
        desc.textContent = `A fun mini-game template for game ${i}.`;

    const btn = document.createElement('a');
    btn.className = 'btn';
    btn.textContent = state.unlocked >= i ? 'Play' : 'Locked';
    btn.href = state.unlocked >= i ? `games/game${i}.html` : '#';
    if (state.unlocked < i) btn.setAttribute('aria-disabled', 'true');

        const meta = document.createElement('div');
        meta.className = 'meta';
        // display best from results (supports higher/lower modes) or legacy scores
        const r = state.results && state.results[i];
        if (r && typeof r.value !== 'undefined') {
            meta.textContent = `Best: ${r.value}${r.mode === 'higher' ? ' pts' : r.mode === 'lower' ? 's' : ''}`;
        } else {
            const best = state.scores && state.scores[i];
            meta.textContent = best ? `Best: ${best}s` : 'Not played';
        }

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(meta);
    card.appendChild(btn);

        container.appendChild(card);
    }
}

function unlockNext(stage) {
    const state = getState();
    if (state.unlocked < stage + 1) {
        state.unlocked = Math.min(STAGE_COUNT, stage + 1);
        saveState(state);
        renderStages();
    }
}

window.goToStage = function (n) {
    location.href = `games/game${n}.html`;
};

window.addEventListener('DOMContentLoaded', () => {
    renderStages();
});

// set best score (lower is better for time-based games)
window.setScore = function(stage, seconds) {
    // legacy wrapper: lower is better (time)
    window.setResult(stage, seconds, 'lower');
};

window.getScore = function(stage){
    const state = getState();
    // legacy wrapper
    const r = state.results && state.results[stage];
    return r ? r.value : (state.scores && state.scores[stage]);
};

window.resetProgress = function(){
    localStorage.removeItem('miniGamesState');
    renderStages();
    return true;
};

// Generic result storage: mode = 'lower' (time) or 'higher' (points)
window.setResult = function(stage, value, mode){
    const state = getState();
    state.results = state.results || {};
    const prev = state.results[stage];
    let accept = false;
    if (!prev) accept = true;
    else if (mode === 'lower' && value < prev.value) accept = true;
    else if (mode === 'higher' && value > prev.value) accept = true;
    if (accept) state.results[stage] = { value, mode };
    // ensure next stage unlock
    if (state.unlocked < stage + 1) state.unlocked = Math.min(STAGE_COUNT, stage + 1);
    saveState(state);
    renderStages();
};

window.getResult = function(stage){
    const state = getState();
    return state.results && state.results[stage];
};

// Theme and settings
window.getSettings = function(){
    try { return JSON.parse(localStorage.getItem('miniGamesSettings')) || { theme: 'dark', sound: true }; } catch(e){ return { theme:'dark', sound:true }; }
};

window.saveSettings = function(s){ localStorage.setItem('miniGamesSettings', JSON.stringify(s)); };

window.applyTheme = function(){
    const s = window.getSettings();
    if (s.theme === 'light') document.documentElement.classList.add('theme-light');
    else document.documentElement.classList.remove('theme-light');
};

window.toggleTheme = function(){
    const s = window.getSettings();
    s.theme = s.theme === 'dark' ? 'light' : 'dark';
    saveSettings(s); applyTheme();
};

window.toggleSound = function(){
    const s = window.getSettings(); s.sound = !s.sound; saveSettings(s); return s.sound;
};

// simple leaderboard API: returns results object
window.getLeaderboard = function(){
    const state = getState();
    return state.results || {};
};

// Export/import leaderboard (JSON)
window.exportProgress = function(){
    return localStorage.getItem('miniGamesState') || '{}';
};

window.importProgress = function(json){
    try{
        const parsed = typeof json === 'string' ? JSON.parse(json) : json;
        localStorage.setItem('miniGamesState', JSON.stringify(parsed));
        renderStages();
        return true;
    }catch(e){ return false; }
};
