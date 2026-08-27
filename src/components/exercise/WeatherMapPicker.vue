<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { fetchCurrentWeatherByCoords } from '@/services/weatherApi'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const mapContainer = ref(null)
const isLoading = ref(false)
const pickedResult = ref(null)
const errorMessage = ref('')

let map = null
let marker = null
let popupCloseTimer = null

onMounted(() => {
  map = L.map(mapContainer.value).setView([36.5, 127.8], 7)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map)

  map.on('click', handleMapClick)
})

onBeforeUnmount(() => {
  clearTimeout(popupCloseTimer)
  map?.remove()
})

const displayTemp = computed(() => {
  const rawTemp = pickedResult.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

watch(
  () => configStore.unit,
  () => {
    if (marker && pickedResult.value) {
      marker.setPopupContent(buildPopupContent())
    }
  },
)

function buildPopupContent() {
  const live = pickedResult.value
  return `📍 ${live.name}<br />${live.condition}, ${displayTemp.value}${configStore.unitSymbol}`
}

async function queryWeatherAt(lat, lng) {
  clearTimeout(popupCloseTimer)

  if (!marker) {
    marker = L.marker([lat, lng]).addTo(map)
    marker.on('click', () => {
      const { lat: markerLat, lng: markerLng } = marker.getLatLng()
      queryWeatherAt(markerLat, markerLng)
    })
  } else {
    marker.setLatLng([lat, lng])
  }

  isLoading.value = true
  errorMessage.value = ''
  pickedResult.value = null
  marker.bindPopup('날씨 조회 중...').openPopup()

  try {
    pickedResult.value = await fetchCurrentWeatherByCoords(lat, lng)
    marker.bindPopup(buildPopupContent()).openPopup()
  } catch {
    errorMessage.value = '해당 위치의 날씨 정보를 불러오지 못했습니다.'
    marker.bindPopup('조회 실패').openPopup()
  } finally {
    isLoading.value = false
  }

  popupCloseTimer = setTimeout(() => marker?.closePopup(), 4000)
}

function handleMapClick(event) {
  queryWeatherAt(event.latlng.lat, event.latlng.lng)
}
</script>

<template>
  <div class="map-picker">
    <div ref="mapContainer" class="map-picker__map"></div>
    <p class="map-picker__hint">지도를 클릭하면 그 지점의 실시간 날씨를 조회합니다.</p>
    <el-alert v-if="errorMessage" :title="errorMessage" type="warning" :closable="false" show-icon class="map-picker__result" />
    <el-alert
      v-else-if="pickedResult"
      :title="`${pickedResult.name} — ${pickedResult.condition}, ${displayTemp}${configStore.unitSymbol}`"
      type="info"
      :closable="false"
      show-icon
      class="map-picker__result"
    />
  </div>
</template>

<style scoped>
.map-picker__map {
  height: 280px;
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  z-index: 0;
}

.map-picker__hint {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
}

.map-picker__result {
  margin-top: 0.5rem;
}
</style>
