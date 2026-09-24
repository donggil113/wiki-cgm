# 섭리 위키 (sumni.wiki)

섭리의 역사와 창립자, 교리와 말씀, 성지와 교회를 정리하는 위키형 정적 웹사이트입니다.
별도 패키지 설치 없이 Node.js만 있으면 실행되며, GitHub Pages로 자동 배포됩니다.

## 문서 구조

```
1. 개요 (Overview)            content/overview/
   └ 섭리 소개                  introduction.md
2. 창립자 (Founder)           content/founder/
   ├ 생애와 여정                life.md, life/
   │  ├ 사생애                  life/early-life.md
   │  ├ 예수님을 만난 사연      life/meeting-jesus.md
   │  └ 공생애                  life/public-ministry.md
   ├ 신앙 철학                  philosophy.md
   └ 베트남 참전기              vietnam.md
3. 교리 및 신학 (Doctrine)    content/doctrine/
   ├ 핵심 교리                  core.md, core/
   │  ├ 삼위일체 · 부활 · 재림 · 휴거
   └ 심화 교리 (추후 확장용)    advanced.md
4. 말씀 (Teachings)           content/teachings/
   └ 주제별 말씀                topics.md, topics/
      ├ 두 길 · 자기를 만들어라 · 시간 승리
5. 성지 및 장소 (Places)      content/places/
   └ 월명동 소개                wolmyeongdong.md
6. 교회 안내 (Churches)       content/churches/
   └ 지역별 대표 교회           regions.md, regions/
      ├ 서울/수도권 · 충청/대전 · 영남/호남 · 해외 교회
```

## 문서 편집하기

각 문서는 `content/` 폴더의 Markdown(`.md`) 파일 하나입니다.

- **가장 쉬운 방법**: 사이트에서 문서 제목 옆 **✎ 편집** 버튼 → GitHub 편집 화면에서
  수정 → **Commit changes**. `main` 브랜치에 반영되면 1~2분 뒤 사이트에 자동 반영됩니다.
- **◷ 역사** 버튼을 누르면 그 문서의 수정 기록을 볼 수 있습니다.

### 사용할 수 있는 문법

```markdown
## 큰 제목            → 문서 안의 섹션 (오른쪽 목차에 표시)
### 작은 제목
**굵게**  *기울임*  `코드`
[다른 문서 링크](#/founder/philosophy)
[외부 링크](https://example.com)
- 목록
1. 번호 목록
> 인용문 (말씀 구절 등)
---                   → 구분선
| 표 | 머리글 |
|---|---|
| 내용 | 내용 |
:::note 상자 제목
강조 상자 안의 내용
:::
```

### 새 문서 추가하기

1. `content/` 아래 원하는 위치에 `.md` 파일을 만듭니다.
   예: `content/teachings/topics/faith.md`
2. `src/nav.js`에서 해당 위치의 `children` 배열에 항목을 추가합니다.
   ```js
   { path: 'teachings/topics/faith', title: '믿음', en: 'Faith' },
   ```
   `path`는 파일 경로에서 `content/`와 `.md`를 뺀 값입니다.

목차, 문서 번호(예: 4.1.4), 상위 문서의 하위 문서 카드, 이전/다음 문서, 검색에
자동으로 반영됩니다.

## 파일 구성

| 경로 | 역할 |
|---|---|
| `content/**/*.md` | 문서 본문 |
| `src/nav.js` | 문서 목차(트리) 구조 |
| `src/config.js` | 사이트 이름, 도메인, GitHub 저장소 주소 |
| `src/main.js` | 화면 구성, 라우팅, 검색 |
| `src/markdown.js` | Markdown → HTML 변환 |
| `src/style.css` | 디자인 (다크 모드, 모바일 대응 포함) |

저장소를 다른 계정(예: `sumniwiki`)으로 옮기면 `src/config.js`의 `repo` 값만 바꾸면
편집/역사 버튼이 새 저장소를 가리킵니다.

## 로컬 실행

```bash
npm run dev       # http://localhost:4173
npm run build     # dist/ 에 배포용 파일 생성
npm run preview   # 빌드 결과 확인
```

Node.js LTS만 설치되어 있으면 됩니다. 종료는 `Ctrl+C`.

## 배포 및 도메인 (sumni.wiki)

1. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
2. `main` 브랜치에 반영되면 `Deploy website to GitHub Pages` 워크플로가 자동 배포합니다.
3. **Settings → Pages → Custom domain**에 `sumni.wiki`를 입력하고 저장합니다.
4. 도메인 업체 DNS에 GitHub Pages 레코드를 등록합니다.
   - `A` 레코드(@): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www`를 쓰려면 `CNAME` 레코드: `<계정명>.github.io`
5. DNS 반영 후(최대 48시간) **Enforce HTTPS**를 켭니다.
