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
      <div class="bg-gradient-to-b from-[#175381] to-[#175381]/30 p-4 rounded-xl">
        <div class="flex justify-between items-center">
          <h3 class="text-white text-lg font-semibold">Valgt år</h3>
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
              <h3 class="text-white text-lg font-semibold mb-4">Dit kvatale saldo</h3>
              <div class="h-[400px] flex items-center justify-center text-white w-full">
                <QuarterlyPieChart 
                  :yearData="selectedYearQuarterlyData"
                  :year="selectedYear"
                  type="actual"
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
          
          <div class="bg-gradient-to-b from-[#175381] to-[#175381]/30 p-6 rounded-xl flex-1">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-white text-lg font-semibold">Segment overblik</h3>
              <span class="text-[#91cc75] text-sm font-semibold">{{ selectedYear }}</span>
            </div>
            <div class="h-full flex items-center justify-center text-white">
               <SegmentOverviewChart 
                :segmentData="selectedYearSegmentData"
                :year="selectedYear"
              />
            </div>
          </div>
          
          <div class="bg-gradient-to-b from-[#175381] to-[#175381]/30 p-6 rounded-xl flex flex-col h-[450px]">
            <h3 class="text-white text-lg font-semibold mb-4">Historik</h3>
            <div class="flex-1 w-full">
               <HistorikChart 
                v-if="historieYearSummary && historieYearSummary.length > 0"
                class="w-full h-full"
                :year-summary="historieYearSummary" 
                :selected-year="selectedYear"
                @year-selected="handleYearSelected"
              />
            </div>

            <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
              <div class="text-center">
                <p class="text-gray-300 text-xs mb-1">Største måned</p>
                <p class="text-white font-semibold text-sm">
                  {{ selectedYearData?.statistics?.largestMonth?.name || '-' }}
                </p>
                <p class="text-[#91cc75] text-xs">
                  {{ formatCurrency(selectedYearData?.statistics?.largestMonth?.value) }}
                </p>
              </div>
              <div class="text-center">
                <p class="text-gray-300 text-xs mb-1">Største år</p>
                <p class="text-white font-semibold text-sm">{{ largestYear.year }}</p>
                <p class="text-[#91cc75] text-xs">{{ formatCurrency(largestYear.total) }}</p>
              </div>
              <div class="text-center">
                <p class="text-gray-300 text-xs mb-1">Største kvatal</p>
                <p class="text-white font-semibold text-sm">
                  {{ largestQuarterDisplay.name }}
                </p>
                <p class="text-[#91cc75] text-xs">
                  {{ formatCurrency(largestQuarterDisplay.value) }}
                </p>
              </div>
            </div>
          </div>
        </div>
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
<CategoryBreakdownChart :data="categoryChartData" type="actual" />
    </div>
    
    <Calender v-if="userInitials" :initials="userInitials" />

    
    <p v-if="monthlyError" class="error">{{ monthlyError }}</p>
    <p v-if="monthlyLoading">Loading monthly data...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SegmentChart from '~/components/app/charts/SegmentChart.vue'
import CategoryBreakdownChart from '~/components/app/charts/CategoryBreakdownChart.vue'
import DineTal from '~/components/app/DineTal.vue'
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
const { currentUser, logout, getUserInitials } = useAuth()
const userInitials = computed(() => getUserInitials())

// Logout handler
const handleLogout = () => {
  logout()
  router.push('/login')
}

const { monthlyDatas, fetchMonthlyDataByInitials, loading: monthlyLoading, error: monthlyError } = useMonthlyData()
const { areaData, loading: areaLoading, error: areaError, fetchAreaDataByInitials } = useAreaData()
const { loading: quarterlyLoading, error: quarterlyError, availableYears: quarterlyAvailableYears, fetchQuarterlyData, getYearData, getLargestQuarter } = useQuarterlyData()
const { loading: yearlyLoading, error: yearlyError, fetchYearlyData, getYearData: getYearlyData } = useYearlyData()
const { loading: segmentLoading, error: segmentError, fetchSegmentData, getYearSegments } = useSegmentData()
const { loading: monthlyOverviewLoading, error: monthlyOverviewError, fetchMonthlyOverviewData, getYearMonthlyData } = useMonthlyOverviewData()
const { loading: summaryLoading, error: summaryError, fetchSummaryByInitials, YearDataResponse } = useSummaryData()
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
  const initials = getUserInitials()
  if (!initials) {
    router.push('/login')
    return
  }


 // Fetch all data with user's initials
  await Promise.all([
    fetchMonthlyDataByInitials(initials),
    fetchAreaDataByInitials(initials),
    fetchQuarterlyData(initials),
    fetchYearlyData(initials),
    fetchSegmentData(initials),
    fetchMonthlyOverviewData(initials),
    fetchHistorieData(initials),
    fetchSummaryByInitials(initials)
  ])
})


const selectedYear = ref(2024)


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

const selectedYearSegmentData = computed(() => {
  return getYearSegments(selectedYear.value)
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