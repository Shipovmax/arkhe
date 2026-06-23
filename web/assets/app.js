'use strict';

// ── API ───────────────────────────────────────────────────────────────────────

const API = '/api/v1';

const getToken  = ()  => localStorage.getItem('arkhe_token');
const setToken  = t   => localStorage.setItem('arkhe_token', t);
const clearToken = () => localStorage.removeItem('arkhe_token');

async function api(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status, data });
  return data;
}

// ── XP Math ──────────────────────────────────────────────────────────────────

function xpRequired(level) {
  return Math.round(100 * (level * level * level + 11 * level - 12) / 6);
}

function xpFillRatio(totalXP, level) {
  const lo = xpRequired(level);
  const hi = xpRequired(level + 1);
  return Math.max(0, Math.min(1, (totalXP - lo) / (hi - lo)));
}

function levelFromXP(totalXP) {
  let level = 1;
  while (xpRequired(level + 1) <= totalXP) level++;
  return level;
}

// ── Arc XP Ring ───────────────────────────────────────────────────────────────
// Semicircle: starts at 180° (left), ends at 0° (right). Centre at (100,100), r=80.
// Arc length for 180° = π * 80 ≈ 251.3

const ARC_R    = 80;
const ARC_CIRC = Math.PI * ARC_R; // half-circumference for 180° arc

function buildArcSVG(id) {
  return `
  <svg viewBox="0 0 200 110" width="200" height="110" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="arcGrad${id}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#a855f7"/>
      </linearGradient>
    </defs>
    <path class="arc-track"
      d="M20,100 A${ARC_R},${ARC_R} 0 0,1 180,100"
    />
    <path class="arc-fill" id="arc-fill-${id}"
      d="M20,100 A${ARC_R},${ARC_R} 0 0,1 180,100"
      stroke="url(#arcGrad${id})"
      stroke-dasharray="${ARC_CIRC}"
      stroke-dashoffset="${ARC_CIRC}"
    />
  </svg>`;
}

function setArcFill(id, ratio) {
  const el = document.getElementById('arc-fill-' + id);
  if (el) el.style.strokeDashoffset = ARC_CIRC * (1 - ratio);
}

// ── Particles ─────────────────────────────────────────────────────────────────

function fireXPParticles(originEl, xpAmount, targetEl) {
  const origin = originEl.getBoundingClientRect();
  const target = targetEl.getBoundingClientRect();
  const startX = origin.left + origin.width / 2;
  const startY = origin.top + origin.height / 2;
  const endX   = target.left + target.width / 2;
  const endY   = target.top  + target.height / 2;

  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'xp-particle';
    p.textContent = '+' + xpAmount + ' XP';
    document.body.appendChild(p);

    const angle = (Math.random() - 0.5) * (Math.PI / 3);
    const dist  = Math.hypot(endX - startX, endY - startY);
    const midX  = (startX + endX) / 2 + Math.sin(angle) * dist * 0.3;
    const midY  = (startY + endY) / 2 - Math.cos(angle) * dist * 0.3;

    p.style.cssText = `left:${startX}px;top:${startY}px;transform:translate(-50%,-50%);opacity:1;`;

    const duration = 650 + Math.random() * 250;
    setTimeout(() => {
      const t0 = performance.now();
      function step(now) {
        const t = Math.min(1, (now - t0) / duration);
        const e = t < 0.5 ? 2*t*t : -1 + (4-2*t)*t;
        const x = (1-e)*(1-e)*startX + 2*(1-e)*e*midX + e*e*endX;
        const y = (1-e)*(1-e)*startY + 2*(1-e)*e*midY + e*e*endY;
        p.style.left    = x + 'px';
        p.style.top     = y + 'px';
        p.style.opacity = t < 0.75 ? 1 : 1 - (t - 0.75) / 0.25;
        if (t < 1) requestAnimationFrame(step); else p.remove();
      }
      requestAnimationFrame(step);
    }, i * 50);
  }
}

