import { ref, computed } from 'vue'

export const useChartFilters = (historicalData) => {
  const selectedYear = ref(null)

  const availableYears = computed(() => {
    const years = historicalData.value?.historicalData
    return years ? Object.keys(years) : []
  })

  // Default to first available year
  if (!selectedYear.value && availableYears.value.length > 0) {
    selectedYear.value = availableYears.value[0]
  }

  const filteredCalendarData = computed(() => {
    const data = historicalData.value?.historicalData
    return data?.[selectedYear.value] ?? []
  })

  return {
    selectedYear,
    filteredCalendarData,
    availableYears
  }
}
