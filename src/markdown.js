// 외부 라이브러리 없이 동작하는 간단한 마크다운 변환기.
// 지원: 제목(#~####), 문단, 목록(-, 1.), 인용(>), 구분선(---), 표(|), 굵게/기울임/코드/링크, :::note 상자

const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const slugify = text => text.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');

function inline(text) {
  return escape(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
      const external = /^https?:/.test(href);
      return `<a href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
    });
}

export function render(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  const headings = [];
  let i = 0;

  const collect = test => {
    const block = [];
    while (i < lines.length && test(lines[i])) block.push(lines[i++]);
    return block;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      const level = Math.max(heading[1].length, 2); // 문서 제목이 h1이므로 # 도 h2로 표시
      const text = heading[2].trim();
      const id = slugify(text);
      headings.push({ level, text, id });
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      i++; continue;
    }

    if (/^-{3,}\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

    const note = line.match(/^:::(\w+)\s*(.*)$/);
    if (note) {
      i++;
      const block = collect(l => !/^:::\s*$/.test(l));
      i++;
      out.push(`<aside class="callout ${note[1]}">${note[2] ? `<b>${inline(note[2])}</b>` : ''}${render(block.join('\n')).html}</aside>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      const block = collect(l => /^>\s?/.test(l)).map(l => l.replace(/^>\s?/, ''));
      out.push(`<blockquote>${render(block.join('\n')).html}</blockquote>`);
      continue;
    }

    if (/^\|/.test(line)) {
      const rows = collect(l => /^\|/.test(l)).map(l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
      const hasHeader = rows[1] && rows[1].every(c => /^:?-+:?$/.test(c));
      const head = hasHeader ? `<thead><tr>${rows[0].map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead>` : '';
      const body = (hasHeader ? rows.slice(2) : rows).map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('');
      out.push(`<div class="table-wrap"><table>${head}<tbody>${body}</tbody></table></div>`);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = collect(l => /^\s*[-*]\s+/.test(l)).map(l => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`);
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = collect(l => /^\s*\d+\.\s+/.test(l)).map(l => `<li>${inline(l.replace(/^\s*\d+\.\s+/, ''))}</li>`);
      out.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    const para = collect(l => l.trim() && !/^(#{1,4}\s|>|\||\s*[-*]\s|\s*\d+\.\s|:::|-{3,}\s*$)/.test(l));
    if (!para.length) para.push(lines[i++]); // 어떤 규칙에도 맞지 않는 줄은 문단으로 처리
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }

  return { html: out.join('\n'), headings };
}
