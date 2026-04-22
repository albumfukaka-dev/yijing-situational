import './style.css';

// ============================================
// Theme Management
// ============================================
let currentTheme = localStorage.getItem('yijing-theme') || 'dark';
let currentIframe = null;

const LIGHT_THEME_CSS = `
body { background: #f5f0eb !important; }
.card { background: #f5f0eb !important; border: 1px solid rgba(45,43,39,0.08) !important; box-shadow: 0 4px 16px rgba(45,43,39,0.08), 0 1px 3px rgba(45,43,39,0.06) !important; }
.card::before { display: none !important; background: none !important; }
:root {
  --warm: #a87e38 !important;
  --warm-dim: #c9a96e !important;
  --cold: #2e5a78 !important;
  --cold-dim: #5a7a8a !important;
  --light: #1a1815 !important;
  --mid: #3d3830 !important;
  --muted: #b8b0a8 !important;
  --dark: #c8c0b8 !important;
  --faint: #d4ccc4 !important;
  --line: #ddd8d0 !important;
}
.cover::after { background: radial-gradient(ellipse at 50% 60%, rgba(168,126,56,0.04) 0%, transparent 55%) !important; }
.page-label { color: #b8b0a4 !important; }
.hook-flip { color: #6a6560 !important; }
.hook-flip em { color: #6a6560 !important; }
.section-body em { color: var(--mid) !important; }
.diagram-title { color: #6a6560 !important; }
.diagram-insight em { color: var(--mid) !important; }
.series-tag { color: #d4ccc4 !important; }
.cover-tag { color: #d4ccc4 !important; border-color: #ddd8d0 !important; }
.cover-num { color: #d4ccc4 !important; }
svg line[stroke="#6a8a9a"] { stroke: #2e5a78 !important; }
svg line[stroke="#c9a96e"] { stroke: #a87e38 !important; }
svg path[stroke="#6a8a9a"] { stroke: #2e5a78 !important; }
svg path[stroke="#c9a96e"] { stroke: #a87e38 !important; }
`;

function applyThemeToDocument() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.textContent = currentTheme === 'dark' ? '☀' : '☾';
    btn.title = currentTheme === 'dark' ? '切换亮色' : '切换暗色';
  });
}

function applyThemeToIframe(iframe) {
  if (!iframe) return;
  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (!doc || !doc.head) return;
    const existing = doc.getElementById('yijing-theme-inject');
    if (existing) existing.remove();
    if (currentTheme === 'light') {
      const style = doc.createElement('style');
      style.id = 'yijing-theme-inject';
      style.textContent = LIGHT_THEME_CSS;
      doc.head.appendChild(style);
    }
  } catch (e) {
    console.warn('Theme injection failed:', e);
  }
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('yijing-theme', currentTheme);
  applyThemeToDocument();
  applyThemeToIframe(currentIframe);
}
import {
  TRIBES, HEXAGRAMS,
  getHexagramsByTribe, getTribe, getHexagram, getTribeProgress,
  getRandomHexagram, searchHexagrams, getAllHexagramsSorted, getYaoLines,
  getTrigramEnergy,
  getZongGua, getCuoGua, getHuGua,
  getZaGuaDef, getPalace, getSequenceContext, getGuaCi
} from './data.js';

// ============================================
// Router
// ============================================
const routes = {};
function route(path, handler) { routes[path] = handler; }
function navigate(hash) { window.location.hash = hash; }

function matchRoute(hash) {
  const path = hash.replace('#', '') || '/';
  // Try exact match
  if (routes[path]) return { handler: routes[path], params: {} };
  // Try parameterized routes
  for (const pattern of Object.keys(routes)) {
    const paramNames = [];
    const regex = pattern.replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const match = path.match(new RegExp(`^${regex}$`));
    if (match) {
      const params = {};
      paramNames.forEach((name, i) => params[name] = match[i + 1]);
      return { handler: routes[pattern], params };
    }
  }
  return { handler: routes['/'], params: {} };
}

// ============================================
// Render Helpers
// ============================================
const app = document.getElementById('app');

