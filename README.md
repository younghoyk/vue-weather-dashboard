# Vue 실습 과제 — 날씨 대시보드

Vue 3 + Vue Router + Pinia + Element Plus로 만든 실시간 날씨 대시보드입니다. OpenWeatherMap API로 실시간 기온/기상/대기질을 조회하고, Leaflet 지도를 클릭해 임의 위치의 날씨도 확인할 수 있습니다.

## 주요 기능

- 지연 로딩 라우팅 + catch-all 404 페이지
- 도시 검색 (URL 쿼리 스트링 동기화)
- OpenWeatherMap 실시간 날씨 / 대기오염(AQI) API 연동
- 브라우저 Geolocation 기반 "내 위치" 조회
- Leaflet 지도 클릭으로 임의 좌표 날씨 조회
- Pinia 스토어 (단위 변환, 즐겨찾기)

## 프로젝트 설정

```sh
npm install
```

### 환경 변수

OpenWeatherMap API 키가 필요합니다. 프로젝트 루트에 `.env.local` 파일을 만들고 아래처럼 채워주세요 (`.env.example` 참고, 이 파일은 git에 커밋되지 않습니다):

```
VITE_OPENWEATHER_API_KEY=발급받은_키
```

### 개발 서버 실행

```sh
npm run dev
```

### 프로덕션 빌드

```sh
npm run build
```

### 린트

```sh
npm run lint
```

## 배포 (Vercel)

Vue Router가 history 모드를 쓰기 때문에 `vercel.json`에 모든 경로를 `index.html`로 rewrite하는 설정이 포함되어 있습니다. Vercel 프로젝트 설정의 Environment Variables에 `VITE_OPENWEATHER_API_KEY`를 등록해야 빌드 시 API 키가 반영됩니다.
