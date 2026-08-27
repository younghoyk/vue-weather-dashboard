<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Back, ChatDotRound, DataAnalysis, Histogram, Location, Odometer, PartlyCloudy, TrendCharts, Umbrella, Warning, WindPower } from '@element-plus/icons-vue'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import { findCityById } from '@/data/weatherData'
import { useConfigStore } from '@/stores/configStore'
import { aqiLabel, fetchAirPollution, fetchCurrentWeatherByCoords, hasApiKey } from '@/services/weatherApi'
import { fetchRandomAdvice } from '@/services/adviceApi'

const AQI_COLORS = {
  1: '#67c23a',
  2: '#95d475',
  3: '#e6a23c',
  4: '#f56c6c',
  5: '#c9302c',
}

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const city = ref(null)
const airQuality = ref(null)
const advice = ref('')
const loadError = ref('')

function loadMyLocationDetail() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      loadError.value = '이 브라우저는 위치 정보 조회를 지원하지 않습니다.'
      resolve()
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const live = await fetchCurrentWeatherByCoords(latitude, longitude)
          city.value = {
            ...live,
            id: 'my_location',
            name: '내 위치',
            region: `현재 위치 (${live.name})`,
          }
          airQuality.value = await fetchAirPollution(live.lat, live.lon)
        } catch {
          loadError.value = '실시간 날씨 정보를 불러오지 못했습니다.'
        }
        resolve()
      },
      () => {
        loadError.value = '위치 정보 접근이 거부되었거나 확인할 수 없습니다.'
        resolve()
      },
    )
  })
}

onMounted(async () => {
  if (!hasApiKey) {
    loadError.value = 'OpenWeatherMap API 키가 설정되지 않아 실시간 정보를 불러올 수 없습니다.'
    city.value = route.params.cityId === 'my_location' ? null : (findCityById(route.params.cityId) ?? null)
    return
  }

  if (route.params.cityId === 'my_location') {
    await loadMyLocationDetail()
    fetchRandomAdvice()
      .then((text) => (advice.value = text))
      .catch(() => {})
    return
  }

  const meta = findCityById(route.params.cityId) ?? null
  city.value = meta
  if (!meta) return

  fetchRandomAdvice()
    .then((text) => (advice.value = text))
    .catch(() => {})

  try {
    const live = await fetchCurrentWeatherByCoords(meta.lat, meta.lon)
    city.value = { ...meta, ...live, name: meta.name }
    airQuality.value = await fetchAirPollution(live.lat, live.lon)
  } catch {
    loadError.value = '실시간 날씨 정보를 불러오지 못했습니다.'
  }
})

const hasLiveData = computed(() => typeof city.value?.temp === 'number')

const displayTemp = computed(() => {
  const rawTemp = city.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

const tempIconColor = computed(() => (hasLiveData.value && city.value.temp >= 26 ? '#e0554f' : '#4a90d9'))
const aqiColor = computed(() => AQI_COLORS[airQuality.value?.main.aqi] ?? undefined)

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="weather-detail">
    <BaseDashboardCard v-if="city" title="지역별 상세 기상 관측 정보" :icon="TrendCharts">
      <el-alert v-if="loadError" :title="loadError" type="warning" :closable="false" show-icon class="detail-alert" />

      <el-descriptions :column="1" border>
        <el-descriptions-item>
          <template #label
            ><el-icon><Location /></el-icon> 지정 지역</template
          >
          {{ city.region }}
        </el-descriptions-item>
        <template v-if="hasLiveData">
          <el-descriptions-item>
            <template #label
              ><el-icon :color="tempIconColor"><Odometer /></el-icon> 실시간 기온</template
            >
            {{ displayTemp }}{{ configStore.unitSymbol }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label
              ><el-icon color="#909399"><PartlyCloudy /></el-icon> 기상 현황</template
            >
            {{ city.condition }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label
              ><el-icon color="#4a90d9"><Umbrella /></el-icon> 대기 습도</template
            >
            {{ city.humidity }}%
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label
              ><el-icon color="#5470c6"><WindPower /></el-icon> 현재 풍속</template
            >
            {{ city.wind }}m/s
          </el-descriptions-item>
        </template>
        <el-descriptions-item v-else label="실시간 정보">정보 없음</el-descriptions-item>
        <el-descriptions-item v-if="airQuality">
          <template #label
            ><el-icon :color="aqiColor"><Histogram /></el-icon> 대기질 지수(AQI)</template
          >
          {{ aqiLabel[airQuality.main.aqi] }}
        </el-descriptions-item>
        <el-descriptions-item v-if="airQuality">
          <template #label
            ><el-icon :color="aqiColor"><DataAnalysis /></el-icon> 초미세먼지(PM2.5)</template
          >
          {{ airQuality.components.pm2_5.toFixed(1) }}µg/m³
        </el-descriptions-item>
      </el-descriptions>

      <el-alert v-if="advice" type="info" :closable="false" class="advice-alert">
        <template #title
          ><el-icon color="#67c23a"><ChatDotRound /></el-icon> 오늘의 한마디: {{ advice }}</template
        >
      </el-alert>
    </BaseDashboardCard>

    <BaseDashboardCard v-else title="알림" :icon="Warning" icon-color="#e6a23c">
      <p>해당 도시 정보를 찾을 수 없습니다. (cityId: {{ route.params.cityId }})</p>
    </BaseDashboardCard>

    <el-button class="back-btn" type="primary" size="large" :icon="Back" @click="goHome">메인 대시보드로 돌아가기</el-button>
  </div>
</template>

<style scoped>
.detail-alert {
  margin-bottom: 1rem;
}

.advice-alert {
  margin-top: 1rem;
}

.back-btn {
  margin-top: 1.25rem;
  width: 100%;
}

.weather-detail :deep(.el-descriptions__label .el-icon),
.weather-detail :deep(.el-alert__title .el-icon) {
  margin-right: 0.3rem;
  vertical-align: middle;
}
</style>
