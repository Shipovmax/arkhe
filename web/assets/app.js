'use strict';

// ── i18n ──────────────────────────────────────────────────────────────────────

const LANG_KEY = 'arkhe_lang';

const I18N = {
  ru: {
    tagline:        'Прокачивай реальную жизнь как RPG.<br>Тренировки, чтение, работа — всё приносит XP.<br>Расти в уровнях. <strong>Не сдавайся.</strong>',
    login:          'Войти',
    register:       'Регистрация',
    email:          'Email',
    password:       'Пароль (мин. 8 символов)',
    create_account: 'Создать аккаунт',
    after_reg:      'После регистрации настроите персонажа',
    choose_class:   'Выбери класс',
    class_hint:     'Это тематика твоего персонажа',
    student:        'Студент', student_desc: 'Прокачиваю себя в универе',
    worker:         'Работяга', worker_desc: 'Расту профессионально',
    schoolkid:      'Школьник', schoolkid_desc: 'Учусь и развиваюсь',
    choose_stats:   'Выбери навыки',
    stats_hint:     '3–5 направлений. Нажми — выбери конкретно что делаешь.',
    next:           'Далее →',
    whats_your_name:'Как тебя зовут?',
    name_hint:      'Имя персонажа на дашборде',
    char_name:      'Имя персонажа',
    start_btn:      'Начать прокачку 🚀',
    level:          'уровень',
    streak_days:    'дней стрика',
    last_activities:'Последние активности',
    no_activities:  'Активностей пока нет. Запиши первую!',
    no_stats:       'Нет навыков. Добавь первый!',
    add_stat:       '+ Добавить навык',
    subscription:   'Подписка',
    soon:           'скоро',
    logout:         'Выйти',
    new_stat:       'Новый навык',
    choose_dir:     'Выбери направление:',
    what_you_do:    'Конкретно что делаешь:',
    frequency:      'Частота:',
    times_per:      'раз в',
    day:            'день', days_2_4: 'дня', days_5: 'дней',
    add_stat_btn:   'Добавить навык',
    what_did_you_do:'Что сделал?',
    desc_placeholder:'Описание активности...',
    write_btn:      'Записать активность',
    xp_30:         'XP за 30 дней',
    xp_total:      'XP суммарно',
    export_csv:    '↓ CSV',
    achievements:  'Достижения',
    locked:        'Заблокировано',
    del_confirm:   (name) => `Удалить навык «${name}»? Все активности по нему останутся в истории.`,
    max_stats:     'Максимум 5 навыков на Free плане',
    stat_added:    (name) => `Навык «${name}» добавлен!`,
    stat_deleted:  (name) => `«${name}» удалён`,
    level_up:           'Level Up',
    achievement:        'Достижение',
    achievement_unlocked: 'Достижение разблокировано',
    stat_leveled:  (name, lv) => `${name} вырос до Lv.${lv}!`,
    period_block:  'Ты уже сделал это сегодня — отлично! Возвращайся в следующем периоде 💪',
    err_try_again: 'Ошибка. Попробуй снова.',
    per_day_str:   (n) => `раз в ${n} ${n===1?'день':n<5?'дня':'дней'}`,
    streak_label:  (n) => `🔥 Стрик: ${n}`,
    freq_label:    (n) => `раз в ${n} дн.`,
    to_level:      (lv, xp) => `до Lv.${lv}: ${xp} XP`,
    xp_label:      (xp, lv, xpNext) => `${xp.toLocaleString()} XP · до Lv.${lv}: ${xpNext.toLocaleString()} XP`,
    show_more:     'Показать ещё',
    cancel:        'Отмена',
    delete_btn:    'Удалить',
    delete_skill:  'Удалить навык?',
    show_pw:       'Показать/скрыть пароль',
    email_error:   'Введите корректный email',
    password_error:'Введите пароль',
    password_min:  'Минимум 8 символов',
    name_error:    'Введи имя',
    wrong_creds:   'Неверный email или пароль',
    err_login:     'Ошибка входа',
    err_register:  'Ошибка регистрации',
    err_create_char:'Ошибка создания персонажа',
    err_add:       'Ошибка добавления',
    err_delete:    'Не удалось удалить',
    err_export:    'Ошибка экспорта',
    csv_date:      'Дата',
    csv_xp_day:    'XP за день',
    csv_skill:     'Навык',
    csv_desc:      'Описание',
    theme_light:      'Светлая тема',
    theme_dark:       'Тёмная тема',
    push_enable:      '🔔 Включить уведомления',
    push_disable:     '🔕 Выключить уведомления',
    push_denied:      'Уведомления заблокированы в браузере',
    push_unsupported: 'Браузер не поддерживает уведомления',
  },
  en: {
    tagline:        'Level up your real life like an RPG.<br>Workouts, reading, work — everything earns XP.<br>Rise in levels. <strong>Don\'t quit.</strong>',
    login:          'Log in',
    register:       'Sign up',
    email:          'Email',
    password:       'Password (min. 8 characters)',
    create_account: 'Create account',
    after_reg:      'You\'ll set up your character after signing up',
    choose_class:   'Choose a class',
    class_hint:     'This is the theme of your character',
    student:        'Student', student_desc: 'Leveling up at uni',
    worker:         'Worker', worker_desc: 'Growing professionally',
    schoolkid:      'Schoolkid', schoolkid_desc: 'Learning and growing',
    choose_stats:   'Choose skills',
    stats_hint:     '3–5 areas. Tap to pick what you actually do.',
    next:           'Next →',
    whats_your_name:'What\'s your name?',
    name_hint:      'Character name on the dashboard',
    char_name:      'Character name',
    start_btn:      'Start leveling up 🚀',
    level:          'level',
    streak_days:    'day streak',
    last_activities:'Recent activities',
    no_activities:  'No activities yet. Log your first!',
    no_stats:       'No skills yet. Add your first!',
    add_stat:       '+ Add skill',
    subscription:   'Subscription',
    soon:           'soon',
    logout:         'Log out',
    new_stat:       'New skill',
    choose_dir:     'Choose a direction:',
    what_you_do:    'What specifically do you do:',
    frequency:      'Frequency:',
    times_per:      'every',
    day:            'day', days_2_4: 'days', days_5: 'days',
    add_stat_btn:   'Add skill',
    what_did_you_do:'What did you do?',
    desc_placeholder:'Activity description...',
    write_btn:      'Log activity',
    xp_30:         'XP over 30 days',
    xp_total:      'XP total',
    export_csv:    '↓ CSV',
    achievements:  'Achievements',
    locked:        'Locked',
    del_confirm:   (name) => `Delete skill «${name}»? All logged activities will remain in history.`,
    max_stats:     'Maximum 5 skills on the Free plan',
    stat_added:    (name) => `Skill «${name}» added!`,
    stat_deleted:  (name) => `«${name}» deleted`,
    level_up:           'Level Up',
    achievement:        'Achievement',
    achievement_unlocked: 'Achievement Unlocked',
    stat_leveled:  (name, lv) => `${name} reached Lv.${lv}!`,
    period_block:  'You already crushed it today — nice! Come back next period 💪',
    err_try_again: 'Error. Please try again.',
    per_day_str:   (n) => `every ${n} ${n===1?'day':'days'}`,
    streak_label:  (n) => `🔥 Streak: ${n}`,
    freq_label:    (n) => `every ${n} day${n===1?'':'s'}`,
    to_level:      (lv, xp) => `to Lv.${lv}: ${xp} XP`,
    xp_label:      (xp, lv, xpNext) => `${xp.toLocaleString()} XP · to Lv.${lv}: ${xpNext.toLocaleString()} XP`,
    show_more:     'Show more',
    cancel:        'Cancel',
    delete_btn:    'Delete',
    delete_skill:  'Delete skill?',
    show_pw:       'Show/hide password',
    email_error:   'Enter a valid email',
    password_error:'Enter your password',
    password_min:  'At least 8 characters',
    name_error:    'Enter a name',
    wrong_creds:   'Invalid email or password',
    err_login:     'Login failed',
    err_register:  'Registration failed',
    err_create_char:'Failed to create character',
    err_add:       'Failed to add skill',
    err_delete:    'Failed to delete',
    err_export:    'Export failed',
    csv_date:      'Date',
    csv_xp_day:    'XP per day',
    csv_skill:     'Skill',
    csv_desc:      'Description',
    theme_light:      'Light theme',
    theme_dark:       'Dark theme',
    push_enable:      '🔔 Enable notifications',
    push_disable:     '🔕 Disable notifications',
    push_denied:      'Notifications blocked in browser settings',
    push_unsupported: 'Browser does not support notifications',
  },
};