function renderYaoMini(hexagram) {
  const yao = getYaoLines(hexagram);
  const upperEnergy = getTrigramEnergy(hexagram.upper);
  const lowerEnergy = getTrigramEnergy(hexagram.lower);
  // Display top-to-bottom (reverse of bottom-to-top data)
  // yao[0-2] = lower trigram, yao[3-5] = upper trigram
  // reversed[0-2] = upper trigram, reversed[3-5] = lower trigram
  const lines = [...yao].reverse();
  return lines.map((y, i) => {
    const energy = i < 3 ? upperEnergy : lowerEnergy; // top 3 = upper, bottom 3 = lower
    const shape = y ? 'solid' : 'broken';
    return `<div class="yao-line ${shape} ${energy}"></div>`;
  }).join('');
}

function renderNav(active = '') {
  const items = [
    { id: 'home', icon: '▣', label: '情境', hash: '#/' },
    { id: 'divine', icon: '◎', label: '抽卦', hash: '#/divine' },
    { id: 'list', icon: '≡', label: '索引', hash: '#/list' },
    { id: 'explore-nav', icon: '◈', label: '探索', hash: '#/explore' },
    { id: 'ruler', icon: '⇌', label: '分析尺', hash: '#/ruler' },
  ];
  return `
    <nav class="bottom-nav">
      ${items.map(item => `
        <a href="${item.hash}" class="nav-item ${active === item.id ? 'active' : ''}" data-nav="${item.id}">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
        </a>
      `).join('')}
    </nav>
  `;
}

// ============================================
// Pages
// ============================================

// --- Homepage ---
function renderHome() {
  const tribeCards = TRIBES.map(tribe => {
    const progress = getTribeProgress(tribe.id);
    const isComplete = progress.done === progress.total;
    const pct = (progress.done / progress.total * 100).toFixed(0);
    return `
      <div class="tribe-card" style="--accent: ${tribe.color}" onclick="location.hash='#/tribe/${tribe.id}'">
        <div class="tribe-icon-row">
          <div class="tribe-icon" style="background: ${tribe.color}">${tribe.icon}</div>
          <span class="tribe-num">族 ${String(tribe.id).padStart(2, '0')}</span>
        </div>
        <div class="tribe-name">${tribe.name}</div>
        <div class="tribe-question">${tribe.question}</div>
        <div class="tribe-progress">
          ${isComplete
            ? `<span class="tribe-complete-badge">✓ 全部完成</span>`
            : `<div class="tribe-progress-bar"><div class="tribe-progress-fill" style="width: ${pct}%; background: ${tribe.color}"></div></div>
               <span class="tribe-progress-text">${progress.done}/${progress.total}</span>`
          }
        </div>
      </div>
    `;
  }).join('');

  app.innerHTML = `
    <div class="page">
      <header class="home-header">
        <div class="home-brand">易经 · <span>情境识别</span></div>
        <div class="home-sub">在 64 种处境中，找到你的那一种</div>
        <div class="home-divider"></div>
        <button class="theme-toggle home-theme-btn" id="home-theme-btn" title="切换主题">${currentTheme === 'dark' ? '☀' : '☾'}</button>
      </header>
      <div class="section-title">八 种 情 境</div>
      <div class="tribe-grid">
        ${tribeCards}
      </div>
    </div>
    ${renderNav('home')}
  `;
  document.getElementById('home-theme-btn').addEventListener('click', toggleTheme);
}

