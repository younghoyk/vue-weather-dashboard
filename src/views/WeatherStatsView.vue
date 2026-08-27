<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { DataAnalysis, HomeFilled, IceDrink, Location, Odometer, StarFilled, Sunny } from '@element-plus/icons-vue'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import { weatherData } from '@/data/weatherData'
import { fetchCurrentWeatherByCoords, hasApiKey } from '@/services/weatherApi'
import { useFavoritesStore } from '@/stores/favoritesStore'

const router = useRouter()
const favoritesStore = useFavoritesStore()

const cities = ref([])
const isLoading = ref(true)
const loadError = ref('')

onMounted(async () => {
  if (!hasApiKey) {
    loadError.value = 'OpenWeatherMap API 키가 설정되지 않아 실시간 통계를 불러올 수 없습니다.'
    isLoading.value = false
    return
  }

  try {
    const liveResults = await Promise.all(weatherData.map((city) => fetchCurrentWeatherByCoords(city.lat, city.lon)))
    cities.value = weatherData.map((city, index) => ({
      ...city,
      ...liveResults[index],
      name: city.name,
    }))
  } catch {
    loadError.value = '실시간 통계를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
})

const averageTemp = computed(() => {
  const total = cities.value.reduce((sum, city) => sum + city.temp, 0)
  return (total / cities.value.length).toFixed(1)
})

const hottest = computed(() => cities.value.reduce((max, city) => (city.temp > max.temp ? city : max), cities.value[0]))

const coolest = computed(() => cities.value.reduce((min, city) => (city.temp < min.temp ? city : min), cities.value[0]))

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="weather-stats">
    <BaseDashboardCard title="전국 날씨 통계" :icon="DataAnalysis">
      <el-alert v-if="isLoading" title="실시간 통계를 불러오는 중..." type="info" :closable="false" show-icon />
      <el-alert v-else-if="loadError" :title="loadError" type="warning" :closable="false" show-icon />

      <template v-if="cities.length > 0">
        <el-row :gutter="16" class="stats-row">
          <el-col :span="8">
            <el-statistic title="평균 기온" :value="Number(averageTemp)" suffix="°C">
              <template #prefix
                ><el-icon><Odometer /></el-icon
              ></template>
            </el-statistic>
          </el-col>
          <el-col :span="8">
            <el-statistic title="관측 도시 수" :value="weatherData.length" suffix="곳">
              <template #prefix
                ><el-icon><Location /></el-icon
              ></template>
            </el-statistic>
          </el-col>
          <el-col :span="8">
            <el-statistic title="즐겨찾기 도시 수" :value="favoritesStore.favoriteCount" suffix="곳">
              <template #prefix
                ><el-icon color="#e6a23c"><StarFilled /></el-icon
              ></template>
            </el-statistic>
          </el-col>
        </el-row>

        <el-descriptions :column="1" border class="stats-descriptions">
          <el-descriptions-item>
            <template #label
              ><el-icon color="#f5a623"><Sunny /></el-icon> 최고 기온 지역</template
            >
            {{ hottest.name }} ({{ hottest.temp }}°C)
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label
              ><el-icon color="#4a90d9"><IceDrink /></el-icon> 최저 기온 지역</template
            >
            {{ coolest.name }} ({{ coolest.temp }}°C)
          </el-descriptions-item>
        </el-descriptions>
      </template>

      <el-button class="home-btn" type="primary" size="large" :icon="HomeFilled" @click="goHome">대시보드 홈으로 이동</el-button>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.stats-row {
  margin-bottom: 1.5rem;
}

.stats-descriptions {
  margin-bottom: 1.5rem;
}

.home-btn {
  width: 100%;
}

.weather-stats :deep(.el-descriptions__label .el-icon) {
  margin-right: 0.3rem;
  vertical-align: middle;
}
</style>
