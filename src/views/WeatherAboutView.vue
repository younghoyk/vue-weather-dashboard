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
      <p class="about-lead">본 앱은 Vue 3 및 Vue Router 4 기반 제작된 실습용 기상 관측 대시보드 시스템입니다.</p>
      <ul class="about-list">
        <li><code>components/exercise/</code> 폴더 내부의 독립 부품 연동</li>
        <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>
        <li>URL 쿼리 스트링 매핑을 활용한 실시간 검색 상태 동기화</li>
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

.about-list code {
  background: var(--el-fill-color-light);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
}

.home-btn {
  width: 100%;
}
</style>
