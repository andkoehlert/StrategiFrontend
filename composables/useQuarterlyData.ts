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
    
      
      const url = `${config.public.apiBase}/mock/targets${initials}/kvartalssaldo`;
      console.log("Fetching from:", url); 
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

    // Transform the data into chart-friendly format
    const quarterly: QuarterlyChartData = {
      Q1: {
        total: yearData.quarters[0].afregnetArbejde + yearData.quarters[0].udstaendeTidsreg,
        months: {
          Jan: yearData.quarters[0].afregnetArbejde / 3,
          Feb: yearData.quarters[0].afregnetArbejde / 3,
          Mar: yearData.quarters[0].afregnetArbejde / 3,
        }
      },
      Q2: {
        total: yearData.quarters[1].afregnetArbejde + yearData.quarters[1].udstaendeTidsreg,
        months: {
          Apr: yearData.quarters[1].afregnetArbejde / 3,
          May: yearData.quarters[1].afregnetArbejde / 3,
          Jun: yearData.quarters[1].afregnetArbejde / 3,
        }
      },
      Q3: {
        total: yearData.quarters[2].afregnetArbejde + yearData.quarters[2].udstaendeTidsreg,
        months: {
          Jul: yearData.quarters[2].afregnetArbejde / 3,
          Aug: yearData.quarters[2].afregnetArbejde / 3,
          Sep: yearData.quarters[2].afregnetArbejde / 3,
        }
      },
      Q4: {
        total: yearData.quarters[3].afregnetArbejde + yearData.quarters[3].udstaendeTidsreg,
        months: {
          Oct: yearData.quarters[3].afregnetArbejde / 3,
          Nov: yearData.quarters[3].afregnetArbejde / 3,
          Dec: yearData.quarters[3].afregnetArbejde / 3,
        }
      }
    }

    const totals = {
      afregnetArbejde: yearData.quarters.reduce((sum, q) => sum + q.afregnetArbejde, 0),
      udstaendeTidsreg: yearData.quarters.reduce((sum, q) => sum + q.udstaendeTidsreg, 0),
      combined: yearData.quarters.reduce((sum, q) => sum + q.afregnetArbejde + q.udstaendeTidsreg, 0)
    }

    return {
      year,
      quarterly,
      totals
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