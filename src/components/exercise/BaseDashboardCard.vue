<script setup>
defineProps({
  title: { type: String, required: true },
  icon: { type: [Object, Function], default: null },
  iconColor: { type: String, default: '' },
})
</script>

<template>
  <el-card class="dashboard-card" shadow="never">
    <template #header>
      <div class="dashboard-card__header">
        <span class="dashboard-card__title">
          <el-icon v-if="icon" :color="iconColor || undefined"><component :is="icon" /></el-icon>
          {{ title }}
        </span>
        <slot name="actions" />
      </div>
    </template>
    <slot />
  </el-card>
</template>

<style scoped>
.dashboard-card {
  margin-bottom: 1.25rem;
}

.dashboard-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.dashboard-card__title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>
