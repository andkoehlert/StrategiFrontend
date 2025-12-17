import { ref, computed } from 'vue'
import type {
  DailyData,
  YearData,
  LawyerCalendarData,
  YearStatistics,
  MonthlyAggregatedData,
  CalendarFilters,
  DataType
} from '~/types/calendar'

export const useCalendarData = () => {
  const calendarData = ref<LawyerCalendarData | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  /**
   * Fetch calendar data by lawyer initials
   * @param {string} initials 
   * @param {CalendarFilters} filters
   */
  const fetchCalendarData = async (initials: string, filters?: CalendarFilters): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
         
      const url =  
         `${config.public.apiBase}/mock/targets/targets/${initials}/calendar`

      console.log('Fetching calendar data from:', url)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch calendar data: ${response.status} ${response.statusText}`)
      }

      const data: LawyerCalendarData = await response.json()
      
      calendarData.value = data
      
      console.log('Loaded calendar data:', calendarData.value)
      console.log('Available years:', calendarData.value?.years?.map(y => y.year))
      
      if (calendarData.value?.years) {
        const totalDays = calendarData.value.years.reduce((sum, year) => 
          sum + (year.dailyData?.length || 0), 0
        )
        console.log(`Total days loaded across all years: ${totalDays}`)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error fetching calendar data:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Get calendar data for a specific year
   * @param {number} year - 
   */
  const getYearData = (year: number): YearData | null => {
    if (!calendarData.value?.years) {
      console.log('No calendar data or years available')
      return null
    }
    
    const yearData = calendarData.value.years.find(
      yearData => yearData.year === year
    ) || null
    
    console.log(`Getting year data for ${year}:`, yearData ? `Found ${yearData.dailyData.length} days` : 'Not found')
    
    return yearData
  }

  /**
   * Get formatted data for calendar heatmap
   * @param {number} year 
   * @param {DataType} dataType 
   */
  const getFormattedCalendarData = (year: number, dataType: DataType = 'settledAmount'): [string, number][] => {
    const yearData = getYearData(year)
    if (!yearData?.dailyData) return []

    return yearData.dailyData.map(day => [
      day.date,
      day[dataType] || 0
    ] as [string, number])
  }

  /**
   * Get all available years
   */
  const availableYears = computed<number[]>(() => {
    if (!calendarData.value?.years) return []
    return calendarData.value.years.map(y => y.year).sort((a, b) => b - a)
  })

  /**
   * Get statistics for a specific year
   * @param {number} year - 
   */
  const getYearStatistics = (year: number): YearStatistics | null => {
    const yearData = getYearData(year)
    if (!yearData?.dailyData || yearData.dailyData.length === 0) return null

    const dailyData = yearData.dailyData
    const totalSettled = dailyData.reduce((sum, day) => sum + (day.settledAmount || 0), 0)
    const totalCaseValue = dailyData.reduce((sum, day) => sum + (day.caseValue || 0), 0)
    const totalCases = dailyData.reduce((sum, day) => sum + (day.casesSettled || 0), 0)
    
    const avgSettled = totalSettled / dailyData.length
    const maxDay = dailyData.reduce((max, day) => 
      day.settledAmount > max.settledAmount ? day : max
    , dailyData[0])

    return {
      totalSettled,
      totalCaseValue,
      totalCases,
      avgSettled,
      maxDay,
      daysWithActivity: dailyData.length
    }
  }

  /**
   * Get monthly aggregated data for a specific year
   * @param {number} year 
   */
  const getMonthlyAggregatedData = (year: number): MonthlyAggregatedData[] => {
    const yearData = getYearData(year)
    if (!yearData?.dailyData) return []

    const monthlyMap = new Map<string, MonthlyAggregatedData>()

    yearData.dailyData.forEach(day => {
      const date = new Date(day.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          month: monthKey,
          settledAmount: 0,
          caseValue: 0,
          casesSettled: 0,
          daysCount: 0
        })
      }

      const monthData = monthlyMap.get(monthKey)!
      monthData.settledAmount += day.settledAmount || 0
      monthData.caseValue += day.caseValue || 0
      monthData.casesSettled += day.casesSettled || 0
      monthData.daysCount += 1
    })

    return Array.from(monthlyMap.values()).sort((a, b) => 
      a.month.localeCompare(b.month)
    )
  }

  return {
    calendarData,
    loading,
    error,
    fetchCalendarData,
    getYearData,
    getFormattedCalendarData,
    availableYears,
    getYearStatistics,
    getMonthlyAggregatedData
  }
}