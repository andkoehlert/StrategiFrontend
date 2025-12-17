import type { YearlyOverviewResponse, YearlyData, ProcessedYearlyData } from '~/interfaces/yearly'
import { useRuntimeConfig } from "#imports"; 

export const useYearlyData = () => {
  const rawData = ref<YearlyOverviewResponse | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const config = useRuntimeConfig();

  
  const fetchYearlyData = async (initials: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      
      const url = `${config.public.apiBase}/mock/targets/${initials}/aarlige-saldo`;
      console.log("Fetching from:", url); 
      const response = await fetch(url);         
      if (!response.ok) {
        throw new Error(`Failed to fetch yearly data: ${response.statusText}`)
      }

      const data: YearlyOverviewResponse = await response.json()
      rawData.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error fetching yearly data:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Get data for a specific year
   */
  const getYearData = (year: number): ProcessedYearlyData | null => {
    if (!rawData.value) return null

    const yearData = rawData.value.data.find(d => d.year === year)
    if (!yearData) return null

    return {
      year: yearData.year,
      actual: yearData.afregnet,
      goal: yearData.maal,
      percentage: yearData.completionPercentage,
      difference: yearData.maal - yearData.afregnet,
      currency: yearData.currency
    }
  }

  /**
   * Get all available years from the data
   */
  const availableYears = computed<number[]>(() => {
    if (!rawData.value) return []
    return rawData.value.data.map(d => d.year).sort((a, b) => b - a)
  })

  /**
   * Get all yearly data sorted by year
   */
  const allYearsData = computed<ProcessedYearlyData[]>(() => {
    if (!rawData.value) return []
    
    return rawData.value.data
      .map(yearData => ({
        year: yearData.year,
        actual: yearData.afregnet,
        goal: yearData.maal,
        percentage: yearData.completionPercentage,
        difference: yearData.maal - yearData.afregnet,
        currency: yearData.currency
      }))
      .sort((a, b) => b.year - a.year)
  })

  /**
   * Get the year with highest completion percentage
   */
  const bestPerformingYear = computed<ProcessedYearlyData | null>(() => {
    if (!rawData.value) return null
    
    const best = rawData.value.data.reduce((max, current) => 
      current.completionPercentage > max.completionPercentage ? current : max
    )
    
    return {
      year: best.year,
      actual: best.afregnet,
      goal: best.maal,
      percentage: best.completionPercentage,
      difference: best.maal - best.afregnet,
      currency: best.currency
    }
  })

  /**
   * Get the year with highest actual amount
   */
  const highestRevenueYear = computed<ProcessedYearlyData | null>(() => {
    if (!rawData.value) return null
    
    const highest = rawData.value.data.reduce((max, current) => 
      current.afregnet > max.afregnet ? current : max
    )
    
    return {
      year: highest.year,
      actual: highest.afregnet,
      goal: highest.maal,
      percentage: highest.completionPercentage,
      difference: highest.maal - highest.afregnet,
      currency: highest.currency
    }
  })

  return {
    // State
    rawData: readonly(rawData),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    availableYears,
    allYearsData,
    bestPerformingYear,
    highestRevenueYear,
    
    // Methods
    fetchYearlyData,
    getYearData
  }
}