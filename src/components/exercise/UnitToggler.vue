<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const unitName = computed(() => (configStore.unit === 'celsius' ? '섭씨' : '화씨'))
</script>

<template>
  <div class="unit-toggler">
    <el-tag size="small" effect="plain">날씨단위: {{ unitName }}({{ configStore.unitSymbol }})</el-tag>
    <el-button size="small" type="primary" @click="configStore.toggleUnit()">단위변경</el-button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  white-space: nowrap;
}
</style>
