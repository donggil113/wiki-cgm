// 위키 문서 구조. 각 항목의 path는 주소(#/path)이자 content/<path>.md 파일 위치입니다.
// 새 문서를 추가하려면 children에 항목을 넣고 같은 경로에 .md 파일을 만드세요.
export const tree = [
  {
    path: 'overview', title: '개요', en: 'Overview', icon: '①',
    desc: '섭리 위키의 출발점. 섭리를 처음 접하는 분을 위한 소개 문서입니다.',
    children: [
      { path: 'overview/introduction', title: '섭리 소개', en: 'Introduction' },
    ],
  },
  {
    path: 'founder', title: '창립자', en: 'Founder', icon: '②',
    desc: '창립자의 생애와 여정, 신앙 철학, 베트남 참전 기록을 다룹니다.',
    children: [
      {
        path: 'founder/life', title: '생애와 여정', en: 'Life & Journey',
        children: [
          { path: 'founder/life/early-life', title: '사생애', en: 'Early Life' },
          { path: 'founder/life/meeting-jesus', title: '예수님을 만난 사연', en: 'Meeting Jesus' },
          { path: 'founder/life/public-ministry', title: '공생애', en: 'Public Ministry' },
        ],
      },
      { path: 'founder/philosophy', title: '신앙 철학', en: 'Philosophy of Faith' },
      { path: 'founder/vietnam', title: '베트남 참전기', en: 'Vietnam War Service' },
    ],
  },
  {
    path: 'doctrine', title: '교리 및 신학', en: 'Doctrine', icon: '③',
    desc: '삼위일체, 부활, 재림, 휴거 등 핵심 교리와 심화 교리를 정리합니다.',
    children: [
      {
        path: 'doctrine/core', title: '핵심 교리', en: 'Core Doctrines',
        children: [
          { path: 'doctrine/core/trinity', title: '삼위일체', en: 'Trinity' },
          { path: 'doctrine/core/resurrection', title: '부활', en: 'Resurrection' },
          { path: 'doctrine/core/second-coming', title: '재림', en: 'Second Coming' },
          { path: 'doctrine/core/rapture', title: '휴거', en: 'Rapture' },
        ],
      },
      { path: 'doctrine/advanced', title: '심화 교리', en: 'Advanced Doctrines' },
    ],
  },
  {
    path: 'teachings', title: '말씀', en: 'Teachings', icon: '④',
    desc: '주제별로 정리한 말씀 문서 모음입니다.',
    children: [
      {
        path: 'teachings/topics', title: '주제별 말씀', en: 'Teachings by Topic',
        children: [
          { path: 'teachings/topics/two-ways', title: '두 길', en: 'The Two Ways' },
          { path: 'teachings/topics/make-yourself', title: '자기를 만들어라', en: 'Make Yourself' },
          { path: 'teachings/topics/time-victory', title: '시간 승리', en: 'Victory over Time' },
        ],
      },
    ],
  },
  {
    path: 'places', title: '성지 및 장소', en: 'Places', icon: '⑤',
    desc: '월명동을 비롯한 성지와 주요 장소를 소개합니다.',
    children: [
      { path: 'places/wolmyeongdong', title: '월명동 소개', en: 'Wolmyeongdong' },
    ],
  },
  {
    path: 'churches', title: '교회 안내', en: 'Churches', icon: '⑥',
    desc: '국내외 지역별 대표 교회를 안내합니다.',
    children: [
      {
        path: 'churches/regions', title: '지역별 대표 교회', en: 'Churches by Region',
        children: [
          { path: 'churches/regions/seoul', title: '서울/수도권', en: 'Seoul & Capital Area' },
          { path: 'churches/regions/chungcheong', title: '충청/대전', en: 'Chungcheong & Daejeon' },
          { path: 'churches/regions/yeongnam-honam', title: '영남/호남', en: 'Yeongnam & Honam' },
          { path: 'churches/regions/overseas', title: '해외 교회', en: 'Overseas' },
        ],
      },
    ],
  },
];

// 경로 → { node, parents, number } 색인
export const index = new Map();
(function walk(nodes, parents, prefix) {
  nodes.forEach((node, i) => {
    const number = prefix ? `${prefix}.${i + 1}` : `${i + 1}`;
    index.set(node.path, { node, parents, number });
    if (node.children) walk(node.children, [...parents, node], number);
  });
})(tree, [], '');

export const allPages = [...index.values()].map(entry => entry.node);