function getLang() {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored === 'ru' || stored === 'en') return stored;
  return navigator.language?.startsWith('ru') ? 'ru' : 'en';
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
}

function t(key, ...args) {
  const lang = getLang();
  const val = I18N[lang]?.[key] ?? I18N.ru[key] ?? key;
  return typeof val === 'function' ? val(...args) : val;
}

function renderLangSwitcher() {
  const lang = getLang();
  return `<button class="lang-btn" onclick="toggleLang()" title="Switch language">${lang === 'ru' ? 'EN' : 'RU'}</button>`;
}

function toggleLang() {
  setLang(getLang() === 'ru' ? 'en' : 'ru');
  init();
}

// ── Theme ─────────────────────────────────────────────────────────────────────

const THEME_KEY = 'arkhe_theme';

function getTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.classList.toggle('light', theme === 'light');
}

function toggleTheme() {
  applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  init();
}

// ── API ───────────────────────────────────────────────────────────────────────

const API = '/api/v1';

const getToken   = ()  => localStorage.getItem('arkhe_token');
const setToken   = t   => localStorage.setItem('arkhe_token', t);
const clearToken = ()  => localStorage.removeItem('arkhe_token');

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

const ARC_R    = 80;
const ARC_CIRC = Math.PI * ARC_R;

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
    <div class="levelup-sub">${t('level_up')}</div>`;
  document.body.appendChild(overlay);
  document.querySelectorAll('.stat-card').forEach((c, i) =>
    setTimeout(() => { c.classList.remove('xp-pulse'); void c.offsetWidth; c.classList.add('xp-pulse'); }, 700 + i * 100));
  const dismiss = () => { overlay.style.opacity='0'; setTimeout(() => overlay.remove(), 300); };
  overlay.addEventListener('click', dismiss);
  setTimeout(dismiss, 2500);
}

// ── Achievement Overlay ───────────────────────────────────────────────────────

function showAchievementOverlay(a, delay) {
  setTimeout(() => {
    const overlay = document.createElement('div');
    overlay.className = 'levelup-overlay achievement-overlay';
    overlay.innerHTML = `
      <div class="achievement-overlay-icon">${a.icon}</div>
      <div class="achievement-overlay-label">${t('achievement_unlocked')}</div>
      <div class="achievement-overlay-title">${esc(a.title)}</div>
      <div class="achievement-overlay-desc">${esc(a.description)}</div>`;
    document.body.appendChild(overlay);
    const dismiss = () => { overlay.style.opacity='0'; setTimeout(() => overlay.remove(), 300); };
    overlay.addEventListener('click', dismiss);
    setTimeout(dismiss, 3000);
  }, delay);
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
  btn.title = t('show_pw');
  btn.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? '🙈' : '👁';
  });
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
          <div style="display:flex;justify-content:flex-end;margin-bottom:8px;">${renderLangSwitcher()}</div>
          <div class="logo" style="font-size:28px;margin-bottom:6px;">Arkhe</div>
          <p class="text-muted" style="font-size:14px;">${t('tagline')}</p>
        </div>
        <div class="auth-tabs">
          <button class="auth-tab active" id="tab-login" onclick="switchTab('login')">${t('login')}</button>
          <button class="auth-tab" id="tab-register" onclick="switchTab('register')">${t('register')}</button>
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
      <label>${t('password')}</label>
      <div class="input-wrap">
        <input class="input" id="login-password" type="password" placeholder="••••••••" autocomplete="current-password">
      </div>
    </div>
    <div id="auth-error" style="color:#ef4444;font-size:13px;margin-bottom:12px;display:none;"></div>
    <button class="btn btn-primary" style="width:100%" onclick="doLogin()">${t('login')}</button>`;
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
      <label>${t('password')}</label>
      <div class="input-wrap">
        <input class="input" id="reg-password" type="password" placeholder="••••••••" autocomplete="new-password">
      </div>
      <div class="field-error"></div>
    </div>
    <div id="auth-error" style="color:#ef4444;font-size:13px;margin-bottom:12px;display:none;"></div>
    <p style="font-size:12px;color:var(--text-muted);margin-bottom:14px;">${t('after_reg')}</p>
    <button class="btn btn-primary" style="width:100%" onclick="doRegister()">${t('create_account')}</button>`;
  attachPwToggle('reg-password');
}

async function doLogin() {
  const emailEl = document.getElementById('login-email');
  const pwEl    = document.getElementById('login-password');
  const errEl   = document.getElementById('auth-error');
  errEl.style.display = 'none';

  let valid = true;
  if (!validateEmail(emailEl.value)) {
    showFieldError(emailEl, t('email_error'));
    valid = false;
  } else clearFieldError(emailEl);

  if (!pwEl.value) {
    showFieldError(pwEl, t('password_error'));
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
    errEl.textContent = e.status === 401 ? t('wrong_creds') : (e.data?.error || t('err_login'));
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
    showFieldError(emailEl, t('email_error'));
    valid = false;
  } else clearFieldError(emailEl);

  if (pwEl.value.length < 8) {
    showFieldError(pwEl, t('password_min'));
    valid = false;
  } else clearFieldError(pwEl);

  if (!valid) return;

  window._pendingAuth = { email: emailEl.value.trim().toLowerCase(), password: pwEl.value };
  showOnboarding();
}

// ── Onboarding ────────────────────────────────────────────────────────────────

let ob = { step: 1, class: null, stats: [], displayName: '' };

// Категории с подкатегориями
const STAT_CATEGORIES_RU = [
  {
    name: 'Физическая форма', icon: '💪',
    subs: [
      { name: 'Зал', icon: '🏋️' },
      { name: 'Бег', icon: '🏃' },
      { name: 'Йога', icon: '🧘' },
      { name: 'Велосипед', icon: '🚴' },
      { name: 'Плавание', icon: '🏊' },
    ],
  },
  {
    name: 'Умственное развитие', icon: '🧠',
    subs: [
      { name: 'Курс / обучение', icon: '🎓' },
      { name: 'Изучение языка', icon: '🗣️' },
      { name: 'Решение задач', icon: '🧩' },
      { name: 'Медитация', icon: '🪷' },
    ],
  },
  {
    name: 'Дисциплина', icon: '🎯',
    subs: [
      { name: 'Ранний подъём', icon: '🌅' },
      { name: 'Без соцсетей', icon: '📵' },
      { name: 'Планирование дня', icon: '📋' },
      { name: 'Холодный душ', icon: '🚿' },
    ],
  },
  {
    name: 'Начитанность', icon: '📚',
    subs: [
      { name: 'Книга', icon: '📖' },
      { name: 'Статья / блог', icon: '📰' },
      { name: 'Подкаст', icon: '🎙️' },
      { name: 'Научная статья', icon: '🔬' },
    ],
  },
  {
    name: 'Социальные навыки', icon: '🤝',
    subs: [
      { name: 'Нетворкинг', icon: '🌐' },
      { name: 'Выступление', icon: '🎤' },
      { name: 'Помощь другому', icon: '🫂' },
      { name: 'Новое знакомство', icon: '👋' },
    ],
  },
];

const STAT_CATEGORIES_EN = [
  {
    name: 'Physical fitness', icon: '💪',
    subs: [
      { name: 'Gym', icon: '🏋️' },
      { name: 'Running', icon: '🏃' },
      { name: 'Yoga', icon: '🧘' },
      { name: 'Cycling', icon: '🚴' },
      { name: 'Swimming', icon: '🏊' },
    ],
  },
  {
    name: 'Mental development', icon: '🧠',
    subs: [
      { name: 'Course / learning', icon: '🎓' },
      { name: 'Language study', icon: '🗣️' },
      { name: 'Problem solving', icon: '🧩' },
      { name: 'Meditation', icon: '🪷' },
    ],
  },
  {
    name: 'Discipline', icon: '🎯',
    subs: [
      { name: 'Early rise', icon: '🌅' },
      { name: 'No social media', icon: '📵' },
      { name: 'Day planning', icon: '📋' },
      { name: 'Cold shower', icon: '🚿' },
    ],
  },
  {
    name: 'Reading & learning', icon: '📚',
    subs: [
      { name: 'Book', icon: '📖' },
      { name: 'Article / blog', icon: '📰' },
      { name: 'Podcast', icon: '🎙️' },
      { name: 'Research paper', icon: '🔬' },
    ],
  },
  {
    name: 'Social skills', icon: '🤝',
    subs: [
      { name: 'Networking', icon: '🌐' },
      { name: 'Public speaking', icon: '🎤' },
      { name: 'Helping others', icon: '🫂' },
      { name: 'New acquaintance', icon: '👋' },
    ],
  },
];

function getStatCategories() {
  return getLang() === 'en' ? STAT_CATEGORIES_EN : STAT_CATEGORIES_RU;
}

// Состояние пузырьков (какая категория раскрыта)
let ob_openCategory = null;

function showOnboarding() {
  ob = { step: 1, class: null, stats: [], displayName: '' };
  ob_openCategory = null;
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
      <div style="display:flex;justify-content:flex-end;margin-bottom:8px;">${renderLangSwitcher()}</div>
      <h3 style="margin-bottom:6px;">${t('choose_class')}</h3>
      <p class="text-muted" style="font-size:14px;margin-bottom:4px;">${t('class_hint')}</p>
      <div class="class-grid">
        <div class="class-card ${ob.class==='student'?'selected':''}" onclick="selClass('student')">
          <div class="class-icon">🎓</div>
          <div><div class="class-name">${t('student')}</div><div class="class-desc">${t('student_desc')}</div></div>
        </div>
        <div class="class-card ${ob.class==='worker'?'selected':''}" onclick="selClass('worker')">
          <div class="class-icon">💼</div>
          <div><div class="class-name">${t('worker')}</div><div class="class-desc">${t('worker_desc')}</div></div>
        </div>
        <div class="class-card ${ob.class==='schoolkid'?'selected':''}" onclick="selClass('schoolkid')">
          <div class="class-icon">📖</div>
          <div><div class="class-name">${t('schoolkid')}</div><div class="class-desc">${t('schoolkid_desc')}</div></div>
        </div>
      </div>
      <button class="btn btn-primary" style="width:100%" onclick="nextObStep()" ${!ob.class?'disabled':''}>${t('next')}</button>`;

  } else if (ob.step === 2) {
    const cnt = ob.stats.length;
    const chips = getStatCategories().map(cat => {
      const sel = ob.stats.find(x => x.category === cat.name);
      const isOpen = ob_openCategory === cat.name;
      const bubbles = isOpen ? cat.subs.map(sub => `
        <div class="sub-bubble ${sel && sel.name === sub.name ? 'selected' : ''}"
             onclick="selectSub('${esc(cat.name)}','${esc(cat.icon)}','${esc(sub.name)}','${esc(sub.icon)}');event.stopPropagation()">
          <span>${sub.icon}</span><span>${esc(sub.name)}</span>
        </div>`).join('') : '';

      return `
        <div class="stat-chip-wrap">
          <div class="stat-chip ${sel?'selected':''} ${isOpen?'open':''}"
               onclick="toggleCategory('${esc(cat.name)}')">
            <span>${sel ? sel.icon : cat.icon}</span>
            <span>${sel ? esc(sel.name) : esc(cat.name)}</span>
            ${sel ? `<span class="chip-check">✓</span>` : `<span class="chip-arrow">${isOpen?'▴':'▾'}</span>`}
          </div>
          ${isOpen ? `<div class="sub-bubbles">${bubbles}</div>` : ''}
        </div>`;
    }).join('');

    // Frequency picker for selected stats
    const freqPickers = ob.stats.map(s => `
      <div class="freq-picker-row">
        <span>${s.icon} ${esc(s.name)}</span>
        <div class="freq-picker">
          <button class="freq-btn" onclick="changeFreq('${esc(s.category)}', -1)" ${s.freq<=1?'disabled':''}>−</button>
          <div class="freq-num" id="freq-${esc(s.category).replace(/\s/g,'_')}">${s.freq}</div>
          <button class="freq-btn" onclick="changeFreq('${esc(s.category)}', 1)" ${s.freq>=30?'disabled':''}>+</button>
          <span class="freq-label">${t('per_day_str', s.freq)}</span>
        </div>
      </div>`).join('');

    el.innerHTML = `
      <h3 style="margin-bottom:6px;">${t('choose_stats')}</h3>
      <p class="text-muted" style="font-size:14px;margin-bottom:16px;">${t('stats_hint')}</p>
      <div class="stat-options">${chips}</div>
      ${ob.stats.length ? `<div class="freq-pickers" style="margin-top:16px;">${freqPickers}</div>` : ''}
      <button class="btn btn-primary" style="width:100%;margin-top:16px" onclick="nextObStep()" ${cnt<3||cnt>5?'disabled':''}>
        ${t('next')} ${cnt>0?`(${cnt}/5)`:''}
      </button>`;

  } else {
    el.innerHTML = `
      <h3 style="margin-bottom:6px;">${t('whats_your_name')}</h3>
      <p class="text-muted" style="font-size:14px;margin-bottom:16px;">${t('name_hint')}</p>
      <div class="form-group">
        <label>${t('char_name')}</label>
        <input class="input" id="ob-name" type="text" placeholder="Например: Иван" maxlength="40"
          value="${esc(ob.displayName)}" oninput="ob.displayName=this.value">
      </div>
      <div id="ob-error" style="color:#ef4444;font-size:13px;margin-bottom:12px;display:none;"></div>
      <button class="btn btn-primary" style="width:100%;margin-top:4px" onclick="finishOb()">${t('start_btn')}</button>`;
    setTimeout(() => document.getElementById('ob-name')?.focus(), 50);
  }
}

