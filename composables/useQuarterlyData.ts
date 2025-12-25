import type { 
  QuarterlyResponse, 
  ProcessedYearData, 
  QuarterlyChartData, 
  QuarterPercentage 
} from '~/interfaces/quarterly'
import { useRuntimeConfig } from "#imports"; 

export const useQuarterlyData = () => {
  const rawData = ref<QuarterlyResponse | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const config = useRuntimeConfig();

  
  const fetchQuarterlyData = async (initials: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
    
      
      const url = `${config.public.apiBase}/api/quarterly-data
`;
      const response = await fetch(url);       
      if (!response.ok) {
        throw new Error(`Failed to fetch quarterly data: ${response.statusText}`)
      }

      const data: QuarterlyResponse = await response.json()
      rawData.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error fetching quarterly data:', err)
    } finally {
      loading.value = false
    }
  }

 
const getYearData = (year: number): ProcessedYearData | null => {
  if (!rawData.value) return null

  const yearData = rawData.value.data.find(d => d.year === year)
  if (!yearData) return null

  const q = (idx: number) => yearData.quarters[idx] || { afregnetArbejde: 0, udstaendeTidsreg: 0 }

  const quarterly: QuarterlyChartData = {
    Q1: { total: q(0).afregnetArbejde + q(0).udstaendeTidsreg, months: { Jan: q(0).afregnetArbejde/3, Feb: q(0).afregnetArbejde/3, Mar: q(0).afregnetArbejde/3 } },
    Q2: { total: q(1).afregnetArbejde + q(1).udstaendeTidsreg, months: { Apr: q(1).afregnetArbejde/3, May: q(1).afregnetArbejde/3, Jun: q(1).afregnetArbejde/3 } },
    Q3: { total: q(2).afregnetArbejde + q(2).udstaendeTidsreg, months: { Jul: q(2).afregnetArbejde/3, Aug: q(2).afregnetArbejde/3, Sep: q(2).afregnetArbejde/3 } },
    Q4: { total: q(3).afregnetArbejde + q(3).udstaendeTidsreg, months: { Oct: q(3).afregnetArbejde/3, Nov: q(3).afregnetArbejde/3, Dec: q(3).afregnetArbejde/3 } },
  }

  const totals = {
    afregnetArbejde: yearData.quarters.reduce((sum, q) => sum + q.afregnetArbejde, 0),
    udstaendeTidsreg: yearData.quarters.reduce((sum, q) => sum + q.udstaendeTidsreg, 0),
    combined: yearData.quarters.reduce((sum, q) => sum + q.afregnetArbejde + q.udstaendeTidsreg, 0)
  }

  return { year, quarterly, totals }
}

  /**
   * Get all available years from the data
   */
  const availableYears = computed<number[]>(() => {
    if (!rawData.value) return []
    return rawData.value.data.map(d => d.year).sort((a, b) => b - a)
  })

  /**
   * Get percentage breakdown for each quarter in a specific year
   */
  const getQuarterPercentages = (year: number): QuarterPercentage[] | null => {
    if (!rawData.value) return null

    const yearData = rawData.value.data.find(d => d.year === year)
    if (!yearData) return null

    return yearData.quarters.map(q => ({
      quarter: q.quarter,
      percentage: q.percentage
    }))
  }

  /**
   * Get the largest quarter for a specific year
   */
  const getLargestQuarter = (year: number): { quarter: string; value: number } | null => {
    const yearData = getYearData(year)
    if (!yearData) return null

    const quarters = [
      { quarter: 'Q1', value: yearData.quarterly.Q1.total },
      { quarter: 'Q2', value: yearData.quarterly.Q2.total },
      { quarter: 'Q3', value: yearData.quarterly.Q3.total },
      { quarter: 'Q4', value: yearData.quarterly.Q4.total }
    ]

    return quarters.reduce((max, q) => q.value > max.value ? q : max)
  }

  return {
    // State
    rawData: readonly(rawData),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    availableYears,
    
    // Methods
    fetchQuarterlyData,
    getYearData,
    getQuarterPercentages,
    getLargestQuarter
  }
}