// --- Tribe Detail ---
function renderTribe(params) {
  const tribe = getTribe(parseInt(params.id));
  if (!tribe) return renderHome();

  const hexagrams = getHexagramsByTribe(tribe.id);
  const progress = getTribeProgress(tribe.id);

  const guaItems = hexagrams.map(h => {
    const isDone = h.status === 'done';
    const yaoHtml = renderYaoMini(h);
    return `
      <div class="gua-item ${isDone ? 'done' : 'pending'}"
           ${isDone ? `onclick="location.hash='#/gua/${h.num}'"` : ''}>
        <div class="gua-yao-mini">${yaoHtml}</div>
        <div class="gua-info">
          <div class="gua-name-row">
            <span class="gua-name">${h.name}</span>
            <span class="gua-fullname">${h.fullName} · 第${String(h.num).padStart(2, '0')}卦</span>
          </div>
          <div class="gua-hook">${h.hook}</div>
        </div>
        ${isDone
          ? `<span class="gua-arrow">›</span>`
          : `<span class="gua-status">即将推出</span>`
        }
      </div>
    `;
  }).join('');

  app.innerHTML = `
    <div class="page">
      <div class="tribe-header" style="--accent: ${tribe.color}">
        <button class="back-btn" onclick="location.hash='#/'">‹ 返回</button>
        <div class="tribe-detail-name" style="color: ${tribe.color}">${tribe.name}</div>
        <div class="tribe-detail-question">${tribe.question}</div>
        <div class="tribe-detail-energy">${tribe.energy} · ${progress.done}/${progress.total} 卦</div>
      </div>
      <div class="gua-list">
        ${guaItems}
      </div>
    </div>
    ${renderNav('home')}
  `;
}

// --- Card Viewer (renders inline, not overlay) ---
let previousHash = null;

function renderViewer(params) {
  const h = getHexagram(parseInt(params.num));
  if (!h || h.status !== 'done') {
    navigate('#/');
    return;
  }

  const tribe = getTribe(h.tribe);
  const DESIGN_W = 540;
  const DESIGN_H = 720;

  currentIframe = null;

  app.innerHTML = `
    <div class="page" style="padding-bottom: 0;">
      <div class="viewer-header">
        <button class="viewer-close" id="viewer-back">‹ 返回</button>
        <span class="viewer-title">${h.name} · ${h.fullName}</span>
        <button class="theme-toggle" id="viewer-theme-btn" title="切换主题">${currentTheme === 'dark' ? '☀' : '☾'}</button>
      </div>
      <div class="viewer-body" id="viewer-body">
        <div class="viewer-iframe-wrap" id="iframe-wrap">
          <iframe src="${import.meta.env.BASE_URL}cards/${h.file}" title="${h.name} 卡片" id="card-iframe"></iframe>
        </div>
      </div>
      <div class="viewer-info" style="text-align: center; padding: 16px 24px 24px;">
        <div style="font-size: 11px; color: var(--dark); letter-spacing: 2px;">
          「${tribe.name}」情境 · ${tribe.question}
        </div>
        <div style="font-size: 12px; color: var(--muted); margin-top: 8px; letter-spacing: 0.5px;">
          ${h.hook}
        </div>
      </div>
    </div>
  `;

  // Wire theme toggle
  document.getElementById('viewer-theme-btn').addEventListener('click', toggleTheme);

  // Save iframe reference and inject theme on load
  const iframe = document.getElementById('card-iframe');
  currentIframe = iframe;
  iframe.addEventListener('load', () => applyThemeToIframe(iframe));

  // Scale iframe to fit viewport
  function scaleIframe() {
    const wrap = document.getElementById('iframe-wrap');
    if (!wrap) return;
    const vw = Math.min(window.innerWidth, 540);
    const scale = Math.min(vw / DESIGN_W, 1);
    wrap.style.setProperty('--iframe-scale', scale);
    // Adjust wrapper height so it doesn't overflow (transform doesn't affect layout)
    wrap.style.height = (DESIGN_H * scale) + 'px';
  }
  scaleIframe();
  window.addEventListener('resize', scaleIframe);

  document.getElementById('viewer-back').addEventListener('click', () => {
    window.removeEventListener('resize', scaleIframe);
    history.back();
  });
}

// --- Divination ---
function renderDivine() {
  app.innerHTML = `
    <div class="page">
      <div class="divine-container" id="divine-container">
        <div class="divine-prompt">
          <h2>静一静<br>想一个你正在面对的处境</h2>
          <p>不需要说出来<br>感受到了，就可以开始</p>
        </div>
        <button class="divine-btn" id="divine-start">
          照一照
        </button>
      </div>
    </div>
    ${renderNav('divine')}
  `;

  document.getElementById('divine-start').addEventListener('click', startDivination);
}