// ── Level Up Overlay ──────────────────────────────────────────────────────────

function showLevelUp(newLevel) {
  const overlay = document.createElement('div');
  overlay.className = 'levelup-overlay';
  overlay.innerHTML = `
    <div class="levelup-number">${newLevel}</div>
    <div class="levelup-sub">Level Up</div>`;
  document.body.appendChild(overlay);
  document.querySelectorAll('.stat-card').forEach((c, i) =>
    setTimeout(() => { c.classList.remove('xp-pulse'); void c.offsetWidth; c.classList.add('xp-pulse'); }, 700 + i * 100));
  const dismiss = () => { overlay.style.opacity='0'; setTimeout(() => overlay.remove(), 300); };
  overlay.addEventListener('click', dismiss);
  setTimeout(dismiss, 2500);
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function showToast(icon, text) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span><span>${text}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.cssText='opacity:0;transition:opacity 300ms'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ── Validation ────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(val) {
  return EMAIL_RE.test(val.trim());
}

function showFieldError(inputEl, msg) {
  inputEl.classList.add('error');
  let errEl = inputEl.parentElement.querySelector('.field-error');
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.className = 'field-error';
    inputEl.parentElement.appendChild(errEl);
  }
  errEl.textContent = msg;
  errEl.classList.add('show');
}

function clearFieldError(inputEl) {
  inputEl.classList.remove('error');
  const errEl = inputEl.parentElement.querySelector('.field-error');
  if (errEl) errEl.classList.remove('show');
}

// ── Password Toggle ───────────────────────────────────────────────────────────

function attachPwToggle(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'pw-toggle';
  btn.textContent = '👁';
  btn.title = 'Показать/скрыть пароль';
  btn.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? '🙈' : '👁';
  });
  // Wrap input if not already wrapped
  if (!input.parentElement.classList.contains('input-wrap')) {
    const wrap = document.createElement('div');
    wrap.className = 'input-wrap';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
  }
  input.parentElement.appendChild(btn);
}

// ── State ─────────────────────────────────────────────────────────────────────

let state = { character: null, stats: [], activities: [] };

// ── App Router ────────────────────────────────────────────────────────────────

