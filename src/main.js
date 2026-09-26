import { site } from './config.js';
import { tree, index, allPages } from './nav.js';
import { render } from './markdown.js';

const app = document.querySelector('#app');
const cache = new Map();

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const link = path => `#/${path}`;
const githubUrl = (kind, path) => `https://github.com/${site.repo}/${kind}/${site.branch}/content/${path}.md`;

async function load(path) {
  if (!cache.has(path)) {
    cache.set(path, fetch(`content/${path}.md`, { cache: 'no-cache' })
      .then(r => (r.ok ? r.text() : null))
      .catch(() => null));
  }
  return cache.get(path);
}

// ── 레이아웃 ────────────────────────────────────────────────
app.innerHTML = `
  <a class="skip-link" href="#content">본문으로 바로가기</a>
  <header class="topbar">
    <button class="menu-button" aria-label="목차 열기" aria-expanded="false">☰</button>
    <a class="brand" href="#/"><span class="brand-mark">攝</span><span><strong>${site.name}</strong><small>${site.englishName}</small></span></a>
    <form class="search" role="search" id="searchForm">
      <input type="search" id="searchInput" placeholder="문서 검색" aria-label="문서 검색" autocomplete="off">
      <button aria-label="검색">⌕</button>
      <div class="suggest" id="suggest" hidden></div>
    </form>
  </header>
  <div class="layout">
    <aside class="sidebar" id="sidebar"><nav aria-label="문서 목차">${tree.map(n => navItem(n, 0)).join('')}</nav></aside>
    <main id="content" tabindex="-1"></main>
    <aside class="toc" id="toc"></aside>
  </div>
  <footer class="site-footer">
    <p><strong>${site.name}</strong><span aria-hidden="true"> · </span>함께 기록하고 가꾸는 열린 지식 공간</p>
    <nav aria-label="하단 메뉴">
      <a href="#/overview/introduction">섭리 소개</a>
      <a href="#/search">전체 문서</a>
      <a href="https://github.com/${site.repo}" target="_blank" rel="noopener">GitHub ↗</a>
    </nav>
  </footer>
  <div class="scrim" id="scrim"></div>
`;

function navItem(node, depth) {
  const { number } = index.get(node.path);
  const kids = node.children || [];
  return `<div class="nav-item depth-${depth}" data-path="${node.path}">
    <div class="nav-row">
      ${kids.length ? `<button class="twisty" aria-label="${esc(node.title)} 펼치기">▸</button>` : '<span class="twisty-space"></span>'}
      <a href="${link(node.path)}"><span class="num">${number}</span>${esc(node.title)}</a>
    </div>
    ${kids.length ? `<div class="nav-children">${kids.map(k => navItem(k, depth + 1)).join('')}</div>` : ''}
  </div>`;
}

const sidebar = document.querySelector('#sidebar');
const content = document.querySelector('#content');
const toc = document.querySelector('#toc');

sidebar.addEventListener('click', e => {
  const twisty = e.target.closest('.twisty');
  if (twisty) twisty.closest('.nav-item').classList.toggle('open');
  if (e.target.closest('a')) closeMenu();
});

function syncSidebar(path) {
  sidebar.querySelectorAll('.nav-item').forEach(el => {
    const p = el.dataset.path;
    el.classList.toggle('active', p === path);
    if (path && (path === p || path.startsWith(`${p}/`))) el.classList.add('open');
  });
}

const menuButton = document.querySelector('.menu-button');
const scrim = document.querySelector('#scrim');
function closeMenu() { document.body.classList.remove('menu-open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.onclick = () => {
  const open = document.body.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
};
scrim.onclick = closeMenu;

// ── 페이지 ──────────────────────────────────────────────────
function breadcrumb(parents, node) {
  const items = [`<a href="#/">대문</a>`, ...parents.map(p => `<a href="${link(p.path)}">${esc(p.title)}</a>`), `<span>${esc(node.title)}</span>`];
  return `<nav class="breadcrumb" aria-label="현재 위치">${items.join('<i>›</i>')}</nav>`;
}

function childCards(node) {
  if (!node.children) return '';
  return `<section class="children"><h2 id="하위-문서">하위 문서</h2><div class="card-grid">${node.children.map(c => `
    <a class="doc-card" href="${link(c.path)}">
      <span class="num">${index.get(c.path).number}</span>
      <strong>${esc(c.title)}</strong><small>${esc(c.en || '')}</small>
      ${c.children ? `<ul>${c.children.map(g => `<li>${esc(g.title)}</li>`).join('')}</ul>` : ''}
    </a>`).join('')}</div></section>`;
}

function pager(path) {
  const i = allPages.findIndex(p => p.path === path);
  const prev = allPages[i - 1];
  const next = allPages[i + 1];
  return `<nav class="pager">
    ${prev ? `<a href="${link(prev.path)}"><small>← 이전 문서</small>${esc(prev.title)}</a>` : '<span></span>'}
    ${next ? `<a class="next" href="${link(next.path)}"><small>다음 문서 →</small>${esc(next.title)}</a>` : '<span></span>'}
  </nav>`;
}

function renderToc(headings) {
  const items = headings.filter(h => h.level <= 3);
  toc.innerHTML = items.length > 1
    ? `<div class="toc-inner"><b>이 문서의 목차</b>${items.map(h => `<a class="lv${h.level}" href="#${h.id}" data-anchor="${h.id}">${esc(h.text)}</a>`).join('')}</div>`
    : '';
}

toc.addEventListener('click', e => {
  const a = e.target.closest('a[data-anchor]');
  if (!a) return;
  e.preventDefault();
  document.getElementById(a.dataset.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
content.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]:not([href^="#/"])');
  if (!a) return;
  e.preventDefault();
  document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))?.scrollIntoView({ behavior: 'smooth' });
});