function toggleCategory(catName) {
  ob_openCategory = ob_openCategory === catName ? null : catName;
  renderObStep();
}

function selectSub(catName, catIcon, subName, subIcon) {
  const existing = ob.stats.findIndex(s => s.category === catName);
  if (existing >= 0) {
    // Toggle off if same sub selected
    if (ob.stats[existing].name === subName) {
      ob.stats.splice(existing, 1);
      ob_openCategory = null;
      renderObStep();
      return;
    }
    ob.stats[existing] = { category: catName, name: subName, icon: subIcon, freq: ob.stats[existing].freq };
  } else {
    if (ob.stats.length >= 5) return;
    ob.stats.push({ category: catName, name: subName, icon: subIcon, freq: 1 });
  }
  ob_openCategory = null;
  renderObStep();
}

function changeFreq(catName, delta) {
  const s = ob.stats.find(x => x.category === catName);
  if (!s) return;
  s.freq = Math.max(1, Math.min(30, s.freq + delta));
  // Animate the number
  const key = catName.replace(/\s/g, '_');
  const el = document.getElementById('freq-' + key);
  if (el) {
    el.classList.remove('freq-pop');
    void el.offsetWidth;
    el.classList.add('freq-pop');
    el.textContent = s.freq;
  }
  // Re-render to update disabled states and label
  renderObStep();
}

