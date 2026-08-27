<script setup>
import { useRouter } from 'vue-router'
import { HomeFilled, QuestionFilled } from '@element-plus/icons-vue'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <el-result title="페이지를 찾을 수 없습니다." sub-title="요청하신 주소가 존재하지 않거나, 아직 개발되지 않았습니다.">
    <template #icon>
      <el-icon class="not-found__icon" color="#e6a23c"><QuestionFilled /></el-icon>
    </template>
    <template #extra>
      <el-button type="primary" size="large" :icon="HomeFilled" @click="goHome">날씨 메인으로 이동</el-button>
    </template>
  </el-result>
</template>

<style scoped>
.not-found__icon {
  font-size: 3.5rem;
}
</style>