let divineAborted = false;

async function startDivination() {
  divineAborted = false;
  const container = document.getElementById('divine-container');
  const hexagram = getRandomHexagram();
  const yao = getYaoLines(hexagram);
  const tribe = getTribe(hexagram.tribe);

  // Build stage
  container.innerHTML = `
    <div class="divine-stage">
      <div class="divine-trigram-label" id="upper-label" style="margin-bottom: -8px">外卦 · ${hexagram.upper}</div>
      <div class="divine-hexagram" id="divine-hexagram"></div>
      <div class="divine-trigram-label" id="lower-label">内卦 · ${hexagram.lower}</div>
      <div id="divine-result-area"></div>
    </div>
  `;

  const hexContainer = document.getElementById('divine-hexagram');
  if (!hexContainer) return;

  // Build yao elements (display top to bottom = reverse of data)
  const yaoReversed = [...yao].reverse();
  const yaoLabels = ['上', '五', '四', '三', '二', '初'];
  const upperEnergy = getTrigramEnergy(hexagram.upper);
  const lowerEnergy = getTrigramEnergy(hexagram.lower);

  // Create all yao elements
  const yaoElements = [];
  for (let i = 0; i < 6; i++) {
    if (i === 3) {
      const sep = document.createElement('div');
      sep.className = 'divine-separator';
      sep.id = 'divine-sep';
      hexContainer.appendChild(sep);
    }
    const yaoDiv = document.createElement('div');
    const isYang = yaoReversed[i] === 1;
    const energy = i < 3 ? upperEnergy : lowerEnergy;
    yaoDiv.className = `divine-yao ${isYang ? 'yang-line' : 'yin-line'} ${energy}`;
    yaoDiv.innerHTML = `<span class="divine-yao-label">${yaoLabels[i]}</span>`;
    hexContainer.appendChild(yaoDiv);
    yaoElements.push(yaoDiv);
  }

  // Animate: reveal from bottom (last element) to top (first element)
  const revealOrder = [...yaoElements].reverse();
  for (let i = 0; i < revealOrder.length; i++) {
    await sleep(600);
    if (divineAborted) return;
    revealOrder[i].classList.add('revealed');

    if (i === 2) {
      await sleep(300);
      if (divineAborted) return;
      const sep = document.getElementById('divine-sep');
      const lbl = document.getElementById('lower-label');
      if (sep) sep.classList.add('revealed');
      if (lbl) lbl.classList.add('revealed');
    }
  }

  await sleep(400);
  if (divineAborted) return;
  const upperLabel = document.getElementById('upper-label');
  if (upperLabel) upperLabel.classList.add('revealed');

  await sleep(800);
  if (divineAborted) return;
  const resultArea = document.getElementById('divine-result-area');
  if (!resultArea) return;
  const isDone = hexagram.status === 'done';

  resultArea.innerHTML = `
    <div class="divine-result">
      <div class="divine-result-name">${hexagram.name}</div>
      <div class="divine-result-fullname">${hexagram.fullName} · 第${String(hexagram.num).padStart(2, '0')}卦</div>
      <div class="divine-result-hook">${hexagram.hook}</div>
      <div class="divine-result-tribe" style="color: ${tribe.color}">「${tribe.name}」情境 · ${tribe.question}</div>
      ${isDone
        ? `<a href="#/gua/${hexagram.num}" class="divine-view-btn">查看三张卡 ›</a>`
        : `<div style="font-size: 12px; color: var(--dark); letter-spacing: 1px;">内容即将推出</div>`
      }
      <button class="divine-retry-btn" id="divine-retry">再来一次</button>
    </div>
  `;

  document.getElementById('divine-retry').addEventListener('click', () => {
    renderDivine();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// --- List Page ---
function renderList() {
  const allHexagrams = getAllHexagramsSorted();

  app.innerHTML = `
    <div class="page">
      <div class="list-header">
        <div class="list-title">六十四卦</div>
        <div class="search-box">
          <span class="search-icon">⌕</span>
          <input class="search-input" id="search-input" type="text" placeholder="搜索卦名、拼音或关键词..." />
        </div>
      </div>
      <div class="list-count" id="list-count">共 64 卦 · 已完成 ${allHexagrams.filter(h => h.status === 'done').length} 卦</div>
      <div class="list-items" id="list-items">
        ${renderListItems(allHexagrams)}
      </div>
    </div>
    ${renderNav('list')}
  `;

  const input = document.getElementById('search-input');
  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const results = searchHexagrams(input.value);
      document.getElementById('list-items').innerHTML = renderListItems(results);
      document.getElementById('list-count').textContent =
        input.value.trim()
          ? `找到 ${results.length} 卦`
          : `共 64 卦 · 已完成 ${allHexagrams.filter(h => h.status === 'done').length} 卦`;
    }, 200);
  });
}