function selClass(cls) { ob.class = cls; renderObStep(); }

function nextObStep() { if (ob.step < 3) { ob.step++; renderObStep(); } }

async function finishOb() {
  const name = (document.getElementById('ob-name')?.value || ob.displayName).trim();
  const errEl = document.getElementById('ob-error');
  errEl.style.display = 'none';
  if (!name) { errEl.textContent = t('name_error'); errEl.style.display = 'block'; return; }

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
      errEl.textContent = e.data?.error || t('err_register');
      errEl.style.display = 'block';
    }
    return;
  }

  try {
    const data = await api('POST', '/character', { display_name: name, class: ob.class, stats: statsPayload });
    state.character = data.character;
    state.stats = data.stats || [];
    state.activities = [];
    showDashboard();
  } catch (e) {
    errEl.textContent = e.data?.error || t('err_create_char');
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
              <div class="arc-label">${t('level')}</div>
            </div>
          </div>
          <div class="char-name char-name-btn" id="char-name-btn" onclick="toggleUserMenu(event)" style="margin-top:16px;">
            ${esc(c.display_name)} <span style="font-size:14px;color:var(--text-muted);">▾</span>
          </div>
          <div id="achievement-badges" class="achievement-badges"></div>
          <div class="streak-inline" id="streak-inline">🔥 <span id="streak-val">—</span> ${t('streak_days')}</div>
          <div class="char-xp-label" id="xp-label">
            ${t('xp_label', totalXP, level+1, xpNext)}
          </div>
        </div>
        <div class="user-menu" id="user-menu">
          <div class="user-menu-item" onclick="openAddStatModal()">
            <span>${t('add_stat')}</span>
          </div>
          <div class="user-menu-item" onclick="toggleTheme();closeUserMenu()">
            <span>${getTheme() === 'dark' ? '☀️' : '🌙'}</span><span>${getTheme() === 'dark' ? t('theme_light') : t('theme_dark')}</span>
          </div>
          <div class="user-menu-item" onclick="toggleLang();closeUserMenu()">
            <span>🌐</span><span>${getLang() === 'ru' ? 'English' : 'Русский'}</span>
          </div>
          <div class="user-menu-item" id="push-menu-item" onclick="togglePushNotifications()">
            <span id="push-menu-icon">🔔</span><span id="push-menu-label">${t('push_enable')}</span>
          </div>
          <div class="user-menu-divider"></div>
          <div class="user-menu-item disabled">
            <span>💎</span><span>${t('subscription')} <span style="font-size:11px;color:var(--text-muted);">(${t('soon')})</span></span>
          </div>
          <div class="user-menu-divider"></div>
          <div class="user-menu-item danger" onclick="doLogout()">
            <span>→</span><span>${t('logout')}</span>
          </div>
        </div>
      </div>

      <div class="stats-grid" id="stats-grid" style="animation:fadeIn 300ms ease 150ms both"></div>

      <div id="achievements-unlocked-section" style="animation:fadeIn 300ms ease 250ms both;"></div>

      <div class="activity-feed" style="animation:fadeIn 300ms ease 350ms both">
        <h3 style="margin-bottom:16px;">${t('last_activities')}</h3>
        <div id="activity-list"></div>
        <div id="activity-more"></div>
      </div>

      <div id="achievements-locked-section" style="animation:fadeIn 300ms ease 450ms both;"></div>
    </div>`;

  requestAnimationFrame(() => {
    setTimeout(() => setArcFill('main', xpFillRatio(totalXP, level)), 200);
  });

  activityPage = 1;
  renderStatCards();
  renderActivities();
  loadStreak();
  loadAchievements();
  getPushSubscription().then(sub => updatePushMenuUI(!!sub)).catch(() => {});
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
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="stat-level-badge">Lv.${s.stat_level||1}</span>
          <button class="stat-delete-btn" onclick="deleteStat('${s.id}','${esc(s.name)}')" title="Удалить навык">×</button>
        </div>
      </div>
      <div class="stat-meta">${t('streak_label', s.stat_streak||0)} · ${t('freq_label', s.frequency_days||1)}</div>
      <div class="xp-bar-wrap">
        <div class="xp-bar-fill" style="width:${(fill*100).toFixed(1)}%"></div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:4px;font-variant-numeric:tabular-nums">
        ${t('to_level', (s.stat_level||1)+1, xpNext)}
      </div>
      <button class="btn-log" id="bl-${s.id}" onclick="openLogModal('${s.id}','${esc(s.name)}','${s.icon}')">
        ${t('write_btn')}
      </button>
    </div>`;
  }).join('');

  if (!state.stats.length) {
    grid.innerHTML = `<div style="text-align:center;padding:32px 0;">
      <p class="text-muted" style="margin-bottom:16px;">${t('no_stats')}</p>
      <button class="btn btn-primary" onclick="openAddStatModal()">${t('add_stat')}</button>
    </div>`;
  }
}

