# 하나님의 교회 지식사전

성경 지식사전과 교회 홈페이지의 성격을 결합한 반응형 정적 웹사이트입니다. 콘텐츠 담당자가 GitHub에서 안전하게 문구를 수정하고, 향후 독립 도메인을 연결할 수 있도록 구성했습니다.

## 로컬 실행

### Windows PowerShell에서 처음 내려받기

현재 `PS C:\Users\USER>`는 사용자의 홈 폴더이며 아직 이 프로젝트 폴더가
아닙니다. 먼저 GitHub 저장소 화면에서 초록색 **Code** 버튼을 누르고 HTTPS
주소를 복사한 다음 아래 명령을 실행합니다.

```powershell
cd C:\Users\USER\Documents
git clone <복사한-GitHub-저장소-주소> church-wiki
cd church-wiki
```

예를 들어 저장소 주소가 `https://github.com/example/church-wiki.git`이라면
다음과 같습니다.

```powershell
git clone https://github.com/example/church-wiki.git church-wiki
cd church-wiki
```

프롬프트가 `PS C:\Users\USER\Documents\church-wiki>`처럼 바뀌면 올바른
폴더에 들어온 것입니다. 아래 명령으로 `package.json`, `index.html`, `src`
폴더가 보이는지 확인할 수도 있습니다.

```powershell
ls
```

Git을 사용하지 않고 ZIP으로 받은 경우에는 ZIP 파일의 압축을 푼 다음,
PowerShell에서 해당 폴더로 이동합니다. 예를 들어 다운로드 폴더 아래
`wiki-cgm-main`에 압축을 풀었다면 다음과 같습니다.

```powershell
cd "$HOME\Downloads\wiki-cgm-main"
ls
```

### 사이트 실행

프로젝트 폴더 안에서 다음 명령을 실행합니다.

```bash
npm run dev
```

별도 패키지 설치와 Python 설치는 필요하지 않습니다. 명령을 실행한 뒤 브라우저에서
`http://localhost:4173`을 열면 현재 사이트를 확인할 수 있습니다. 서버를
종료할 때는 터미널에서 `Ctrl+C`를 누르세요.

`npm` 명령을 찾을 수 없다는 오류가 나오면 Node.js LTS를 설치한 뒤
PowerShell을 새로 열어 `node --version`과 `npm --version`을 확인하세요.

이미 내려받은 프로젝트 위치를 잊은 경우 PowerShell에서 다음 명령으로
`package.json`을 찾을 수 있습니다. 검색에는 시간이 조금 걸릴 수 있습니다.

```powershell
Get-ChildItem -Path $HOME -Filter package.json -File -Recurse -ErrorAction SilentlyContinue |
  Where-Object { Select-String -Path $_.FullName -Pattern 'church-knowledge-portal' -Quiet } |
  Select-Object -ExpandProperty DirectoryName
```

같은 Wi-Fi에 연결된 다른 기기에서 확인하려면 실행한 컴퓨터의 내부 IP를
확인한 후 `http://내부-IP:4173`으로 접속합니다. 이 방식은 미리보기용이며,
컴퓨터가 켜져 있고 방화벽에서 4173 포트를 허용한 동안에만 접속됩니다.

배포용 파일은 아래 명령 실행 후 `dist/`에 생성됩니다.

```bash
npm run build
npm run preview
```

`preview`를 실행했다면 동일하게 `http://localhost:4173`에서 빌드 결과를
확인할 수 있습니다.

## 콘텐츠 수정

- 메인 슬라이드, 주제 카드, 새 글 목록: `src/content.js`
- 본문 문구와 사이트 구조: `src/main.js`
- 색상, 글꼴, 반응형 디자인: `src/style.css`

## GitHub Pages 배포 및 도메인 연결

### 처음 한 번 설정하기

1. GitHub에 새 저장소를 만들고 이 프로젝트를 올립니다.
2. 저장소의 **Settings → Pages → Build and deployment → Source**를
   **GitHub Actions**로 설정합니다.
3. 작업 내용을 `main` 브랜치에 반영합니다.
4. **Actions** 탭의 `Deploy website to GitHub Pages` 작업이 초록색으로
   완료될 때까지 기다립니다.
5. **Settings → Pages**에 표시되는
   `https://사용자명.github.io/저장소명/` 주소로 접속합니다.

이후에는 `main` 브랜치가 갱신될 때마다 GitHub Actions가 사이트를 자동으로
빌드하고 Pages에 배포합니다. 배포 워크플로는 `dist/` 결과물을 사용합니다.

GitHub 저장소에 코드가 올라가 있기만 해서는 공개 사이트가 되지 않으며,
위의 Pages 설정과 첫 배포가 성공해야 외부에서 접속할 수 있습니다. 공개
GitHub Pages 주소 또는 연결한 도메인은 인터넷에 연결된 PC와 모바일에서
어디서든 접속할 수 있습니다. 단, GitHub 장애, DNS 전파 지연, 접속 지역의
네트워크 차단이 있는 경우에는 일시적으로 접속하지 못할 수 있습니다.

### 구매한 도메인 연결하기

1. **Settings → Pages → Custom domain**에 구매한 도메인을 입력합니다.
2. 도메인 업체의 DNS 관리 화면에서 GitHub가 안내하는 `A`, `AAAA` 또는
   `CNAME` 레코드를 등록합니다.
3. DNS 반영 후 Pages 설정에서 **Enforce HTTPS**를 활성화합니다.

DNS 변경은 즉시 반영되지 않고 수 시간에서 최대 48시간 정도 걸릴 수
있습니다. 도메인을 확정하기 전에는 `CNAME` 파일을 저장소에 추가하지 않는
것이 좋습니다.

### 현재 상태에서 확인할 수 있는 범위

현재 작업물은 소스 코드와 자동 배포 설정까지 준비된 상태입니다. 아직
실제 GitHub 원격 저장소와 Pages 주소가 연결되지 않았다면 외부에 공유할 수
있는 공개 링크는 없습니다. 위의 로컬 실행 절차로 먼저 확인한 뒤 GitHub에
푸시하고 Pages를 활성화해야 공개 URL이 만들어집니다.

> 실제 운영 전에는 연락처, 개인정보처리방침, 이용약관, 이미지 사용권을 검토하고 뉴스레터 폼을 이메일 서비스와 연결하세요.