function renderListItems(hexagrams) {
  return hexagrams.map(h => {
    const tribe = getTribe(h.tribe);
    const isDone = h.status === 'done';
    return `
      <div class="list-gua ${isDone ? '' : 'pending'}">
        <div class="list-gua-main" ${isDone ? `onclick="location.hash='#/gua/${h.num}'"` : ''}>
          <span class="list-gua-num">${String(h.num).padStart(2, '0')}</span>
          <span class="list-gua-name">${h.name}</span>
          <span class="list-gua-full">${h.fullName}</span>
          <span class="list-gua-tribe" style="color: ${tribe.color}; border-color: ${tribe.color}40">${tribe.name}</span>
          <span class="list-gua-hook">${h.hook}</span>
        </div>
        <span class="list-gua-explore" onclick="event.stopPropagation(); location.hash='#/explore/${h.num}'" title="探索关系卦">◈</span>
      </div>
    `;
  }).join('');
}

// --- Explore Index (pick a hexagram) ---
function renderExploreIndex() {
  const allHexagrams = getAllHexagramsSorted();

  app.innerHTML = `
    <div class="page">
      <div class="explore-index-header">
        <div class="explore-index-title">卦 象 探 索</div>
        <div class="explore-index-sub">选择任意一卦，查看综卦·错卦·互卦关系</div>
        <div class="search-box">
          <span class="search-icon">⌕</span>
          <input class="search-input" id="explore-search" type="text" placeholder="搜索卦名、拼音或序号..." />
        </div>
      </div>
      <div class="explore-grid" id="explore-grid">
        ${renderExploreGrid(allHexagrams)}
      </div>
    </div>
    ${renderNav('explore-nav')}
  `;

  const input = document.getElementById('explore-search');
  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const results = searchHexagrams(input.value);
      document.getElementById('explore-grid').innerHTML = renderExploreGrid(results);
    }, 200);
  });
}

function renderExploreGrid(hexagrams) {
  return hexagrams.map(h => {
    const tribe = getTribe(h.tribe);
    return `
      <div class="explore-pick" onclick="location.hash='#/explore/${h.num}'" style="--accent: ${tribe.color}">
        <div class="explore-pick-num">${String(h.num).padStart(2, '0')}</div>
        <div class="explore-pick-yao">${renderYaoMini(h)}</div>
        <div class="explore-pick-name">${h.name}</div>
        <div class="explore-pick-full">${h.fullName}</div>
      </div>
    `;
  }).join('');
}