async function showPage(path) {
  const entry = index.get(path);
  if (!entry) return showNotFound(path);
  const { node, parents, number } = entry;
  document.title = `${node.title} - ${site.name}`;

  content.innerHTML = `<article class="doc">${breadcrumb(parents, node)}<h1><span class="num">${number}</span>${esc(node.title)}</h1><p class="loading">불러오는 중…</p></article>`;
  const source = await load(path);
  if (currentPath() !== path) return; // 그 사이 다른 문서로 이동함

  const { html, headings } = source ? render(source) : { html: '', headings: [] };
  const body = source
    ? html
    : `<aside class="callout draft"><b>아직 작성되지 않은 문서입니다.</b><p><a href="https://github.com/${site.repo}/new/${site.branch}/content?filename=${path}.md" target="_blank" rel="noopener">GitHub에서 이 문서 만들기</a></p></aside>`;
  if (node.children) headings.push({ level: 2, text: '하위 문서', id: '하위-문서' });

  content.innerHTML = `<article class="doc">
    ${breadcrumb(parents, node)}
    <header class="doc-head">
      <h1><span class="num">${number}</span>${esc(node.title)}</h1>
      ${node.en ? `<p class="en">${esc(node.en)}</p>` : ''}
      <div class="doc-tools">
        <a href="${githubUrl('edit', path)}" target="_blank" rel="noopener">✎ 편집</a>
        <a href="https://github.com/${site.repo}/commits/${site.branch}/content/${path}.md" target="_blank" rel="noopener">◷ 역사</a>
      </div>
    </header>
    <div class="doc-body">${body}</div>
    ${childCards(node)}
    ${pager(path)}
  </article>`;
  renderToc(headings);
}

function showHome() {
  document.title = `${site.name} - ${site.domain}`;
  toc.innerHTML = '';
  content.innerHTML = `<article class="home">
    <section class="welcome">
      <span class="kicker">${site.englishName}</span>
      <h1>${site.name}에 오신 것을 환영합니다</h1>
      <p>섭리의 역사와 창립자, 교리와 말씀, 성지와 교회를 한곳에 정리하는 온라인 백과사전입니다. 왼쪽 목차나 아래 분류에서 원하는 문서를 찾아보세요.</p>
      <div class="welcome-links">
        <a class="primary" href="#/overview/introduction">섭리 소개 읽기 →</a>
        <a href="#/search">전체 문서 검색</a>
      </div>
    </section>
    <section class="categories">
      <h2>분류</h2>
      <div class="card-grid wide">${tree.map(n => `
        <div class="cat-card">
          <a class="cat-title" href="${link(n.path)}"><span class="icon">${n.icon}</span><span><strong>${esc(n.title)}</strong><small>${esc(n.en)}</small></span></a>
          <p>${esc(n.desc)}</p>
          <ul>${flatten(n.children).map(c => `<li class="lv${c.depth}"><a href="${link(c.node.path)}">${esc(c.node.title)}</a></li>`).join('')}</ul>
        </div>`).join('')}
      </div>
    </section>
    <section class="stats">
      <div><strong>${tree.length}</strong><span>분류</span></div>
      <div><strong>${allPages.length}</strong><span>문서</span></div>
      <div><a href="https://github.com/${site.repo}" target="_blank" rel="noopener">GitHub에서 함께 편집하기 ↗</a></div>
    </section>
  </article>`;
}

function flatten(nodes = [], depth = 0) {
  return nodes.flatMap(node => [{ node, depth }, ...flatten(node.children, depth + 1)]);
}