const ACTIVITY_PAGE = 3;
let activityPage = 1;

function renderActivities() {
  const el = document.getElementById('activity-list');
  const moreEl = document.getElementById('activity-more');
  if (!el) return;
  if (!state.activities.length) {
    el.innerHTML = `<p class="text-muted" style="font-size:14px;padding:16px 0;">${t('no_activities')}</p>`;
    if (moreEl) moreEl.innerHTML = '';
    return;
  }
  const visible = state.activities.slice(0, activityPage * ACTIVITY_PAGE);
  el.innerHTML = visible.map(a => `
    <div class="activity-item">
      <div class="activity-icon">${a.stat_icon||'⚡'}</div>
      <div style="flex:1">
        <div class="activity-desc">${esc(a.description)}</div>
        <div class="activity-stat">${esc(a.stat_name)}</div>
      </div>
      <div class="activity-xp">+${a.xp_earned} XP</div>
    </div>`).join('');
  if (moreEl) {
    if (visible.length < state.activities.length) {
      moreEl.innerHTML = `<button class="btn btn-ghost" style="width:100%;margin-top:12px;font-size:14px;" onclick="loadMoreActivities()">${t('show_more')}</button>`;
    } else {
      moreEl.innerHTML = '';
    }
  }
}

function loadMoreActivities() {
  activityPage++;
  renderActivities();
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
    const menuW = 200;
    const menuH = 220;
    // Horizontal: center under button, clamp to viewport
    let left = rect.left + rect.width / 2 - menuW / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - menuW - 8));
    menu.style.left = left + 'px';
    menu.style.width = menuW + 'px';
    // Vertical: open upward if not enough space below
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    if (spaceBelow < menuH) {
      menu.style.top    = 'auto';
      menu.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
    } else {
      menu.style.top    = (rect.bottom + 8) + 'px';
      menu.style.bottom = 'auto';
    }
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

// ── Add Stat Modal (Task 6) ───────────────────────────────────────────────────

let addStatCtx = { categoryName: null, name: '', icon: '', freq: 1 };

