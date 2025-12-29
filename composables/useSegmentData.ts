// composables/useSegmentComparison.ts
import { ref, computed } from 'vue'
import { useApi } from './useApi'
import type { ProcessedSegmentData, ComparisonResponse } from '~/interfaces/segment'



// Use useState to create a shared state across components
const comparisonData = useState<ComparisonResponse | null>('segmentComparison', () => null)
const loading = useState<boolean>('segmentComparisonLoading', () => false)
const error = useState<string | null>('segmentComparisonError', () => null)

export const useSegmentComparison = () => {
  const { apiRequest } = useApi()

  const fetchComparison = async (year: number): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      console.log('🔍 Fetching comparison for year:', year)
      const data = await apiRequest<ComparisonResponse>(
        `/api/segment-overblik/comparison/${year}`
      )
      console.log('✅ Received comparison data:', data)
      comparisonData.value = data
    } catch (err: any) {
      console.error('❌ Error fetching comparison:', err)
      error.value = err.message || 'Unknown error occurred'
      
      comparisonData.value = {
        year: year,
        goals: null,
        actuals: null
      }
    } finally {
      loading.value = false
    }
  }

  const goals = computed(() => comparisonData.value?.goals ?? null)
  const actuals = computed(() => comparisonData.value?.actuals ?? null)
  
  const processedActuals = computed((): ProcessedSegmentData | null => {
    if (!actuals.value) return null

    const segments = actuals.value.segments
      .filter(s => s.total > 0) 
      .map(segment => {
        const percentage = actuals.value!.totals.grandTotal > 0
          ? (segment.total / actuals.value!.totals.grandTotal) * 100
          : 0

        return {
          name: segment.name,
          count: segment.count,
          amount: segment.total,
          percentage: percentage
        }
      })

    const largestSegment = segments.length > 0
      ? segments.reduce((max, current) => 
          current.amount > max.amount ? current : max
        )
      : null

    return {
      year: actuals.value.year,
      segments: segments,
      totalAmount: actuals.value.totals.grandTotal,
      largestSegment: largestSegment ? {
        name: largestSegment.name,
        amount: largestSegment.amount,
        percentage: largestSegment.percentage
      } : null
    }
  })

  const processedGoals = computed((): ProcessedSegmentData | null => {
    if (!goals.value) return null

    const segments = goals.value.segments
      .filter(s => s.total > 0)
      .map(segment => {
        const percentage = goals.value!.totals.grandTotal > 0
          ? (segment.total / goals.value!.totals.grandTotal) * 100
          : 0

        return {
          name: segment.name,
          count: segment.count,
          amount: segment.total,
          percentage: percentage
        }
      })

    const largestSegment = segments.length > 0
      ? segments.reduce((max, current) => 
          current.amount > max.amount ? current : max
        )
      : null

    return {
      year: goals.value.year,
      segments: segments,
      totalAmount: goals.value.totals.grandTotal,
      largestSegment: largestSegment ? {
        name: largestSegment.name,
        amount: largestSegment.amount,
        percentage: largestSegment.percentage
      } : null
    }
  })
  
  // Calculate achievement percentages
  const achievementPercentage = computed(() => {
    if (!goals.value || !actuals.value) return null
    
    const goalTotal = goals.value.totals.grandTotal
    const actualTotal = actuals.value.totals.grandTotal
    
    if (goalTotal === 0) return null
    
    return {
      revenue: (actualTotal / goalTotal) * 100,
      cases: (actuals.value.totals.count / goals.value.totals.count) * 100
    }
  })

  // Get segment-level comparison
  const segmentComparison = computed(() => {
    if (!goals.value || !actuals.value) return []
    
    return goals.value.segments.map(goalSegment => {
      const actualSegment = actuals.value!.segments.find(
        s => s.name === goalSegment.name
      )
      
      return {
        name: goalSegment.name,
        goalCount: goalSegment.count,
        actualCount: actualSegment?.count || 0,
        goalTotal: goalSegment.total,
        actualTotal: actualSegment?.total || 0,
        achievement: actualSegment && goalSegment.total > 0
          ? (actualSegment.total / goalSegment.total) * 100 
          : 0,
        goalData: goalSegment.data,          
        actualData: actualSegment?.data || goalSegment.data.map(() => 0), 
        categories: goals.value!.categories    
      }
    })
  })

  return {
    comparisonData,
    loading,
    error,
    goals,
    actuals,
    processedActuals,
    processedGoals,   
    achievementPercentage,
    segmentComparison,
    fetchComparison
  }
}