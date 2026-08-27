import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref([])

  const favoriteCount = computed(() => favoriteIds.value.length)

  function isFavorite(cityId) {
    return favoriteIds.value.includes(cityId)
  }

  function toggleFavorite(cityId) {
    favoriteIds.value = isFavorite(cityId) ? favoriteIds.value.filter((id) => id !== cityId) : [...favoriteIds.value, cityId]
  }

  return { favoriteIds, favoriteCount, isFavorite, toggleFavorite }
})