function openAddStatModal() {
  closeUserMenu();
  if (state.stats.length >= 5) {
    showToast('⚠️', t('max_stats'));
    return;
  }
  addStatCtx = { categoryName: null, name: '', icon: '', freq: 1 };

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'add-stat-modal';
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeAddStatModal(); });
  document.body.appendChild(backdrop);
  requestAnimationFrame(() => backdrop.classList.add('open'));
  renderAddStatModal();
}

function renderAddStatModal() {
  const backdrop = document.getElementById('add-stat-modal');
  if (!backdrop) return;

  const catChips = getStatCategories().map(cat => {
    const selected = addStatCtx.categoryName === cat.name;
    return `<div class="stat-chip ${selected?'selected':''}" onclick="selectAddCategory('${esc(cat.name)}','${esc(cat.icon)}')">
      <span>${cat.icon}</span><span>${esc(cat.name)}</span>
    </div>`;
  }).join('');

  const cat = getStatCategories().find(c => c.name === addStatCtx.categoryName);
  const subBubbles = cat ? cat.subs.map(sub => `
    <div class="sub-bubble ${addStatCtx.name === sub.name ? 'selected' : ''}"
         onclick="selectAddSub('${esc(sub.name)}','${esc(sub.icon)}')">
      <span>${sub.icon}</span><span>${esc(sub.name)}</span>
    </div>`).join('') : '';

  backdrop.innerHTML = `
    <div class="modal">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <h3>${t('new_stat')}</h3>
        <button onclick="closeAddStatModal()" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer;line-height:1;">✕</button>
      </div>
      <p class="text-muted" style="font-size:13px;margin-bottom:12px;">${t('choose_dir')}</p>
      <div class="stat-options" style="margin-bottom:${cat?'12px':'0'}">${catChips}</div>
      ${cat ? `
        <p class="text-muted" style="font-size:13px;margin-bottom:10px;">${t('what_you_do')}</p>
        <div class="sub-bubbles open-inline">${subBubbles}</div>
      ` : ''}
      ${addStatCtx.name ? `
        <div style="margin-top:16px;padding:12px;background:var(--surface-2);border-radius:10px;">
          <div style="font-size:14px;font-weight:600;margin-bottom:10px;">${addStatCtx.icon} ${esc(addStatCtx.name)}</div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:13px;color:var(--text-muted);">${t('frequency')}</span>
            <div class="freq-picker">
              <button class="freq-btn" onclick="changeAddFreq(-1)" ${addStatCtx.freq<=1?'disabled':''}>−</button>
              <div class="freq-num" id="add-freq-num">${addStatCtx.freq}</div>
              <button class="freq-btn" onclick="changeAddFreq(1)" ${addStatCtx.freq>=30?'disabled':''}>+</button>
              <span class="freq-label">${t('per_day_str', addStatCtx.freq)}</span>
            </div>
          </div>
        </div>
        <div id="add-stat-err" style="color:#ef4444;font-size:13px;margin-top:8px;display:none;"></div>
        <button class="btn btn-primary" style="width:100%;margin-top:12px" onclick="submitAddStat()">${t('add_stat_btn')}</button>
      ` : ''}
    </div>`;
}

function selectAddCategory(catName, catIcon) {
  addStatCtx.categoryName = catName;
  addStatCtx.name = '';
  addStatCtx.icon = catIcon;
  renderAddStatModal();
}

function selectAddSub(subName, subIcon) {
  addStatCtx.name = subName;
  addStatCtx.icon = subIcon;
  renderAddStatModal();
}

function changeAddFreq(delta) {
  addStatCtx.freq = Math.max(1, Math.min(30, addStatCtx.freq + delta));
  renderAddStatModal();
}

async function submitAddStat() {
  const errEl = document.getElementById('add-stat-err');
  if (errEl) errEl.style.display = 'none';

  try {
    const newStat = await api('POST', '/stats', {
      name: addStatCtx.name,
      icon: addStatCtx.icon,
      frequency_days: addStatCtx.freq,
    });
    state.stats.push(newStat);
    closeAddStatModal();
    renderStatCards();
    showToast('✨', t('stat_added', addStatCtx.name));
  } catch (e) {
    if (errEl) {
      errEl.textContent = e.data?.error || t('err_add');
      errEl.style.display = 'block';
    }
  }
}

function closeAddStatModal() {
  const el = document.getElementById('add-stat-modal');
  if (!el) return;
  el.classList.add('closing');
  setTimeout(() => el.remove(), 150);
}

// ── Delete Stat ───────────────────────────────────────────────────────────────

