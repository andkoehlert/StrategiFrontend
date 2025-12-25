// composables/useSegmentData.ts

import type { 
  SegmentOverviewResponse, 
  YearSegmentData, 
  SegmentData,
  ProcessedSegmentData 
} from '~/interfaces/segment'
import { useRuntimeConfig } from "#imports"; 

export const useSegmentData = () => {
  const rawData = ref<SegmentOverviewResponse | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const config = useRuntimeConfig();


  const fetchSegmentData = async (initials: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const url = `${config.public.apiBase}/api/segment-overblik`;
      const response = await fetch(url);       
      if (!response.ok) {
        throw new Error(`Failed to fetch segment data: ${response.statusText}`)
      }

      const data: SegmentOverviewResponse = await response.json()
      rawData.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error fetching segment data:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Get segment data for a specific year
   */
  const getYearSegments = (year: number): ProcessedSegmentData | null => {
    if (!rawData.value) return null

    const yearData = rawData.value.data.find(d => d.year === year)
    if (!yearData) return null

    // Filter out "I alt" (total) segment for processing
    const segments = yearData.segments.filter(s => s.name !== 'I alt')
    
    // Calculate total amount from all segments (excluding "I alt")
    const totalAmount = segments.reduce((sum, s) => sum + s.amount, 0)

    // Find largest segment
    const largestSegment = segments.length > 0
      ? segments.reduce((max, current) => 
          current.amount > max.amount ? current : max
        )
      : null

    return {
      year,
      segments,
      totalAmount,
      largestSegment: largestSegment ? {
        name: largestSegment.name,
        amount: largestSegment.amount,
        percentage: largestSegment.percentage
      } : null
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
   * Get segment breakdown for a specific year with calculated percentages
   */
  const getSegmentBreakdown = (year: number): SegmentData[] => {
    const yearData = getYearSegments(year)
    if (!yearData) return []

    // Return segments with recalculated percentages based on actual totals
    return yearData.segments.map(segment => ({
      ...segment,
      percentage: yearData.totalAmount > 0 
        ? (segment.amount / yearData.totalAmount) * 100 
        : 0
    }))
  }

  /**
   * Get the segment with highest growth between two years
   */
  const getSegmentGrowth = (fromYear: number, toYear: number): {
    segment: string
    growth: number
    fromAmount: number
    toAmount: number
  } | null => {
    const fromData = getYearSegments(fromYear)
    const toData = getYearSegments(toYear)

    if (!fromData || !toData) return null

    let maxGrowth = { segment: '', growth: 0, fromAmount: 0, toAmount: 0 }

    fromData.segments.forEach(fromSegment => {
      const toSegment = toData.segments.find(s => s.name === fromSegment.name)
      if (toSegment) {
        const growth = toSegment.amount - fromSegment.amount
        if (growth > maxGrowth.growth) {
          maxGrowth = {
            segment: fromSegment.name,
            growth,
            fromAmount: fromSegment.amount,
            toAmount: toSegment.amount
          }
        }
      }
    })

    return maxGrowth.growth > 0 ? maxGrowth : null
  }

  /**
   * Get total across all segments for a specific year
   */
  const getYearTotal = (year: number): number => {
    if (!rawData.value) return 0

    const yearData = rawData.value.data.find(d => d.year === year)
    if (!yearData) return 0

    // Check if there's an "I alt" segment (total), otherwise calculate
    const totalSegment = yearData.segments.find(s => s.name === 'I alt')
    if (totalSegment) return totalSegment.amount

    // Calculate from segments
    return yearData.segments
      .filter(s => s.name !== 'I alt')
      .reduce((sum, s) => sum + s.amount, 0)
  }

  return {
    // State
    rawData: readonly(rawData),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed
    availableYears,
    
    // Methods
    fetchSegmentData,
    getYearSegments,
    getSegmentBreakdown,
    getSegmentGrowth,
    getYearTotal
  }
}