# Vue 실습 과제: 날씨 대시보드

Vue 3 + Vue Router + Pinia + Element Plus로 만든 실시간 날씨 대시보드입니다. OpenWeatherMap API로 실시간 기온/기상/대기질을 조회하고, Leaflet 지도를 클릭해 임의 위치의 날씨도 확인할 수 있습니다.

## 주요 기능

- 지연 로딩 라우팅 + catch-all 404 페이지
- 도시 검색 (URL 쿼리 스트링 동기화)
- OpenWeatherMap 실시간 날씨 / 대기오염(AQI) API 연동
- 브라우저 Geolocation 기반 "내 위치" 조회
- Leaflet 지도 클릭으로 임의 좌표 날씨 조회
- Pinia 스토어 (단위 변환, 즐겨찾기)

### 환경 변수

OpenWeatherMap API 키가 필요합니다. 프로젝트 루트에 `.env.local` 파일을 만들고 아래처럼 채워주세요 (`.env.example` 참고, 이 파일은 git에 커밋되지 않습니다):

```
VITE_OPENWEATHER_API_KEY=발급받은_키
```

## 배포 (Vercel)

Vue Router가 history 모드를 쓰기 때문에 `vercel.json`에 모든 경로를 `index.html`로 rewrite하는 설정이 포함되어 있습니다. Vercel 프로젝트 설정의 Environment Variables에 `VITE_OPENWEATHER_API_KEY`를 등록해야 빌드 시 API 키가 반영됩니다.

## 폴더 구조를 이렇게 둔 이유

- `components/exercise/`: 과제에서 지정한 실습용 부품 격리 폴더라 그대로 따랐다.
- `views/`: 라우터가 매핑하는 페이지 단위 컴포넌트만 두고, 재사용 가능한 로직은 최대한 components/stores/services 쪽으로 빼내려고 했다.
- `services/`: axios 호출 코드를 컴포넌트 밖으로 분리해서, 컴포넌트는 데이터가 axios로 오는지 fetch로 오는지 몰라도 되게 하고 싶었다.
- `data/weatherData.js`: 반응형 상태(state)가 아니라 그냥 고정된 조회용 테이블(도시 id/좌표/이름)이라 stores와 구분해서 뒀다. 처음엔 mock 날씨 값도 여기 같이 있었는데, 실시간 API가 그 자리를 대체하면서 순수 메타데이터만 남기게 됐다.
- `stores/`: 여러 화면이 공유해야 하는 상태(단위 설정, 즐겨찾기)만 두고, 화면 하나에서만 쓰는 상태는 각 컴포넌트/뷰 안에 그대로 뒀다.

## 단계별 학습 회고

배열을 필터링하는 computed는 금방 이해했는데 watch랑 watchEffect의 차이가 헷갈렸다. watch는 감시할 대상(source)을 명시적으로 지정해야 하고 그 값이 바뀔 때만 실행되는 반면,
watchEffect는 함수 안에서 참조하는 반응형 값을 알아서 추적해서 그중 하나라도 바뀌면 실행되고, 심지어 마운트 시점에 한 번은 무조건 즉시 실행된다는 게 처음엔 낯설었다. **- Weather Composition hands on -**

컴포넌트를 4개로 쪼갤 때 SearchBar랑 WeatherCard가 화면상으로는 BaseDashboardCard 슬롯 안에 들어있는 것처럼 보이는데, 실제로는 그 내용이 부모(WeatherParent)의
스코프에서 컴파일되고 평가된다는 걸 배웠다. 그래서 슬롯 안에 있어도 부모의 상태나 함수에 직접 바인딩할 수 있는 거였다. BaseDashboardCard는 그냥 레이아웃만 담당하고 실제 데이터 흐름에는 안 끼는 셈이었다. **- Weather Component hands on -**

router.push로 프로그래매틱 네비게이션하는 거랑 () => import(...) 형태의 lazy loading은 금방 익혔는데, catch-all route(/:pathMatch(.*)*)는 반드시 routes 배열
맨 마지막에 둬야 한다는 걸 몰라서 처음엔 다른 라우트가 전부 막히는 실수를 했다. 그리고 컴포넌트 내부에서 v-model을 쓰려면 prop을 직접 v-model에 걸 수 없고
(:model-value + @update:model-value로 풀어써야 함) props는 읽기 전용이라는 것도 여기서 처음 제대로 이해했다. **- Weather Router hands on -**

Pinia store에서 state/getters/actions가 각각 ref/computed/일반 함수에 대응된다는 건 이해하기 편했다. 근데 store랑 composable의 차이(store는 앱 전체에
하나뿐인 싱글턴, composable은 호출할 때마다 독립된 새 인스턴스)를 헷갈려서, 온도 변환 로직을 여러 컴포넌트에 똑같이 중복해서 넣어야 하는 이유를 처음엔 이해하지 못했다.
각 카드가 서로 다른 props.city.temp를 계산해야 하니 store 하나로는 해결이 안 되는 거였다. **- Weather Store hands on -**

실제 OpenWeatherMap API를 연결하면서 스프레드 연산자 순서 실수를 두 번이나 했다. { name: '내 위치', ...live } 처럼 쓰면 뒤에 오는 live.name이
앞의 name을 그대로 덮어써버린다는 걸 화면에 엉뚱한 이름이 뜨고 나서야 알아챘다. 그리고 API 키를 실수로 채팅과 코드 주석에 그대로 노출시켜서, .env.local로 옮기고
.gitignore의 *.local 패턴으로 가리는 작업을 따로 해야 했다. **- Weather Axios hands on -**

Element Plus로 바꾸면서 el-descriptions-item의 label prop은 문자열만 받아서 아이콘 컴포넌트를 못 넣는다는 걸 알고 #label 슬롯을 대신 썼다.
그리고 지도(Leaflet) 마커를 클릭해도 재조회가 안 되는 버그를 고치면서, bubblingMouseEvents 옵션이 겹쳐진 레이어끼리의 전파에만 관여하고 지도 자체의 click 핸들러까지는
안 이어진다는 걸 Leaflet 소스코드를 직접 읽어보고서야 알았다. 추측만으로 고치려다 두 번 실패해서, 라이브러리 내부 동작은 결국 소스를 읽어야 확실해진다는 걸 느꼈다. **- Weather UI Library hands on -**

빌드하고 나서 dist 파일 안에 VITE_ 환경변수가 실제 값 그대로 박혀있는 걸 grep으로 확인했다. .env.local이 git에는 안 올라가지만 빌드된 결과물 안에는
평문으로 남는다는 게 완전히 다른 문제라는 걸 처음 알았다 (Vite가 빌드 시점에 값을 그대로 치환해버리기 때문). 그리고 Vue Router가 history 모드라서 새로고침하면 404가 날 수 있어서,
vercel.json에 모든 경로를 index.html로 rewrite하는 설정을 따로 추가해야 한다는 것도 배포해보고 나서야 알았다. **- Weather Deployment hands on -**