function showNotFound(path) {
  document.title = `문서 없음 - ${site.name}`;
  toc.innerHTML = '';
  content.innerHTML = `<article class="doc"><h1>문서를 찾을 수 없습니다</h1><p><code>${esc(path)}</code> 경로에 해당하는 문서가 없습니다.</p><p><a href="#/">대문으로 돌아가기</a></p></article>`;
}

// ── 검색 ────────────────────────────────────────────────────
async function searchAll(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const texts = await Promise.all(allPages.map(p => load(p.path)));
  return allPages.map((page, i) => {
    const body = (texts[i] || '')
      .replace(/^\s*-\s*(상위 문서:\s*)?\[[^\]]*\]\(#\/[^)]*\)\s*$/gm, '') // 관련 문서 링크 목록은 검색에서 제외
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/^:::\w*/gm, '')
      .replace(/[#>*`|\-]/g, ' ').replace(/\s+/g, ' ').trim();
    const titleHit = `${page.title} ${page.en || ''}`.toLowerCase().includes(q);
    const pos = body.toLowerCase().indexOf(q);
    if (!titleHit && pos < 0) return null;
    const snippet = pos >= 0 ? body.slice(Math.max(0, pos - 40), pos + q.length + 60) : body.slice(0, 100);
    return { page, snippet, score: (titleHit ? 10 : 0) + (pos >= 0 ? 1 : 0) };
  }).filter(Boolean).sort((a, b) => b.score - a.score);
}

const highlight = (text, q) => esc(text).replace(new RegExp(esc(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), m => `<mark>${m}</mark>`);

async function showSearch(query) {
  document.title = `검색 - ${site.name}`;
  toc.innerHTML = '';
  const results = await searchAll(query);
  content.innerHTML = `<article class="doc">
    ${breadcrumb([], { title: '검색' })}
    <h1>문서 검색</h1>
    <form class="search big" id="bigSearch"><input type="search" value="${esc(query)}" placeholder="검색어를 입력하세요" aria-label="검색어"><button>검색</button></form>
    ${query ? `<p class="result-count">“${esc(query)}” 검색 결과 ${results.length}건</p>` : ''}
    <ol class="results">${results.map(r => `<li><a href="${link(r.page.path)}"><strong>${highlight(r.page.title, query)}</strong><small>${index.get(r.page.path).number} · ${esc(r.page.en || '')}</small><p>${highlight(r.snippet, query)}…</p></a></li>`).join('')}</ol>
    ${!query ? `<h2>전체 문서</h2><ul class="all-docs">${flatten(tree).map(c => `<li class="lv${c.depth}"><a href="${link(c.node.path)}">${index.get(c.node.path).number} ${esc(c.node.title)}</a></li>`).join('')}</ul>` : ''}
  </article>`;
  document.querySelector('#bigSearch').onsubmit = e => {
    e.preventDefault();
    location.hash = `#/search?q=${encodeURIComponent(e.currentTarget.querySelector('input').value)}`;
  };
}

const searchInput = document.querySelector('#searchInput');
const suggest = document.querySelector('#suggest');
document.querySelector('#searchForm').onsubmit = e => {
  e.preventDefault();
  suggest.hidden = true;
  location.hash = `#/search?q=${encodeURIComponent(searchInput.value)}`;
  searchInput.blur();
};
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  const hits = q ? allPages.filter(p => `${p.title} ${p.en || ''}`.toLowerCase().includes(q)).slice(0, 8) : [];
  suggest.hidden = !q;
  suggest.innerHTML = hits.map(p => `<a href="${link(p.path)}">${highlight(p.title, searchInput.value.trim())}<small>${esc(index.get(p.path).number)}</small></a>`).join('')
    + (q ? `<a class="full" href="#/search?q=${encodeURIComponent(searchInput.value)}">“${esc(searchInput.value)}” 본문 검색 →</a>` : '');
});
suggest.addEventListener('click', () => { suggest.hidden = true; searchInput.value = ''; });
document.addEventListener('click', e => { if (!e.target.closest('.search')) suggest.hidden = true; });
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); searchInput.focus(); }
  if (e.key === 'Escape') { suggest.hidden = true; closeMenu(); }
});

// ── 라우터 ──────────────────────────────────────────────────
const currentPath = () => decodeURIComponent(location.hash.replace(/^#\/?/, '').split('?')[0]).replace(/\/$/, '');

function route() {
  if (location.hash && !location.hash.startsWith('#/')) return; // 문서 안 앵커 이동
  const path = currentPath();
  const queryString = location.hash.split('?')[1];
  syncSidebar(path);
  if (!path) showHome();
  else if (path === 'search') showSearch(new URLSearchParams(queryString || '').get('q') || '');
  else showPage(path);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
