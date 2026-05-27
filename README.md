# 키오스크 해석기 - 배포 방법

## 파일 구조
```
kiosk-app/
├── api/
│   └── analyze.js       ← Anthropic API 호출 (서버)
├── public/
│   └── index.html       ← 화면 (프론트엔드)
├── vercel.json
└── package.json
```

---

## Vercel 배포 (무료, 5분이면 완료)

### 1단계 - GitHub에 올리기
1. https://github.com 접속 → 로그인
2. 우측 상단 + 버튼 → "New repository"
3. Repository name: `kiosk-analyzer` → Create
4. 위 파일들을 모두 업로드 (폴더 구조 그대로)

### 2단계 - Vercel 연결
1. https://vercel.com 접속 → GitHub로 로그인
2. "New Project" → 방금 만든 `kiosk-analyzer` 선택
3. "Deploy" 클릭

### 3단계 - API 키 설정 (중요!)
1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
2. 아래 값 추가:
   - Name: `ANTHROPIC_API_KEY`
   - Value: (본인의 Anthropic API 키 입력)
3. Save → Redeploy

### 완료!
배포되면 `https://kiosk-analyzer.vercel.app` 같은 링크가 생겨요.
그 링크를 공유하면 누구나 사용 가능합니다.

---

## Anthropic API 키 발급 방법
1. https://console.anthropic.com 접속
2. 로그인 → API Keys → Create Key
3. 복사해서 위 3단계에 붙여넣기
