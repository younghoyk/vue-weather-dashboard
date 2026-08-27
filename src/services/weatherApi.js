import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const hasApiKey = Boolean(API_KEY)

export async function fetchCurrentWeatherByCoords(lat, lon) {
  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'kr' },
  })

  return {
    name: data.name,
    temp: Math.round(data.main.temp),
    humidity: data.main.humidity,
    wind: data.wind.speed,
    condition: data.weather[0].description,
    conditionMain: data.weather[0].main,
    lat: data.coord.lat,
    lon: data.coord.lon,
  }
}

export async function fetchAirPollution(lat, lon) {
  const { data } = await axios.get(`${BASE_URL}/air_pollution`, {
    params: { lat, lon, appid: API_KEY },
  })
  return data.list[0]
}

export const aqiLabel = {
  1: '좋음',
  2: '양호',
  3: '보통',
  4: '나쁨',
  5: '매우 나쁨',
}