async function init() {
  if (!getToken()) { showAuth(); return; }
  try {
    const data = await api('GET', '/character');
    state.character = data;
    state.stats = data.stats || [];
  } catch (e) {
    if (e.status === 404) { showOnboarding(); return; }
    clearToken(); showAuth(); return;
  }
  const acts = await api('GET', '/activities?limit=10').catch(() => []);
  state.activities = Array.isArray(acts) ? acts : [];
  showDashboard();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

function showAuth() {
  document.getElementById('app').innerHTML = `
    <div class="auth-wrap">
      <div class="auth-card">
        <div style="text-align:center;margin-bottom:28px;">
          <div class="logo" style="font-size:28px;margin-bottom:6px;">Arkhe</div>
          <p class="text-muted" style="font-size:14px;">Превратите жизнь в RPG</p>
        </div>
        <div class="auth-tabs">
          <button class="auth-tab active" id="tab-login" onclick="switchTab('login')">Войти</button>
          <button class="auth-tab" id="tab-register" onclick="switchTab('register')">Регистрация</button>
        </div>
        <div id="auth-form"></div>
      </div>
    </div>`;
  renderLoginForm();
}

function switchTab(tab) {
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  tab === 'login' ? renderLoginForm() : renderRegisterForm();
}

function renderLoginForm() {
  document.getElementById('auth-form').innerHTML = `
    <div class="form-group">
      <label>Email</label>
      <input class="input" id="login-email" type="email" placeholder="you@example.com" autocomplete="email">
      <div class="field-error"></div>
    </div>
    <div class="form-group">
      <label>Пароль</label>
      <div class="input-wrap">
        <input class="input" id="login-password" type="password" placeholder="••••••••" autocomplete="current-password">
      </div>
    </div>
    <div id="auth-error" style="color:#ef4444;font-size:13px;margin-bottom:12px;display:none;"></div>
    <button class="btn btn-primary" style="width:100%" onclick="doLogin()">Войти</button>`;
  attachPwToggle('login-password');
}

function renderRegisterForm() {
  document.getElementById('auth-form').innerHTML = `
    <div class="form-group">
      <label>Email</label>
      <input class="input" id="reg-email" type="email" placeholder="you@example.com" autocomplete="email">
      <div class="field-error"></div>
    </div>
    <div class="form-group">
      <label>Пароль (мин. 8 символов)</label>
      <div class="input-wrap">
        <input class="input" id="reg-password" type="password" placeholder="••••••••" autocomplete="new-password">
      </div>
      <div class="field-error"></div>
    </div>
    <div id="auth-error" style="color:#ef4444;font-size:13px;margin-bottom:12px;display:none;"></div>
    <p style="font-size:12px;color:var(--text-muted);margin-bottom:14px;">После регистрации настроите персонажа</p>
    <button class="btn btn-primary" style="width:100%" onclick="doRegister()">Создать аккаунт</button>`;
  attachPwToggle('reg-password');
}

async function doLogin() {
  const emailEl = document.getElementById('login-email');
  const pwEl    = document.getElementById('login-password');
  const errEl   = document.getElementById('auth-error');
  errEl.style.display = 'none';

  let valid = true;
  if (!validateEmail(emailEl.value)) {
    showFieldError(emailEl, 'Введите корректный email');
    valid = false;
  } else clearFieldError(emailEl);

  if (!pwEl.value) {
    showFieldError(pwEl, 'Введите пароль');
    valid = false;
  } else clearFieldError(pwEl);

  if (!valid) return;

  try {
    const data = await api('POST', '/auth/login', { email: emailEl.value.trim().toLowerCase(), password: pwEl.value });
    setToken(data.token);
    if (!data.character) { showOnboarding(); return; }
    state.character = data.character;
    state.stats = data.stats || [];
    const acts = await api('GET', '/activities?limit=10').catch(() => []);
    state.activities = Array.isArray(acts) ? acts : [];
    showDashboard();
  } catch (e) {
    errEl.textContent = e.status === 401 ? 'Неверный email или пароль' : (e.data?.error || 'Ошибка входа');
    errEl.style.display = 'block';
  }
}

async function doRegister() {
  const emailEl = document.getElementById('reg-email');
  const pwEl    = document.getElementById('reg-password');
  const errEl   = document.getElementById('auth-error');
  errEl.style.display = 'none';

  let valid = true;
  if (!validateEmail(emailEl.value)) {
    showFieldError(emailEl, 'Введите корректный email');
    valid = false;
  } else clearFieldError(emailEl);

  if (pwEl.value.length < 8) {
    showFieldError(pwEl, 'Минимум 8 символов');
    valid = false;
  } else clearFieldError(pwEl);

  if (!valid) return;

  window._pendingAuth = { email: emailEl.value.trim().toLowerCase(), password: pwEl.value };
  showOnboarding();
}

// ── Onboarding ────────────────────────────────────────────────────────────────

let ob = { step: 1, class: null, stats: [], displayName: '' };

const PRESET_STATS = [
  { name: 'Физическая форма',  icon: '💪' },
  { name: 'Умственное развитие', icon: '🧠' },
  { name: 'Дисциплина',        icon: '🎯' },
  { name: 'Начитанность',      icon: '📚' },
  { name: 'Социальные навыки', icon: '🤝' },
];

function showOnboarding() {
  ob = { step: 1, class: null, stats: [], displayName: '' };
  document.getElementById('app').innerHTML = `
    <div class="onboarding-wrap">
      <div class="onboarding-card">
        <div class="step-indicator">
          <div class="step-dot active" id="dot-1"></div>
          <div class="step-dot" id="dot-2"></div>
          <div class="step-dot" id="dot-3"></div>
        </div>
        <div id="ob-content"></div>
      </div>
    </div>`;
  renderObStep();
}

function renderObStep() {
  [1,2,3].forEach(i => document.getElementById('dot-'+i).classList.toggle('active', i <= ob.step));
  const el = document.getElementById('ob-content');

  if (ob.step === 1) {
    el.innerHTML = `
      <h3 style="margin-bottom:6px;">Выбери класс</h3>
      <p class="text-muted" style="font-size:14px;margin-bottom:4px;">Это тематика твоего персонажа</p>
      <div class="class-grid">
        <div class="class-card ${ob.class==='student'?'selected':''}" onclick="selClass('student')">
          <div class="class-icon">🎓</div><div class="class-name">Студент</div>
          <div class="class-desc">Прокачиваю себя в универе</div>
        </div>
        <div class="class-card ${ob.class==='worker'?'selected':''}" onclick="selClass('worker')">
          <div class="class-icon">💼</div><div class="class-name">Работяга</div>
          <div class="class-desc">Расту профессионально</div>
        </div>
        <div class="class-card ${ob.class==='schoolkid'?'selected':''}" onclick="selClass('schoolkid')">
          <div class="class-icon">📖</div><div class="class-name">Школьник</div>
          <div class="class-desc">Учусь и развиваюсь</div>
        </div>
      </div>
      <button class="btn btn-primary" style="width:100%" onclick="nextObStep()" ${!ob.class?'disabled':''}>Далее →</button>`;

  } else if (ob.step === 2) {
    const chips = PRESET_STATS.map(s => {
      const sel = ob.stats.find(x => x.name === s.name);
      return `<div class="stat-chip ${sel?'selected':''}" onclick="toggleStat('${s.name}','${s.icon}')">
        <span>${s.icon}</span><span>${s.name}</span>
        ${sel ? `<span style="font-size:11px;color:var(--text-muted);margin-left:4px;">
          · раз в <input type="number" min="1" max="30" value="${sel.freq||1}"
            style="width:32px;background:var(--surface);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:1px 4px;font-size:11px;"
            onclick="event.stopPropagation()" onchange="setFreq('${s.name}',this.value)"> дн.
        </span>` : ''}
      </div>`;
    }).join('');
    const cnt = ob.stats.length;
    el.innerHTML = `
      <h3 style="margin-bottom:6px;">Выбери статы</h3>
      <p class="text-muted" style="font-size:14px;margin-bottom:4px;">3–5 направлений. Укажи как часто планируешь заниматься.</p>
      <div class="stat-options">${chips}</div>
      <button class="btn btn-primary" style="width:100%;margin-top:12px" onclick="nextObStep()" ${cnt<3||cnt>5?'disabled':''}>Далее →</button>`;

  } else {
    el.innerHTML = `
      <h3 style="margin-bottom:6px;">Как тебя зовут?</h3>
      <p class="text-muted" style="font-size:14px;margin-bottom:16px;">Имя персонажа на дашборде</p>
      <div class="form-group">
        <label>Имя персонажа</label>
        <input class="input" id="ob-name" type="text" placeholder="Например: Иван" maxlength="40"
          value="${esc(ob.displayName)}" oninput="ob.displayName=this.value">
      </div>
      <div id="ob-error" style="color:#ef4444;font-size:13px;margin-bottom:12px;display:none;"></div>
      <button class="btn btn-primary" style="width:100%;margin-top:4px" onclick="finishOb()">Начать прокачку 🚀</button>`;
    setTimeout(() => document.getElementById('ob-name')?.focus(), 50);
  }
}

function selClass(cls) { ob.class = cls; renderObStep(); }

function toggleStat(name, icon) {
  const idx = ob.stats.findIndex(s => s.name === name);
  if (idx >= 0) ob.stats.splice(idx, 1);
  else if (ob.stats.length < 5) ob.stats.push({ name, icon, freq: 1 });
  renderObStep();
}

function setFreq(name, val) {
  const s = ob.stats.find(x => x.name === name);
  if (s) s.freq = Math.max(1, parseInt(val) || 1);
}

function nextObStep() { if (ob.step < 3) { ob.step++; renderObStep(); } }

async function finishOb() {
  const name = (document.getElementById('ob-name')?.value || ob.displayName).trim();
  const errEl = document.getElementById('ob-error');
  errEl.style.display = 'none';
  if (!name) { errEl.textContent = 'Введи имя'; errEl.style.display = 'block'; return; }

  const statsPayload = ob.stats.map(s => ({ name: s.name, icon: s.icon, frequency_days: s.freq || 1 }));
  const pending = window._pendingAuth;

  if (pending && !getToken()) {
    try {
      const data = await api('POST', '/auth/register', {
        email: pending.email,
        password: pending.password,
        display_name: name,
        class: ob.class,
        stats: statsPayload,
      });
      setToken(data.token);
      window._pendingAuth = null;
      state.character = data.character;
      state.stats = data.stats || [];
      state.activities = [];
      showDashboard();
    } catch (e) {
      errEl.textContent = e.data?.error || 'Ошибка регистрации';
      errEl.style.display = 'block';
    }
    return;
  }

  // Logged-in user who skipped onboarding
  try {
    const data = await api('POST', '/character', { display_name: name, class: ob.class, stats: statsPayload });
    state.character = data.character;
    state.stats = data.stats || [];
    state.activities = [];
    showDashboard();
  } catch (e) {
    errEl.textContent = e.data?.error || 'Ошибка создания персонажа';
    errEl.style.display = 'block';
  }
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function showDashboard() {
  const c = state.character;
  if (!c) { showOnboarding(); return; }

  const totalXP = state.stats.reduce((s, x) => s + (x.stat_xp || 0), 0);
  const level   = levelFromXP(totalXP);
  const xpNext  = xpRequired(level + 1) - totalXP;

  document.getElementById('app').innerHTML = `
    <div class="container" style="padding-bottom:48px;">
      <div style="padding:32px 0 24px;animation:fadeIn 300ms ease both;">
        <div class="char-panel">
          <span class="class-badge" style="margin-bottom:12px;">${esc(c.class)}</span>
          <div id="arc-ring" class="arc-ring-wrap">
            ${buildArcSVG('main')}
            <div class="arc-center">
              <div class="arc-level" id="arc-level">${level}</div>
              <div class="arc-label">уровень</div>
            </div>
          </div>
          <div class="char-name char-name-btn" id="char-name-btn" onclick="toggleUserMenu(event)" style="margin-top:16px;">
            ${esc(c.display_name)} <span style="font-size:14px;color:var(--text-muted);">▾</span>
          </div>
          <div class="streak-inline" id="streak-inline">🔥 <span id="streak-val">—</span> дней стрика</div>
          <div class="char-xp-label" id="xp-label">
            ${totalXP.toLocaleString()} XP · до Lv.${level+1}: ${xpNext.toLocaleString()} XP
          </div>
        </div>
        <div class="user-menu" id="user-menu">
          <div class="user-menu-item disabled">
            <span>💎</span><span>Подписка <span style="font-size:11px;color:var(--text-muted);">(скоро)</span></span>
          </div>
          <div class="user-menu-divider"></div>
          <div class="user-menu-item danger" onclick="doLogout()">
            <span>→</span><span>Выйти</span>
          </div>
        </div>
      </div>

      <div class="stats-grid" id="stats-grid" style="animation:fadeIn 300ms ease 150ms both"></div>

      <div class="activity-feed" style="animation:fadeIn 300ms ease 300ms both">
        <h3 style="margin-bottom:16px;">Последние активности</h3>
        <div id="activity-list"></div>
      </div>
    </div>`;

  // Animate arc after paint
  requestAnimationFrame(() => {
    setTimeout(() => setArcFill('main', xpFillRatio(totalXP, level)), 200);
  });

  renderStatCards();
  renderActivities();
  loadStreak();
}

function renderStatCards() {
  const grid = document.getElementById('stats-grid');
  if (!grid) return;
  grid.innerHTML = state.stats.map((s, i) => {
    const fill   = xpFillRatio(s.stat_xp || 0, s.stat_level || 1);
    const xpNext = xpRequired((s.stat_level || 1) + 1) - (s.stat_xp || 0);
    return `
    <div class="stat-card" id="sc-${s.id}" style="animation-delay:${i*80}ms">
      <div class="stat-header">
        <div class="stat-icon-name"><span>${s.icon}</span><span>${esc(s.name)}</span></div>
        <span class="stat-level-badge">Lv.${s.stat_level||1}</span>
      </div>
      <div class="stat-meta">🔥 Стрик: ${s.stat_streak||0} · раз в ${s.frequency_days||1} дн.</div>
      <div class="xp-bar-wrap">
        <div class="xp-bar-fill" style="width:${(fill*100).toFixed(1)}%"></div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:4px;font-variant-numeric:tabular-nums">
        до Lv.${(s.stat_level||1)+1}: ${xpNext} XP
      </div>
      <button class="btn-log" id="bl-${s.id}" onclick="openLogModal('${s.id}','${esc(s.name)}','${s.icon}')">
        + Записать
      </button>
    </div>`;
  }).join('') || '<p class="text-muted" style="font-size:14px;">Нет статов.</p>';
}

function renderActivities() {
  const el = document.getElementById('activity-list');
  if (!el) return;
  if (!state.activities.length) {
    el.innerHTML = '<p class="text-muted" style="font-size:14px;padding:16px 0;">Активностей пока нет. Запиши первую!</p>';
    return;
  }
  el.innerHTML = state.activities.slice(0, 10).map(a => `
    <div class="activity-item">
      <div class="activity-icon">${a.stat_icon||'⚡'}</div>
      <div style="flex:1">
        <div class="activity-desc">${esc(a.description)}</div>
        <div class="activity-stat">${esc(a.stat_name)}</div>
      </div>
      <div class="activity-xp">+${a.xp_earned} XP</div>
    </div>`).join('');
}

async function loadStreak() {
  try {
    const d = await api('GET', '/analytics/summary');
    const el = document.getElementById('streak-val');
    if (el) el.textContent = d.current_streak || 0;
  } catch {}
}

function toggleUserMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('user-menu');
  if (!menu) return;
  const open = menu.classList.toggle('open');
  if (open) {
    const btn = document.getElementById('char-name-btn');
    const rect = btn.getBoundingClientRect();
    menu.style.top  = (rect.bottom + 8) + 'px';
    menu.style.left = rect.left + 'px';
    setTimeout(() => document.addEventListener('click', closeUserMenu, { once: true }), 0);
  }
}

function closeUserMenu() {
  document.getElementById('user-menu')?.classList.remove('open');
}

function doLogout() {
  clearToken();
  state = { character: null, stats: [], activities: [] };
  showAuth();
}

// ── Log Modal ─────────────────────────────────────────────────────────────────

let logCtx = { statID: null, statName: '', statIcon: '' };

function openLogModal(statID, statName, statIcon) {
  logCtx = { statID, statName, statIcon };
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'log-modal';
  backdrop.innerHTML = `
    <div class="modal">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
        <h3>${statIcon} ${esc(statName)}</h3>
        <button onclick="closeLogModal()" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer;line-height:1;">✕</button>
      </div>
      <div class="form-group">
        <label>Что сделал?</label>
        <input class="input" id="log-desc" type="text" placeholder="Описание активности..." maxlength="280"
          oninput="updateLogBtn()">
      </div>
      <div id="log-err" style="color:#ef4444;font-size:13px;margin-bottom:12px;display:none;"></div>
      <button class="btn btn-primary" style="width:100%" id="log-btn" onclick="submitLog()" disabled>
        Записать
      </button>
    </div>`;
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeLogModal(); });
  document.body.appendChild(backdrop);
  requestAnimationFrame(() => backdrop.classList.add('open'));
  setTimeout(() => document.getElementById('log-desc')?.focus(), 50);
}

