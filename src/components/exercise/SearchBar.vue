<script setup>
import { Search } from '@element-plus/icons-vue'

defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '검색할 도시 이름 입력' },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="search-bar">
    <el-input :model-value="modelValue" :placeholder="placeholder" clearable @update:model-value="$emit('update:modelValue', $event)">
      <template #prefix
        ><el-icon><Search /></el-icon
      ></template>
    </el-input>
    <p class="search-bar__status">검색 중인 도시: {{ modelValue }}</p>
  </div>
</template>

<style scoped>
.search-bar__status {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--el-text-color-secondary);
}
</style>
