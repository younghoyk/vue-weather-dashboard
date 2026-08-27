<script setup>
import { RouterView, useRoute } from 'vue-router'
import { DataAnalysis, HomeFilled, InfoFilled, PartlyCloudy } from '@element-plus/icons-vue'
import UnitToggler from '@/components/exercise/UnitToggler.vue'

const route = useRoute()
</script>

<template>
  <div class="app-shell">
    <div class="app-card">
      <header class="app-header">
        <h1>
          <el-icon><PartlyCloudy /></el-icon> Vue 실습 과제 - 판교 1반 유영호
        </h1>
      </header>

      <nav class="app-nav">
        <el-menu :default-active="route.path" mode="horizontal" router :ellipsis="false" class="app-nav__menu">
          <el-menu-item index="/"
            ><el-icon><HomeFilled /></el-icon><span>날씨 대시보드</span></el-menu-item
          >
          <el-menu-item index="/about"
            ><el-icon><InfoFilled /></el-icon><span>서비스 소개</span></el-menu-item
          >
          <el-menu-item index="/stats"
            ><el-icon><DataAnalysis /></el-icon><span>날씨 통계</span></el-menu-item
          >
        </el-menu>
        <UnitToggler />
      </nav>

      <main class="app-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 2.5rem 1rem;
}

.app-card {
  width: 100%;
  max-width: 640px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  height: fit-content;
}

.app-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.app-header h1 {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.25rem;
  color: var(--color-heading);
}

.app-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0 1rem;
}

.app-nav__menu {
  flex: 1;
  min-width: 0;
  border-bottom: none;
}

.app-main {
  padding: 1.5rem;
}
</style>