function updateLogBtn() {
  const btn = document.getElementById('log-btn');
  const val = document.getElementById('log-desc')?.value.trim();
  if (btn) btn.disabled = !val;
}

function closeLogModal() {
  const el = document.getElementById('log-modal');
  if (!el) return;
  el.classList.add('closing');
  setTimeout(() => el.remove(), 150);
}

async function submitLog() {
  const desc = document.getElementById('log-desc')?.value.trim();
  if (!desc) return;
  const btn = document.getElementById('log-btn');
  const errEl = document.getElementById('log-err');
  btn.disabled = true;
  btn.textContent = '...';
  errEl.style.display = 'none';

  try {
    const result = await api('POST', '/activities', { stat_id: logCtx.statID, description: desc });
    closeLogModal();

    // Patch activity with stat info (server returns stat_name/stat_icon in the activity object)
    state.activities.unshift(result.activity);

    // Patch stat in state
    const si = state.stats.findIndex(s => s.id === logCtx.statID);
    if (si >= 0) {
      state.stats[si].stat_xp     = result.stat_xp;
      state.stats[si].stat_level  = result.stat_level;
      state.stats[si].stat_streak = result.stat_streak;
    }
    if (state.character) state.character.level = result.character_level;

    // Particles → arc ring
    const originBtn = document.getElementById('bl-' + logCtx.statID);
    const arcRing   = document.getElementById('arc-ring');
    if (originBtn && arcRing) fireXPParticles(originBtn, result.xp_earned, arcRing);

    // Stat card pulse
    const card = document.getElementById('sc-' + logCtx.statID);
    if (card) { card.classList.remove('xp-pulse'); void card.offsetWidth; card.classList.add('xp-pulse'); }

    // Level up
    if (result.character_level_up) setTimeout(() => showLevelUp(result.character_level), 800);
    if (result.stat_level_up) showToast('⬆️', `${logCtx.statName} вырос до Lv.${result.stat_level}!`);
    (result.achievements_unlocked || []).forEach((a, i) =>
      setTimeout(() => showToast(a.icon, `Достижение: ${a.title}`), i * 400));

    // Update arc
    const totalXP = state.stats.reduce((s, x) => s + (x.stat_xp || 0), 0);
    const level   = levelFromXP(totalXP);
    if (state.character) state.character.level = level;

    const arcLevelEl = document.getElementById('arc-level');
    if (arcLevelEl) arcLevelEl.textContent = level;

    const xpNext = xpRequired(level + 1) - totalXP;
    const lbl = document.getElementById('xp-label');
    if (lbl) lbl.textContent = `${totalXP.toLocaleString()} XP · до Lv.${level+1}: ${xpNext.toLocaleString()} XP`;

    if (result.character_level_up) {
      // Reset arc to 0 instantly, then animate to new fill
      setArcFill('main', 0);
      setTimeout(() => setArcFill('main', xpFillRatio(totalXP, level)), 50);
    } else {
      setArcFill('main', xpFillRatio(totalXP, level));
    }

    renderStatCards();
    renderActivities();

  } catch (e) {
    btn.disabled = false;
    btn.textContent = 'Записать';
    errEl.textContent = e.data?.error || 'Ошибка. Попробуй снова.';
    errEl.style.display = 'block';
  }
}

// ── Utils ─────────────────────────────────────────────────────────────────────

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Boot ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);
