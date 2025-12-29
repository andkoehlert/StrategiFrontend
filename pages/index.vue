<template>
  <div class="flex flex-col gap-8">
    <div class="bg-gradient-to-b from-[#175381] to-[#175381]/30 p-4 rounded-xl flex justify-between items-center">
      <div>
        <h2 class="text-white text-xl font-semibold">Velkommen, {{ currentUser?.name }}</h2>
        <p class="text-gray-300 text-sm">{{ currentUser?.email }}</p>
      </div>
      <button 
        @click="handleLogout"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
      >
        Log ud
      </button>
    </div>
    
    <DineTal
      :totalamount="totalamount"
      :udståendetids="udståendetids"
      :totalPotienale="totalPotienale"
      :year="selectedYear"
    />

    
    <div v-if="quarterlyLoading" class="text-white text-center py-20">
      Loading charts...
    </div>
    
    <div v-else-if="quarterlyError" class="text-red-400 text-center py-20">
      Error loading data: {{ quarterlyError }}
    </div>
    
    <template v-else>
      <div class="rounded-xl">
        <div class="flex justify-end items-center">
          <select 
            v-model="selectedYear" 
            class="bg-[#0d3a5c] text-white px-6 py-3 rounded-lg border border-white/20 focus:outline-none focus:border-[#91cc75] text-lg font-semibold"
          >
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2 flex flex-col gap-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gradient-to-b from-[#175381] to-[#175381]/30 p-6 rounded-xl">
              <h3 class="text-white text-lg font-semibold mb-4">Dit årlige saldo</h3>
              <SegmentChart 
                :yearData="selectedYearlyData"
                :year="selectedYear"
              />
            </div>
            
            <div class="bg-gradient-to-b from-[#175381] to-[#175381]/30 p-6 rounded-xl">
              <h3 class="text-white text-lg font-semibold mb-4">Din historik</h3>
              <div class="h-[400px] flex items-center justify-center text-white w-full">
                <HistorikChart 
                  v-if="historieYearSummary && historieYearSummary.length > 0"
                  class="w-full h-full"
                  :year-summary="historieYearSummary" 
                  :selected-year="selectedYear"
                  @year-selected="handleYearSelected"
                />
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-b from-[#175381] to-[#175381]/30 p-6 rounded-xl flex-1 flex flex-col">
            <h3 class="text-white text-lg font-semibold mb-4">Dit månedligt saldo</h3>
            <p class="text-gray-300 text-sm mb-4">Du har her mulighed for at ændre dine kvatale mål.</p>
            <MonthlyBarChart 
              :monthlyData="selectedYearMonthlyData"
              :year="selectedYear"
              :yearData="selectedYearQuarterlyData"
              type="actual"
            />
          </div>
           
        </div>
         
        <div class="lg:col-span-1 flex flex-col gap-6">
          
          <div class="bg-gradient-to-b from-[#175381] to-[#175381] p-6 rounded-xl flex flex-col">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-white text-lg font-semibold">Segment overblik</h3>
              <span class="text-[#91cc75] text-sm font-semibold">{{ selectedYear }}</span>
            </div>
            <SegmentOverviewChart 
              :achievementPercentage="achievementPercentage"
              :segmentComparison="segmentComparison"
            />
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-b from-[#175381] to-[#175381]/30 p-6 rounded-xl flex-1 flex flex-col">
        <h3 class="text-white text-lg font-semibold mb-4">Dit performance vs mål</h3>
        <p class="text-gray-300 text-sm mb-4">Du har her mulighed for at ændre dine kvatale mål.</p>
        <GoalsVsActuals
          :achievementPercentage="achievementPercentage"
          :segmentComparison="segmentComparison"
          :year="selectedYear"
        />
      </div>
    </template>
  </div>
  
  <div class="flex flex-col gap-8 pt-4">
    <DineMål
      :totalamount="totalamount"
      :udståendetids="udståendetids"
      :totalPotienale="totalPotienale"
      @year-selected="handleYearSelected"
    />
    
    <div class="flex flex-col gap-6">
      <CategoryBreakdownChart 
        :data="categoryChartData" 
        type="actual"  
        :year="selectedYear"
      />
    </div>
    
    <Calender v-if="currentUser" />

    
    <p v-if="monthlyError" class="error">{{ monthlyError }}</p>
    <p v-if="monthlyLoading">Loading monthly data...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import SegmentChart from '~/components/app/charts/SegmentChart.vue'
import CategoryBreakdownChart from '~/components/app/charts/CategoryBreakdownChart.vue'
import DineTal from '~/components/app/DineTal.vue'
import GoalsVsActuals from '~/components/app/charts/GoalsVsActuals.vue'
import QuarterlyPieChart from '~/components/app/charts/QuarterlyPieChart.vue'
import SegmentOverviewChart from '~/components/app/charts/SegmentOverviewChart.vue'
import HistorikChart from '~/components/app/charts/HistorikChart.vue'
import MonthlyBarChart from '~/components/app/charts/MonthlyBarChart.vue'
import DineMål from '~/components/app/DineMål.vue'
import Calender from '~/components/app/charts/Calender.vue'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: 'auth'
})

// Get auth info
const router = useRouter()
const { currentUser, logout } = useAuth()

// Logout handler
const handleLogout = () => {
  logout()
  router.push('/login')
}

const { monthlyDatas, fetchMonthlyDataByInitials, loading: monthlyLoading, error: monthlyError } = useMonthlyData()
const { areaData, loading: areaLoading, error: areaError, fetchAreaDataByYear } = useAreaData() 
const { loading: quarterlyLoading, error: quarterlyError, availableYears: quarterlyAvailableYears, fetchQuarterlyData, getYearData, getLargestQuarter } = useQuarterlyData()
const { loading: yearlyLoading, error: yearlyError, fetchYearlyData, getYearData: getYearlyData } = useYearlyData()
const {
  loading: segmentLoading,
  error: segmentError,
  processedActuals,     
  processedGoals,     
  achievementPercentage,
  segmentComparison,
  fetchComparison
} = useSegmentComparison()

const { loading: monthlyOverviewLoading, error: monthlyOverviewError, fetchMonthlyOverviewData, getYearMonthlyData } = useMonthlyOverviewData()
const { loading: summaryLoading, error: summaryError, fetchSummaryData, YearDataResponse } = useSummaryData()
const {
  loading: historieLoading,
  error: historieError,
  fetchHistorieData,
  availableYears,          
  yearSummary: historieYearSummary,
  getYearHistorieData,
  largestYear: historieLargestYear,
  largestMonthOverall,
  largestQuarterOverall
} = useHistorieData()

onMounted(async () => {
  if (!currentUser.value) {
    router.push('/login')
    return
  }

  // Fetch all data - auth token will be included automatically
  await Promise.all([
    fetchMonthlyDataByInitials(),
    fetchAreaDataByYear(selectedYear.value), 
    fetchQuarterlyData(),
    fetchYearlyData(),
    fetchComparison(selectedYear.value),
    fetchMonthlyOverviewData(),
    fetchHistorieData(),
    fetchSummaryData()
  ])
})

const selectedYear = ref(2024)

// Watch for year changes
watch(selectedYear, async (newYear) => {
  await Promise.all([
    fetchAreaDataByYear(newYear),
    fetchComparison(newYear)
  ])
})

const selectedYearSegmentData = computed(() => {
  return processedActuals.value
})

const selectedYearHistorieData = computed(() => {
  return getYearHistorieData(selectedYear.value)
})

const categoryChartData = computed(() => areaData.value)

const largestYear = computed(() => {
  return historieLargestYear.value || { year: '-', value: 0 }
})

const largestQuarterDisplay = computed(() => {
  if (!largestQuarterOverall.value)
    return { name: '-', value: 0 }

  return {
    name: largestQuarterOverall.value.name,
    value: largestQuarterOverall.value.value
  }
})

const selectedYearQuarterlyData = computed(() => {
  return getYearData(selectedYear.value)
})

const selectedYearlyData = computed(() => {
  return getYearlyData(selectedYear.value)
})

const selectedYearMonthlyData = computed(() => {
  return getYearMonthlyData(selectedYear.value)
})

const handleYearSelected = (year) => {
  selectedYear.value = year
}

const formatCurrency = (value) => {
  if (!value) return '-'
  return `${value.toLocaleString()} kr`
}

/** totals */
const totalamount = useTotal("afregnetArbejde")
const udståendetids = useTotal("udstaendeTidsregistrering")
const totalPotienale = useTotal("totalPotienale")

function useTotal(key) {
  return computed(() => {
    if (!YearDataResponse.value?.data) return 0
    const yearEntry = YearDataResponse.value.data.find(x => x.year === selectedYear.value)
    return yearEntry?.[key] || 0
  })
}
</script>

<style scoped>
.border-right {
  border-right: 1px solid #7d7d7d;
}
</style>