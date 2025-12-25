import type { 
  HistorieOverviewResponse, 
  YearHistorieData,
  ProcessedHistorieData,
  YearSummary
} from '~/interfaces/historie'
import { useRuntimeConfig } from "#imports"; 

export const useHistorieData = () => {
  const rawData = ref<HistorieOverviewResponse | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const config = useRuntimeConfig();

 
  const fetchHistorieData = async (initials: string):  Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const url = `${config.public.apiBase}/api/stoerste-perioder`;
      const response = await fetch(url);       
      if (!response.ok) {
        throw new Error(`Failed to fetch historie data: ${response.statusText}`)
      }

      const data: HistorieOverviewResponse = await response.json()
      rawData.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error fetching historie data:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Get historie data for a specific year
   */
  const getYearHistorieData = (year: number): ProcessedHistorieData | null => {
    if (!rawData.value) return null

    const yearData = rawData.value.data.find(d => d.year === year)
    if (!yearData) return null

    return {
      year: yearData.year,
      largestMonth: {
        name: yearData.stoersteMaaned.month,
        monthNumber: yearData.stoersteMaaned.monthNumber,
        value: yearData.stoersteMaaned.amount,
        currency: yearData.stoersteMaaned.currency
      },
      largestYear: {
        year: yearData.stoersteAar.year,
        value: yearData.stoersteAar.amount,
        currency: yearData.stoersteAar.currency
      },
      largestQuarter: {
        name: yearData.stoersteKvartal.quarter,
        quarterNumber: yearData.stoersteKvartal.quarterNumber,
        value: yearData.stoersteKvartal.amount,
        currency: yearData.stoersteKvartal.currency
      }
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
   * Get year summary for the line chart (all years with their totals)
   */
  const yearSummary = computed<YearSummary[]>(() => {
    if (!rawData.value) return []
    
    return rawData.value.data
      .map(d => ({
        year: d.year,
        total: d.stoersteAar.amount
      }))
      .sort((a, b) => a.year - b.year) 
  })

  /**
   * Get the overall largest year across all data
   */
  const largestYear = computed<ProcessedHistorieData['largestYear'] | null>(() => {
    if (!rawData.value) return null
    
    const largest = rawData.value.data.reduce((max, current) => 
      current.stoersteAar.amount > max.stoersteAar.amount ? current : max
    )
    
    return {
      year: largest.stoersteAar.year,
      value: largest.stoersteAar.amount,
      currency: largest.stoersteAar.currency
    }
  })

  /**
   * Get the overall largest month across all years
   */
  const largestMonthOverall = computed<ProcessedHistorieData['largestMonth'] | null>(() => {
    if (!rawData.value) return null
    
    const largest = rawData.value.data.reduce((max, current) => 
      current.stoersteMaaned.amount > max.stoersteMaaned.amount ? current : max
    )
    
    return {
      name: largest.stoersteMaaned.month,
      monthNumber: largest.stoersteMaaned.monthNumber,
      value: largest.stoersteMaaned.amount,
      currency: largest.stoersteMaaned.currency
    }
  })

  /**
   * Get the overall largest quarter across all years
   */
  const largestQuarterOverall = computed<ProcessedHistorieData['largestQuarter'] | null>(() => {
    if (!rawData.value) return null
    
    const largest = rawData.value.data.reduce((max, current) => 
      current.stoersteKvartal.amount > max.stoersteKvartal.amount ? current : max
    )
    
    return {
      name: largest.stoersteKvartal.quarter,
      quarterNumber: largest.stoersteKvartal.quarterNumber,
      value: largest.stoersteKvartal.amount,
      currency: largest.stoersteKvartal.currency
    }
  })

  /**
   * Get growth statistics between two years
   */
  const getYearGrowth = (fromYear: number, toYear: number): {
    years: string
    growth: number
    percentage: number
    fromAmount: number
    toAmount: number
  } | null => {
    const fromData = getYearHistorieData(fromYear)
    const toData = getYearHistorieData(toYear)

    if (!fromData || !toData) return null

    const growth = toData.largestYear.value - fromData.largestYear.value
    const percentage = fromData.largestYear.value > 0 
      ? (growth / fromData.largestYear.value) * 100 
      : 0

    return {
      years: `${fromYear}-${toYear}`,
      growth,
      percentage,
      fromAmount: fromData.largestYear.value,
      toAmount: toData.largestYear.value
    }
  }

  return {
    // State
    rawData: readonly(rawData),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    availableYears,
    yearSummary,
    largestYear,
    largestMonthOverall,
    largestQuarterOverall,
    
    // Methods
    fetchHistorieData,
    getYearHistorieData,
    getYearGrowth
  }
}