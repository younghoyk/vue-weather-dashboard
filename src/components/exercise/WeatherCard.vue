<script setup>
import { computed } from 'vue'
import { Cloudy, Drizzling, Lightning, MostlyCloudy, PartlyCloudy, Pouring, Star, StarFilled, Sunny, WindPower } from '@element-plus/icons-vue'
import { useConfigStore } from '@/stores/configStore'
import { useFavoritesStore } from '@/stores/favoritesStore'

const props = defineProps({
  city: { type: Object, required: true },
})

const emit = defineEmits(['view-detail'])

const configStore = useConfigStore()
const favoritesStore = useFavoritesStore()

const hasLiveData = computed(() => typeof props.city.temp === 'number')

const CONDITION_ICONS_BY_MAIN = {
  Clear: { component: Sunny, color: '#f5a623' },
  Clouds: { component: Cloudy, color: '#909399' },
  Rain: { component: Pouring, color: '#4a90d9' },
  Drizzle: { component: Drizzling, color: '#79bbff' },
  Thunderstorm: { component: Lightning, color: '#6f42c1' },
  Snow: { component: MostlyCloudy, color: '#a0cfff' },
  Mist: { component: MostlyCloudy, color: '#a6a9ad' },
  Fog: { component: MostlyCloudy, color: '#a6a9ad' },
  Haze: { component: MostlyCloudy, color: '#a6a9ad' },
  Smoke: { component: MostlyCloudy, color: '#a6a9ad' },
  Dust: { component: MostlyCloudy, color: '#a6a9ad' },
  Sand: { component: MostlyCloudy, color: '#a6a9ad' },
  Squall: { component: Lightning, color: '#c0392b' },
  Tornado: { component: Lightning, color: '#c0392b' },
}

const CONDITION_ICONS_BY_MOCK_TEXT = {
  맑음: CONDITION_ICONS_BY_MAIN.Clear,
  비: CONDITION_ICONS_BY_MAIN.Rain,
  구름: CONDITION_ICONS_BY_MAIN.Clouds,
  흐림: CONDITION_ICONS_BY_MAIN.Mist,
}

const conditionIconMeta = computed(() => CONDITION_ICONS_BY_MAIN[props.city.conditionMain] ?? CONDITION_ICONS_BY_MOCK_TEXT[props.city.condition])
const conditionIcon = computed(() => conditionIconMeta.value?.component ?? PartlyCloudy)
const conditionIconColor = computed(() => conditionIconMeta.value?.color ?? '#a6a9ad')

const isHot = computed(() => hasLiveData.value && props.city.temp >= 26)
const temperatureFeelIcon = computed(() => (isHot.value ? Sunny : WindPower))
const temperatureFeelColor = computed(() => (isHot.value ? '#e0554f' : '#4a90d9'))
const favoriteIcon = computed(() => (favoritesStore.isFavorite(props.city.id) ? StarFilled : Star))

const displayTemp = computed(() => {
  const rawTemp = props.city.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
</script>

<template>
  <div class="weather-card">
    <div class="weather-card__info">
      <p class="weather-card__name">
        <el-icon :color="conditionIconColor"><component :is="conditionIcon" /></el-icon> {{ city.name }}
        <span v-if="hasLiveData">({{ city.condition }})</span>
      </p>
      <p class="weather-card__temp">
        <template v-if="hasLiveData">현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</template>
        <template v-else>정보 없음</template>
      </p>
      <el-tag v-if="hasLiveData" :type="isHot ? 'danger' : 'primary'" size="small" round>
        <el-icon :color="temperatureFeelColor"><component :is="temperatureFeelIcon" /></el-icon>
        {{ isHot ? '더위' : '선선함' }}
      </el-tag>
    </div>
    <div class="weather-card__actions">
      <el-button
        :type="favoritesStore.isFavorite(city.id) ? 'warning' : 'default'"
        :icon="favoriteIcon"
        circle
        :title="favoritesStore.isFavorite(city.id) ? '즐겨찾기 해제' : '즐겨찾기 추가'"
        @click="favoritesStore.toggleFavorite(city.id)"
      />
      <el-button @click="emit('view-detail', city.id)">상세보기</el-button>
    </div>
  </div>
</template>

<style scoped>
.weather-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1rem;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
}

.weather-card__name {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.weather-card__name .el-icon {
  flex-shrink: 0;
}

.weather-card__temp {
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
  margin-bottom: 0.4rem;
}

.weather-card__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}
</style>