// --- Explore Detail (show relationships) ---
function renderExplore(params) {
  const h = getHexagram(parseInt(params.num));
  if (!h) { navigate('#/explore'); return; }

  const tribe = getTribe(h.tribe);
  const zong = getZongGua(h);
  const cuo = getCuoGua(h);
  const hu = getHuGua(h);
  const zaGuaDef = getZaGuaDef(h.num);
  const guaCi = getGuaCi(h.num);
  const seqCtx = getSequenceContext(h.num);
  const palace = getPalace(h.num);

  const relations = [zong, cuo, hu];

  function renderRelationCard(rel) {
    const r = rel.hexagram;
    if (!r) return `<div class="relation-card empty"><div class="relation-label">${rel.label}</div><div class="relation-empty">无法计算</div></div>`;

    const rTribe = getTribe(r.tribe);
    const rYaoHtml = renderYaoMini(r);

    if (rel.isSelf) {
      return `
        <div class="relation-card is-self">
          <div class="relation-header">
            <span class="relation-label">${rel.label}</span>
            <span class="relation-desc">${rel.desc}</span>
          </div>
          <div class="relation-self-note">
            <span class="relation-self-icon">◎</span>
            本卦即${rel.label} — 结构对称
          </div>
        </div>
      `;
    }

    return `
      <div class="relation-card" onclick="location.hash='#/explore/${r.num}'">
        <div class="relation-header">
          <span class="relation-label">${rel.label}</span>
          <span class="relation-desc">${rel.desc}</span>
        </div>
        <div class="relation-body">
          <div class="relation-yao">${rYaoHtml}</div>
          <div class="relation-info">
            <div class="relation-name">${r.name}<span class="relation-fullname"> · ${r.fullName}</span></div>
            <div class="relation-hook">${getZaGuaDef(r.num) || ''}</div>
          </div>
          <span class="relation-arrow">›</span>
        </div>
      </div>
    `;
  }

  function renderSeqCard(data, direction) {
    if (!data || !data.hexagram) return '';
    const s = data.hexagram;
    const sTribe = getTribe(s.tribe);
    const arrow = direction === 'prev' ? '←' : '→';
    const label = direction === 'prev' ? '前一卦' : '后一卦';
    return `
      <div class="seq-card" onclick="location.hash='#/explore/${s.num}'">
        <div class="seq-direction">
          <span class="seq-arrow">${arrow}</span>
          <span class="seq-label">${label}</span>
        </div>
        <div class="seq-body">
          <div class="seq-yao">${renderYaoMini(s)}</div>
          <div class="seq-info">
            <div class="seq-name">${s.name}<span class="seq-fullname"> · ${s.fullName} · 第${String(s.num).padStart(2,'0')}卦</span></div>
            <div class="seq-hook">${getZaGuaDef(s.num) || ''}</div>
          </div>
          <span class="relation-arrow">›</span>
        </div>
        ${data.xuGuaText ? `<div class="seq-xugua">序卦传：${data.xuGuaText}</div>` : ''}
      </div>
    `;
  }

  function renderPalaceSection() {
    if (!palace) return '';
    const baseH = getHexagram(palace.baseNum);
    const memberCards = palace.members.map((num, idx) => {
      const m = getHexagram(num);
      if (!m) return '';
      const isCurrent = m.num === h.num;
      return `
        <div class="palace-member ${isCurrent ? 'current' : ''}" onclick="${isCurrent ? '' : `location.hash='#/explore/${m.num}'`}">
          <div class="palace-member-yao">${renderYaoMini(m)}</div>
          <div class="palace-member-name">${m.name}</div>
          <div class="palace-member-role">${['本宫','一世','二世','三世','四世','五世','游魂','归魂'][idx]}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="explore-section-title">归 宫</div>
      <div class="palace-section">
        <div class="palace-header">
          <span class="palace-name">${palace.name}</span>
          <span class="palace-role">本卦为${palace.role}</span>
        </div>
        <div class="palace-grid">
          ${memberCards}
        </div>
      </div>
    `;
  }

  app.innerHTML = `
    <div class="page">
      <div class="explore-header">
        <button class="back-btn" onclick="location.hash='#/explore'">‹ 返回</button>
        <span class="explore-header-title">卦象探索</span>
        <span style="width: 40px"></span>
      </div>

      <div class="explore-hero">
        <div class="explore-hero-yao">${renderYaoMini(h)}</div>
        <div class="explore-hero-info">
          <div class="explore-hero-name">${h.name}</div>
          <div class="explore-hero-full">${h.fullName} · 第${String(h.num).padStart(2, '0')}卦</div>
          ${guaCi ? `<div class="explore-hero-guaci">${h.name}卦：${guaCi}</div>` : ''}
          ${zaGuaDef ? `<div class="explore-hero-zagua">杂卦传：${h.name}，${zaGuaDef}</div>` : ''}
        </div>
      </div>

      ${h.status === 'done' ? `<a href="#/gua/${h.num}" class="explore-view-cards">查看三张卡 ›</a>` : ''}

      <div class="explore-section-title">关 系 卦</div>

      <div class="relation-list">
        ${relations.map(r => renderRelationCard(r)).join('')}
      </div>

      <div class="explore-section-title">脉 络</div>

      <div class="seq-list">
        ${renderSeqCard(seqCtx.prev, 'prev')}
        ${renderSeqCard(seqCtx.next, 'next')}
      </div>

      ${renderPalaceSection()}
    </div>
    ${renderNav('explore-nav')}
  `;
}


function renderAbout() {
  app.innerHTML = `
    <div class="page">
      <div class="about-container">
        <div class="about-brand">易经 · 情境识别</div>
        <div class="about-tagline">不是算命，不是国学辞典，不是吉凶占卜</div>

        <div class="about-section">
          <div class="about-section-title">这 是 什 么</div>
          <p>64卦是一套情境识别系统。</p>
          <p>语录库告诉你「应该怎样」，情境系统告诉你「<em>你现在在哪里</em>」——这个位置的内在逻辑是什么，能量会向哪个方向走。</p>
          <p>我们用 8 种情境分类（蓄积、扩张、受阻、收敛、转折、重构、连接、校准），把 64 种处境翻译成现代语言。每一卦三张卡，帮你识别当前处境，理解它的结构，找到应对方向。</p>
        </div>

        <div class="about-section">
          <div class="about-section-title">核 心 差 异</div>
          <p><em>8 族情境分类</em>——市面上没有的分类方式。按能量的方向和状态，把 64 卦组织成 8 种可识别的处境。</p>
          <p><em>三张卡可视化表达</em>——不是古文堆砌。用现代情境语言，配合能量结构图解。</p>
          <p><em>探索者姿态</em>——不做权威，做思维工具。所有解读是参考，不是定论。</p>
        </div>

        <div class="about-section">
          <div class="about-section-title">关 于 作 者</div>
          <p>@ 野野野在游戏人间</p>
          <p>用思维模型和能量模型的视角，重新理解易经。每一卦都是真实的思考过程，不是搬运。</p>
          <div class="about-link" id="wechat-link">
            <span class="about-link-icon">💬</span>
            <div class="about-link-text">
              <div class="about-link-title">公众号 · 野野野在游戏人间</div>
              <div class="about-link-desc">关注获取更新 · 后续小程序入口</div>
            </div>
            <span style="color: var(--faint)">›</span>
          </div>
        </div>

        <div class="about-footer">
          <p>探索者姿态 · 不做权威</p>
          <p style="margin-top: 4px; color: var(--faint)">2026 · 持续更新中</p>
        </div>
      </div>
    </div>
    ${renderNav('about')}
  `;
}

// --- Ruler ---
function renderRuler() {
  app.innerHTML = `
    <div class="page" style="padding-bottom: 0;">
      <iframe
        src="${import.meta.env.BASE_URL || '/'}cards/yijing_ruler_v1.html"
        title="易经分析尺"
        style="width: 100%; height: calc(100vh - 56px); border: none; display: block; flex: 1;"
      ></iframe>
    </div>
    ${renderNav('ruler')}
  `;
}

// ============================================
// Route Definitions
// ============================================
route('/', renderHome);
route('/tribe/:id', renderTribe);
route('/gua/:num', renderViewer);
route('/divine', renderDivine);
route('/list', renderList);
route('/explore', renderExploreIndex);
route('/explore/:num', renderExplore);
route('/about', renderAbout);
route('/ruler', renderRuler);

// ============================================
// Init
// ============================================
function handleRoute() {
  divineAborted = true; // cancel any running divination animation
  const hash = window.location.hash || '#/';
  const { handler, params } = matchRoute(hash);
  handler(params);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', () => {
  applyThemeToDocument(); // apply saved theme before first render
  handleRoute();
});
