// composables/useMonthlyOverviewData.ts

import type { 
  MonthlyOverviewResponse, 
  YearMonthlyData,
  MonthData,
  ProcessedMonthlyData,
  MonthComparison
} from '~/interfaces/monthly'
import { useRuntimeConfig } from "#imports"; 

import { useAuth } from './useAuth'


export const useMonthlyOverviewData = () => {
  const rawData = ref<MonthlyOverviewResponse | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const config = useRuntimeConfig();
  const { getToken } = useAuth()

  
  const fetchMonthlyOverviewData = async (initials: string):  Promise<void> => {
    loading.value = true
    error.value = null

    try {
         const token = getToken()
      if (!token) {
        throw new Error('No authentication token found')
      }
      const url = `${config.public.apiBase}/api/monthly-data/me`;
       const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })      
      if (!response.ok) {
        throw new Error(`Failed to fetch monthly data: ${response.statusText}`)
      }

      const data: MonthlyOverviewResponse = await response.json()
      rawData.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error fetching monthly data:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Get monthly data for a specific year
   */
  const getYearMonthlyData = (year: number): ProcessedMonthlyData | null => {
    if (!rawData.value) return null

    const yearData = rawData.value.data.find(d => d.year === year)
    if (!yearData || yearData.months.length === 0) return null

    const months = yearData.months

    // Calculate totals
    const totals = {
      afregnet: months.reduce((sum, m) => sum + m.afregnet, 0),
      ditMaal: months.reduce((sum, m) => sum + m.ditMaal, 0),
      difference: 0
    }
    totals.difference = totals.ditMaal - totals.afregnet

    // Calculate averages
    const averages = {
      afregnet: totals.afregnet / months.length,
      ditMaal: totals.ditMaal / months.length
    }

    // Find best performing month
    const bestMonth = months.reduce((best, current) => {
      const currentPercentage = current.ditMaal > 0 
        ? (current.afregnet / current.ditMaal) * 100 
        : 0
      const bestPercentage = best.ditMaal > 0 
        ? (best.afregnet / best.ditMaal) * 100 
        : 0
      
      return currentPercentage > bestPercentage ? current : best
    })

    return {
      year,
      months,
      totals,
      averages,
      bestMonth: {
        name: bestMonth.month,
        afregnet: bestMonth.afregnet,
        ditMaal: bestMonth.ditMaal,
        percentage: bestMonth.ditMaal > 0 
          ? (bestMonth.afregnet / bestMonth.ditMaal) * 100 
          : 0
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
   * Get month-by-month comparison for a specific year
   */
  const getMonthComparisons = (year: number): MonthComparison[] => {
    const yearData = getYearMonthlyData(year)
    if (!yearData) return []

    return yearData.months.map(month => ({
      month: month.month,
      afregnet: month.afregnet,
      ditMaal: month.ditMaal,
      difference: month.ditMaal - month.afregnet,
      percentage: month.ditMaal > 0 
        ? (month.afregnet / month.ditMaal) * 100 
        : 0
    }))
  }

  /**
   * Get a specific month's data for a year
   */
  const getMonthData = (year: number, monthNumber: number): MonthData | null => {
    const yearData = getYearMonthlyData(year)
    if (!yearData) return null

    return yearData.months.find(m => m.monthNumber === monthNumber) || null
  }

  /**
   * Compare same month across different years
   */
  const compareMonthAcrossYears = (monthNumber: number): {
    month: string
    yearData: { year: number; afregnet: number; ditMaal: number }[]
  } | null => {
    if (!rawData.value) return null

    const yearData = rawData.value.data
      .map(yearData => {
        const month = yearData.months.find(m => m.monthNumber === monthNumber)
        return month ? {
          year: yearData.year,
          afregnet: month.afregnet,
          ditMaal: month.ditMaal
        } : null
      })
      .filter(Boolean) as { year: number; afregnet: number; ditMaal: number }[]

    if (yearData.length === 0) return null

    return {
      month: yearData[0] ? rawData.value.data[0].months[monthNumber - 1]?.month || '' : '',
      yearData: yearData.sort((a, b) => a.year - b.year)
    }
  }

  return {
    // State
    rawData: readonly(rawData),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    availableYears,
    
    // Methods
    fetchMonthlyOverviewData,
    getYearMonthlyData,
    getMonthComparisons,
    getMonthData,
    compareMonthAcrossYears
  }
}