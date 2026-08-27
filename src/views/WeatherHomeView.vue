<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AddLocation, MapLocation, OfficeBuilding, Refresh, Search } from '@element-plus/icons-vue'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import WeatherMapPicker from '@/components/exercise/WeatherMapPicker.vue'
import { weatherData } from '@/data/weatherData'
import { fetchCurrentWeatherByCoords, hasApiKey } from '@/services/weatherApi'

const route = useRoute()
const router = useRouter()

const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '')
const liveCities = ref(weatherData)
const isLoading = ref(true)
const loadError = ref('')

const myLocationCity = ref(null)
const myLocationLoading = ref(false)
const myLocationError = ref('')

const cities = computed(() => (myLocationCity.value ? [myLocationCity.value, ...liveCities.value] : liveCities.value))

function loadMyLocationWeather() {
  if (!navigator.geolocation) {
    myLocationError.value = '이 브라우저는 위치 정보 조회를 지원하지 않습니다.'
    return
  }

  myLocationLoading.value = true
  myLocationError.value = ''

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords
        const live = await fetchCurrentWeatherByCoords(latitude, longitude)
        myLocationCity.value = {
          ...live,
          id: 'my_location',
          name: '내 위치',
          region: `현재 위치 (${live.name})`,
        }
      } catch {
        myLocationError.value = '실시간 날씨 정보를 불러오지 못했습니다.'
      } finally {
        myLocationLoading.value = false
      }
    },
    () => {
      myLocationError.value = '위치 정보 접근이 거부되었거나 확인할 수 없습니다.'
      myLocationLoading.value = false
    },
  )
}

watch(searchQuery, (value) => {
  router.replace({ query: { ...route.query, q: value || undefined } })
})

async function loadWeather() {
  if (!hasApiKey) {
    loadError.value = 'OpenWeatherMap API 키가 설정되지 않아 실시간 정보를 불러올 수 없습니다.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  loadError.value = ''

  try {
    const liveResults = await Promise.all(weatherData.map((city) => fetchCurrentWeatherByCoords(city.lat, city.lon)))
    liveCities.value = weatherData.map((city, index) => ({
      ...city,
      ...liveResults[index],
      name: city.name,
    }))
  } catch {
    loadError.value = '실시간 날씨 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadWeather)

const filteredCities = computed(() => cities.value.filter((city) => city.name.includes(searchQuery.value.trim())))

const statusMessage = computed(() => {
  if (!searchQuery.value.trim()) return '카드를 클릭하거나 검색해 보세요.'
  return `"${searchQuery.value}" 검색 결과: ${filteredCities.value.length}건`
})

function goToDetail(id) {
  router.push('/weather/' + id)
}
</script>

<template>
  <div class="weather-home">
    <BaseDashboardCard title="도시 검색" :icon="Search">
      <SearchBar v-model="searchQuery" />
    </BaseDashboardCard>

    <el-alert v-if="isLoading" title="실시간 날씨 정보를 불러오는 중..." type="info" :closable="false" show-icon class="load-banner" />
    <el-alert v-else-if="loadError" :title="loadError" type="warning" :closable="false" show-icon class="load-banner" />
    <el-alert v-if="myLocationError" :title="myLocationError" type="warning" :closable="false" show-icon class="load-banner" />

    <BaseDashboardCard title="지역별 날씨 현황" :icon="OfficeBuilding">
      <template #actions>
        <div class="card-actions">
          <el-button size="small" :icon="AddLocation" :loading="myLocationLoading" @click="loadMyLocationWeather"> 내 위치 추가 </el-button>
          <el-button size="small" :icon="Refresh" :loading="isLoading" @click="loadWeather">재조회</el-button>
        </div>
      </template>

      <el-scrollbar max-height="360px">
        <ul class="weather-list">
          <li v-for="city in filteredCities" :key="city.id">
            <WeatherCard :city="city" @view-detail="goToDetail" />
          </li>
        </ul>
      </el-scrollbar>
      <p v-if="filteredCities.length === 0" class="weather-empty">일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <el-alert :title="statusMessage" type="success" :closable="false" center class="load-banner" />

    <BaseDashboardCard title="지도에서 위치 선택" :icon="MapLocation">
      <WeatherMapPicker />
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.weather-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-right: 0.5rem;
}

.weather-empty {
  text-align: center;
  opacity: 0.7;
  padding: 0.5rem 0;
}

.load-banner {
  margin-bottom: 1.25rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}
</style>