function showConfirm(title, message, onOk) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'confirm-modal';
  backdrop.innerHTML = `
    <div class="modal confirm-dialog">
      <div class="confirm-title">${title}</div>
      <p>${message}</p>
      <div class="confirm-actions">
        <button class="btn btn-ghost" onclick="document.getElementById('confirm-modal').remove()">${t('cancel')}</button>
        <button class="btn btn-primary" id="confirm-ok-btn">${t('delete_btn')}</button>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  requestAnimationFrame(() => backdrop.classList.add('open'));
  backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.remove(); });
  document.getElementById('confirm-ok-btn').onclick = () => { backdrop.remove(); onOk(); };
}

async function deleteStat(statId, statName) {
  showConfirm(
    t('delete_skill'),
    t('del_confirm', statName),
    async () => {
      try {
        await api('DELETE', '/stats/' + statId);
        state.stats = state.stats.filter(s => s.id !== statId);
        renderStatCards();
        showToast('🗑️', t('stat_deleted', statName));
      } catch (e) {
        showToast('⚠️', e.data?.error || t('err_delete'));
      }
    }
  );
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
        <label>${t('what_did_you_do')}</label>
        <input class="input" id="log-desc" type="text" placeholder="${t('desc_placeholder')}" maxlength="280"
          oninput="updateLogBtn()">
      </div>
      <div id="log-err" style="color:#ef4444;font-size:13px;margin-bottom:12px;display:none;"></div>
      <button class="btn btn-primary" style="width:100%" id="log-btn" onclick="submitLog()" disabled>
        ${t('write_btn')}
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

    activityPage = 1;
    state.activities.unshift(result.activity);

    const si = state.stats.findIndex(s => s.id === logCtx.statID);
    if (si >= 0) {
      state.stats[si].stat_xp     = result.stat_xp;
      state.stats[si].stat_level  = result.stat_level;
      state.stats[si].stat_streak = result.stat_streak;
    }
    if (state.character) state.character.level = result.character_level;

    const originBtn = document.getElementById('bl-' + logCtx.statID);
    const arcRing   = document.getElementById('arc-ring');
    if (originBtn && arcRing) fireXPParticles(originBtn, result.xp_earned, arcRing);

    const card = document.getElementById('sc-' + logCtx.statID);
    if (card) { card.classList.remove('xp-pulse'); void card.offsetWidth; card.classList.add('xp-pulse'); }

    if (result.character_level_up) setTimeout(() => showLevelUp(result.character_level), 800);
    if (result.stat_level_up) showToast('⬆️', t('stat_leveled', logCtx.statName, result.stat_level));
    (result.achievements_unlocked || []).forEach((a, i) => showAchievementOverlay(a, 600 + i * 3200));
    if ((result.achievements_unlocked || []).length > 0) setTimeout(loadAchievements, 200);

    const totalXP = state.stats.reduce((s, x) => s + (x.stat_xp || 0), 0);
    const level   = levelFromXP(totalXP);
    if (state.character) state.character.level = level;

    const arcLevelEl = document.getElementById('arc-level');
    if (arcLevelEl) arcLevelEl.textContent = level;

    const xpNext = xpRequired(level + 1) - totalXP;
    const lbl = document.getElementById('xp-label');
    if (lbl) lbl.textContent = t('xp_label', totalXP, level+1, xpNext);

    if (result.character_level_up) {
      setArcFill('main', 0);
      setTimeout(() => setArcFill('main', xpFillRatio(totalXP, level)), 50);
    } else {
      setArcFill('main', xpFillRatio(totalXP, level));
    }

    renderStatCards();
    renderActivities();

  } catch (e) {
    btn.disabled = false;
    btn.textContent = t('write_btn');
    const msg = e.status === 429
      ? (e.data?.error || t('period_block'))
      : (e.data?.error || t('err_try_again'));
    errEl.textContent = msg;
    errEl.style.display = 'block';
  }
}

// ── XP Chart (Task 8) ─────────────────────────────────────────────────────────

async function loadXPChart() {
  const el = document.getElementById('xp-chart-section');
  if (!el) return;
  try {
    const data = await api('GET', '/analytics/xp-history?days=30');
    if (!data.data || !data.data.length) return;
    el.innerHTML = renderXPChart(data.data);
  } catch {}
}

function renderXPChart(days) {
  const maxXP = Math.max(...days.map(d => d.xp), 1);
  const bars = days.map(d => {
    const h = Math.max(4, Math.round((d.xp / maxXP) * 80));
    const day = d.day.slice(5); // MM-DD
    return `<div class="chart-bar-wrap" title="${d.day}: ${d.xp} XP">
      <div class="chart-bar" style="height:${h}px"></div>
      <div class="chart-day">${day.replace('-', '/')}</div>
    </div>`;
  }).join('');

  const totalXP = days.reduce((s, d) => s + d.xp, 0);
  return `
    <div style="margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">
      <h3>${t('xp_30')}</h3>
      <div style="display:flex;gap:8px;align-items:center;">
        <span style="font-size:13px;color:var(--text-muted);">${totalXP.toLocaleString()} ${t('xp_total')}</span>
        <button class="btn btn-ghost" style="padding:6px 12px;font-size:13px;" onclick="exportCSV()">${t('export_csv')}</button>
      </div>
    </div>
    <div class="xp-chart">${bars}</div>`;
}

async function exportCSV() {
  try {
    const [history, activities] = await Promise.all([
      api('GET', '/analytics/xp-history?days=365'),
      api('GET', '/activities?limit=100'),
    ]);

    const rows = [[t('csv_date'), t('csv_xp_day')]];
    (history.data || []).forEach(d => rows.push([d.day, d.xp]));
    rows.push([]);
    rows.push([t('csv_date'), t('csv_skill'), t('csv_desc'), 'XP']);
    (Array.isArray(activities) ? activities : []).forEach(a =>
      rows.push([new Date(a.logged_at).toLocaleDateString(getLang() === 'en' ? 'en-US' : 'ru-RU'), a.stat_name, a.description, a.xp_earned])
    );

    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'arkhe-export.csv';
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  } catch { showToast('⚠️', t('err_export')); }
}

// ── Achievements (Task 7) ─────────────────────────────────────────────────────

async function loadAchievements() {
  const unlockedEl = document.getElementById('achievements-unlocked-section');
  const lockedEl   = document.getElementById('achievements-locked-section');
  if (!unlockedEl && !lockedEl) return;
  try {
    const list = await api('GET', '/achievements');
    const unlocked = (list || []).filter(a => a.unlocked);
    const locked   = (list || []).filter(a => !a.unlocked);
    const locale   = getLang() === 'ru' ? 'ru-RU' : 'en-US';

    const card = a => `
      <div class="achievement-card ${a.unlocked ? 'unlocked' : 'locked'}">
        <div class="achievement-icon">${a.icon}</div>
        <div class="achievement-info">
          <div class="achievement-title">${esc(a.title)}</div>
          <div class="achievement-desc">${esc(a.description)}</div>
          ${a.unlocked && a.unlocked_at ? `<div class="achievement-date">${new Date(a.unlocked_at).toLocaleDateString(locale)}</div>` : ''}
        </div>
        ${a.unlocked ? '<div class="achievement-check">✓</div>' : '<div class="achievement-lock">🔒</div>'}
      </div>`;

    if (unlockedEl) {
      unlockedEl.innerHTML = unlocked.length ? `
        <div style="margin-bottom:32px;">
          <h3 style="margin-bottom:16px;">${t('achievements')} <span style="font-size:14px;color:var(--text-muted);font-weight:400;">${unlocked.length}/${list.length}</span></h3>
          <div class="achievements-grid">${unlocked.map(card).join('')}</div>
        </div>` : '';
    }

    if (lockedEl) {
      lockedEl.innerHTML = locked.length ? `
        <details style="margin-top:8px;">
          <summary style="font-size:14px;color:var(--text-muted);cursor:none;padding:8px 0;list-style:none;display:flex;align-items:center;gap:6px;">
            <span style="font-size:12px;">▸</span>${t('locked')} (${locked.length})
          </summary>
          <div class="achievements-grid" style="margin-top:12px;">${locked.map(card).join('')}</div>
        </details>` : '';
    }

    const badgesEl = document.getElementById('achievement-badges');
    if (badgesEl && unlocked.length > 0) {
      badgesEl.innerHTML = unlocked.slice(0, 8).map(a =>
        `<span class="achievement-badge" title="${esc(a.title)}">${a.icon}</span>`
      ).join('');
    }
  } catch {}
}

// ── Utils ─────────────────────────────────────────────────────────────────────

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Vortex background ─────────────────────────────────────────────────────────

let vortexRaf = null;

function startVortex() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let canvas = document.getElementById('vortex-bg');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'vortex-bg';
    document.body.insertBefore(canvas, document.body.firstChild);
  }

  const ctx = canvas.getContext('2d');
  let W, H, scrollY = 0;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  const isLight = () => document.documentElement.classList.contains('light');

  const rings = Array.from({ length: 9 }, (_, i) => ({
    rx:    W * 0.18 + i * W * 0.12,
    ry:    H * 0.07 + i * H * 0.055,
    angle: (i * Math.PI) / 4,
    speed: 0.0003 * (i % 2 === 0 ? 1 : -1) * (1.1 - i * 0.06),
    alpha: 0.18 - i * 0.012,
    lw:    1.5 - i * 0.1,
    dash:  i % 3 === 0,
  }));

  const particles = Array.from({ length: 80 }, () => {
    const ri = Math.floor(Math.random() * rings.length);
    return { ri, phase: Math.random() * Math.PI * 2, speed: 0.001 + Math.random() * 0.003, a: 0.2 + Math.random() * 0.6, r: 1 + Math.random() * 2 };
  });

  function draw() {
    // Resize rings dynamically if window changed
    rings.forEach((ring, i) => {
      ring.rx = W * 0.18 + i * W * 0.12;
      ring.ry = H * 0.07 + i * H * 0.055;
    });

    ctx.clearRect(0, 0, W, H);
    const cx = W / 2;
    const cy = H * 0.38 + scrollY * 0.25;  // scroll parallax
    const light = isLight();

    // Center glow
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.55);
    g.addColorStop(0,   light ? 'rgba(37,99,235,0.12)'  : 'rgba(37,99,235,0.18)');
    g.addColorStop(0.4, light ? 'rgba(29,78,216,0.05)'  : 'rgba(29,78,216,0.08)');
    g.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Rings
    rings.forEach(ring => {
      ring.angle += ring.speed;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ring.angle);
      if (ring.dash) ctx.setLineDash([8, 24]);
      ctx.beginPath();
      ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = light
        ? `rgba(37,99,235,${ring.alpha * 0.7})`
        : `rgba(96,165,250,${ring.alpha})`;
      ctx.lineWidth = Math.max(0.5, ring.lw);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    });

    // Particles
    particles.forEach(p => {
      p.phase += p.speed;
      const ring = rings[p.ri];
      const px = cx + Math.cos(p.phase + ring.angle) * ring.rx;
      const py = cy + Math.sin(p.phase + ring.angle) * ring.ry;
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = light
        ? `rgba(37,99,235,${p.a * 0.5})`
        : `rgba(147,197,253,${p.a})`;
      ctx.fill();
    });

    vortexRaf = requestAnimationFrame(draw);
  }

  if (vortexRaf) cancelAnimationFrame(vortexRaf);
  draw();
}

// ── Custom Cursor ─────────────────────────────────────────────────────────────

function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
  const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mousedown', () => dot.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => dot.classList.remove('cursor-click'));

  const interactiveSelector = 'a,button,[onclick],label,summary,.stat-chip,.sub-bubble,.class-card,.btn-log,.user-menu-item';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactiveSelector)) {
      dot.classList.add('cursor-hover'); ring.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactiveSelector)) {
      dot.classList.remove('cursor-hover'); ring.classList.remove('cursor-hover');
    }
  });

  let rafId;
  function loop() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    rafId = requestAnimationFrame(loop);
  }
  loop();
}

// ── Push Notifications ────────────────────────────────────────────────────────

const PUSH_SUB_KEY = 'arkhe_push_subscribed';

function pushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

async function getPushSubscription() {
  if (!pushSupported()) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

async function initPush() {
  if (!pushSupported()) return;
  await navigator.serviceWorker.register('/sw.js');
  const sub = await getPushSubscription();
  updatePushMenuUI(!!sub);
}

function updatePushMenuUI(subscribed) {
  const label = document.getElementById('push-menu-label');
  const icon  = document.getElementById('push-menu-icon');
  if (!label) return;
  label.textContent = t(subscribed ? 'push_disable' : 'push_enable').replace(/^[^\s]+\s/, '');
  if (icon) icon.textContent = subscribed ? '🔕' : '🔔';
}

async function togglePushNotifications() {
  closeUserMenu();
  if (!pushSupported()) { alert(t('push_unsupported')); return; }

  const sub = await getPushSubscription();
  if (sub) {
    await sub.unsubscribe();
    await api('DELETE', '/push/subscribe', { endpoint: sub.endpoint }).catch(() => {});
    localStorage.removeItem(PUSH_SUB_KEY);
    updatePushMenuUI(false);
    return;
  }

  const perm = await Notification.requestPermission();
  if (perm !== 'granted') { alert(t('push_denied')); return; }

  try {
    const { public_key, enabled } = await api('GET', '/push/vapid-key');
    if (!enabled) return;

    const reg = await navigator.serviceWorker.ready;
    const newSub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(public_key),
    });

    const json = newSub.toJSON();
    await api('POST', '/push/subscribe', {
      endpoint: json.endpoint,
      p256dh:   json.keys.p256dh,
      auth:     json.keys.auth,
    });
    localStorage.setItem(PUSH_SUB_KEY, '1');
    updatePushMenuUI(true);
  } catch (e) {
    console.error('push subscribe failed', e);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw     = atob(base64);
  return Uint8Array.from(raw, c => c.charCodeAt(0));
}

// ── Boot ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => { applyTheme(getTheme()); init(); initCursor(); startVortex(); initPush(); });
