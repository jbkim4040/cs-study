# CS Study

자료구조 · 운영체제 · 컴퓨터 네트워크를 인터랙티브하게 학습하는 웹 사이트.

🔗 **Live:** https://jbdatahub.com/cs-study/

## 특징

- **3개 과목 · 32개 주제** — 자료구조 14 · 운영체제 13 · 컴퓨터 네트워크 5
- 주제마다 **개념 · 용어 · 동작 원리 · 시각화 · 코드 · 퀴즈** 구성
- **인터랙티브 시각화** — 주제별 애니메이션 데모 (정렬, 페이징, TCP 핸드셰이크 등)
- **키워드 용어 풀이** — 호버 툴팁, 토글 on/off
- 학습 진행도 · 퀴즈 점수를 localStorage에 저장
- 모바일 대응

## 기술 스택

- Vite 5 + React 18 (plain JSX)
- 백엔드 없는 클라이언트 전용 정적 사이트
- 시각화 컴포넌트는 `React.lazy`로 코드 분할

## 개발

```bash
npm install
npm run dev      # http://localhost:5173/cs-study/
npm run build    # dist/ 정적 빌드
npm run preview  # 빌드 결과 미리보기
```

## 배포

Jenkins 파이프라인(`Jenkinsfile`)이 WAS 서버에서 빌드한 뒤 정적 파일을 갱신하고,
별도 `cs-study` 컨테이너(nginx)가 즉시 서빙합니다 → https://jbdatahub.com/cs-study/
