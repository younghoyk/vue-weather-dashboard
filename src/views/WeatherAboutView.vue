<script setup>
import { useRouter } from 'vue-router'
import { HomeFilled, InfoFilled } from '@element-plus/icons-vue'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="weather-about">
    <BaseDashboardCard title="서비스 소개" :icon="InfoFilled" icon-color="#409eff">
      <p class="about-lead">
        본 앱은 Vue 3, Vue Router, Pinia, Element Plus로 만든 실시간 날씨 대시보드입니다. OpenWeatherMap API로 실시간 기온·기상·대기질을 조회하고, Leaflet 지도를 클릭해 임의 위치의 날씨도 확인할 수 있습니다.
      </p>
      <ul class="about-list">
        <li>지연 로딩 라우팅 + catch-all 404 페이지</li>
        <li>도시 검색 (URL 쿼리 스트링 동기화)</li>
        <li>OpenWeatherMap 실시간 날씨 / 대기오염(AQI) API 연동</li>
        <li>브라우저 Geolocation 기반 "내 위치" 조회</li>
        <li>Leaflet 지도 클릭으로 임의 좌표 날씨 조회</li>
        <li>Pinia 스토어 기반 단위 변환 / 즐겨찾기</li>
        <li>전국 날씨 통계 페이지</li>
        <li>기타 외부 API 연동 (오늘의 한마디)</li>
      </ul>
      <el-button class="home-btn" type="primary" size="large" :icon="HomeFilled" @click="goHome">대시보드 홈으로 이동</el-button>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.about-lead {
  margin-bottom: 1rem;
}

.about-list {
  list-style: disc;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.home-btn {
  width: 100%;
}
</style>
