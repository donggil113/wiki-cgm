import './style.css';
import { featured, cards, articles } from './content.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <header>
    <div class="utility"><div class="wrap"><span>하나님의 말씀을 가까이</span><nav><a href="#about">교회 소개</a><a href="#news">새소식</a><a href="#contact">문의</a></nav></div></div>
    <div class="header-main wrap">
      <a class="brand" href="#" aria-label="홈으로"><span class="brand-mark">✦</span><span><strong>하나님의 교회</strong><small>지식사전</small></span></a>
      <button class="search-open" aria-label="검색 열기">⌕ <span>검색</span></button>
      <button class="menu-button" aria-label="메뉴 열기">☰</button>
    </div>
    <nav class="main-nav"><div class="wrap"><a href="#bible">성경</a><a href="#faith">신앙</a><a href="#church">교회</a><a href="#family">가정</a><a href="#news">소식</a><a href="#about">지식사전 소개</a></div></nav>
  </header>
  <main>
    <section class="hero" style="--hero:url('${featured[0].image}')">
      <div class="hero-shade"></div><div class="hero-content wrap"><span class="eyebrow">KNOWLEDGE &amp; FAITH</span><h1>${featured[0].title}</h1><p>${featured[0].text}</p><a href="#bible" class="hero-button">자세히 보기 <b>→</b></a></div>
      <div class="slider-controls"><button id="prev" aria-label="이전 슬라이드">←</button><span id="slideNo">01</span><i></i><span>03</span><button id="next" aria-label="다음 슬라이드">→</button></div>
    </section>
    <section class="quick wrap" id="bible">
      ${cards.map((c, i) => `<article class="quick-card ${c.color}" id="${['bible','faith','church'][i]}"><div class="quick-icon">${c.icon}</div><span>${c.label}</span><h2>${c.title}</h2><p>${c.text}</p><a href="#articles">살펴보기 <b>→</b></a></article>`).join('')}
    </section>
    <section class="intro" id="about"><div class="wrap intro-grid"><div><span class="section-kicker">ABOUT THE ENCYCLOPEDIA</span><h2>깊이 있는 지식,<br><em>따뜻한 믿음</em>을 만납니다.</h2></div><div><p>하나님의 교회 지식사전은 성경과 신앙에 관한 정확하고 유익한 정보를 누구나 쉽게 이해할 수 있도록 전합니다.</p><p>다양한 주제의 글과 자료를 통해 성경 속 지혜를 발견하고, 일상에서 사랑을 실천하는 기쁨을 만나보세요.</p><a class="text-link" href="#articles">지식사전 둘러보기 <b>↗</b></a></div></div></section>
    <section class="articles wrap" id="articles"><div class="section-head"><div><span class="section-kicker">NEW ARTICLES</span><h2>새로운 이야기</h2></div><a href="#">전체 보기 <b>＋</b></a></div><div class="article-grid">${articles.map((a,i)=>`<article><div class="article-number">0${i+1}</div><span>${a.tag}</span><h3>${a.title}</h3><time>${a.date}</time><a href="#" aria-label="${a.title} 읽기">↗</a></article>`).join('')}</div></section>
    <section class="verse" id="family"><div class="wrap"><span>오늘의 말씀</span><blockquote>“서로 사랑하라 내가 너희를 사랑한 것 같이<br>너희도 서로 사랑하라”</blockquote><cite>요한복음 13장 34절</cite></div></section>
    <section class="newsletter" id="news"><div class="wrap"><div><span class="section-kicker">NEWSLETTER</span><h2>새로운 소식을 받아보세요.</h2></div><form id="newsletter"><input type="email" required placeholder="이메일 주소를 입력해 주세요" aria-label="이메일 주소"><button>구독하기</button></form></div></section>
  </main>
  <footer id="contact"><div class="wrap footer-grid"><div class="footer-brand"><strong>하나님의 교회</strong><span>CHURCH OF GOD</span></div><div><b>바로가기</b><a href="#about">교회 소개</a><a href="#bible">성경 지식</a><a href="#news">새소식</a></div><div><b>안내</b><a href="#">이용약관</a><a href="#">개인정보처리방침</a><a href="mailto:hello@example.org">문의하기</a></div><div><b>함께 나누는 믿음과 사랑</b><p>이 사이트의 콘텐츠는 GitHub에서 안전하게 관리되며 전문가와 함께 지속적으로 업데이트됩니다.</p></div></div><div class="copyright wrap">© 2026 Church of God. All rights reserved.</div></footer>
  <div class="search-modal" role="dialog" aria-modal="true" aria-label="통합 검색"><button class="search-close" aria-label="닫기">×</button><div><span>통합 검색</span><form id="searchForm"><input autofocus placeholder="궁금한 내용을 검색해 보세요" aria-label="검색어"><button>검색</button></form><p id="searchResult">성경, 신앙, 교회 관련 지식을 찾아보세요.</p></div></div>
`;

let current = 0;
const hero = document.querySelector('.hero');
function showSlide(index) {
  current = (index + featured.length) % featured.length;
  const item = featured[current];
  hero.style.setProperty('--hero', `url('${item.image}')`);
  hero.querySelector('h1').textContent = item.title;
  hero.querySelector('.hero-content p').textContent = item.text;
  document.querySelector('#slideNo').textContent = `0${current + 1}`;
}
document.querySelector('#next').addEventListener('click', () => showSlide(current + 1));
document.querySelector('#prev').addEventListener('click', () => showSlide(current - 1));

const modal = document.querySelector('.search-modal');
document.querySelector('.search-open').onclick = () => modal.classList.add('open');
document.querySelector('.search-close').onclick = () => modal.classList.remove('open');
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });
document.querySelector('#searchForm').onsubmit = e => { e.preventDefault(); const q = e.currentTarget.querySelector('input').value; document.querySelector('#searchResult').textContent = q ? `“${q}”에 관한 콘텐츠는 준비 중입니다.` : '검색어를 입력해 주세요.'; };
document.querySelector('#newsletter').onsubmit = e => { e.preventDefault(); e.currentTarget.innerHTML = '<p class="success">✓ 구독 신청이 완료되었습니다. 감사합니다.</p>'; };
document.querySelector('.menu-button').onclick = () => document.querySelector('.main-nav').classList.toggle('open');
