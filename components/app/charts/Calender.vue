<template>
  <div class="space-y-6">
    <div v-if="loading" class="text-white text-center py-20">
      Indlæser kalenderdata...
    </div>
    
    <div v-else-if="error" class="text-red-400 text-center py-20">
      Fejl ved indlæsning: {{ error }}
    </div>
    
    <div v-else-if="calendarData">
      <div class="bg-gradient-to-b from-[#175381] to-[#175381]/30 p-6 rounded-xl">
        <h2 class="text-white text-xl font-semibold mb-6">Kalendervisning</h2>
        
        <FilterPanel 
          :availableYears="availableYears"
          :defaultYear="selectedYear"
          @filter="handleRadioFilter" 
          @Nyfilter="handleAdvancedFilter"
        />
        
       <!-- Statistics  -->
<div v-if="yearStatistics" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 mb-6">
  <!-- Total  -->
  <div class="relative overflow-hidden rounded-xl p-4 group">
    <!-- Glass  -->
    <div class="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <!-- Content -->
    <div class="relative flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-500/20 backdrop-blur-sm border border-green-400/20">
        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-white text-xs font-medium mb-1">Total afregnet</h3>
        <p class="gold-text text-xl font-bold">{{ formatCurrencyCompact(yearStatistics.totalSettled) }}</p>
      </div>
    </div>
  </div>

  <!-- Total Case Value -->
  <div class="relative overflow-hidden rounded-xl p-4 group">
    <!-- Glass effect  -->
    <div class="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <!-- Content -->
    <div class="relative flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-500/20 backdrop-blur-sm border border-blue-400/20">
        <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-white text-xs font-medium mb-1">Total sagsværdi</h3>
        <p class="gold-text text-xl font-bold">{{ formatCurrencyCompact(yearStatistics.totalCaseValue) }}</p>
      </div>
    </div>
  </div>

  <!-- Number of Cases -->
  <div class="relative overflow-hidden rounded-xl p-4 group">
    <!-- Glass effect  -->
    <div class="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <!-- Content -->
    <div class="relative flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-purple-500/20 backdrop-blur-sm border border-purple-400/20">
        <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-white text-xs font-medium mb-1">Antal sager</h3>
        <p class="gold-text text-xl font-bold">{{ yearStatistics.totalCases }}</p>
      </div>
    </div>
  </div>

  <!-- Days  -->
  <div class="relative overflow-hidden rounded-xl p-4 group">
    <!-- Glass effect  -->
    <div class="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    <!-- Content -->
    <div class="relative flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/20">
        <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-white text-xs font-medium mb-1">Dage vist</h3>
        <p class="gold-text text-xl font-bold">{{ getHeatmapData.length }}</p>
      </div>
    </div>
  </div>
</div>
        
        <!-- ECharts Heatmap Container -->
        <div 
          ref="chartContainer" 
          class="w-full"
          style="height: 600px;"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import FilterPanel from '../filters/FilterPanel.vue'

const props = defineProps({
  initials: {
    type: String,
    default: 'cw'
  }
})

const { 
  calendarData, 
  loading, 
  error, 
  fetchCalendarData,
  getFormattedCalendarData,
  availableYears,
  getYearStatistics
} = useCalendarData()

const radioFilter = ref('')
const selectedYear = ref(new Date().getFullYear())
const selectedDataType = ref('settledAmount')
const chartContainer = ref(null)
const Nyfilter = ref({
  status: '',
  workType: '',
  balance: '',
  industry: ''
})
let chartInstance = null

// Get statistics for selected year
const yearStatistics = computed(() => {
  if (!calendarData.value) return null
  return getYearStatistics(selectedYear.value)
})

// Get filtered heatmap data based on current selections
const getHeatmapData = computed(() => {
  if (!calendarData.value) return []
  
  // Get the raw daily data for filtering
  const yearData = calendarData.value.years.find(y => y.year === selectedYear.value)
  if (!yearData?.dailyData) return []
  
  // Apply advanced filters (client-side filtering)
  let filteredDailyData = yearData.dailyData
  
  // Filter by status
  if (Nyfilter.value.status) {
    filteredDailyData = filteredDailyData.filter(day => 
      day.status === Nyfilter.value.status
    )
  }
  
  // Filter by work type
  if (Nyfilter.value.workType) {
    filteredDailyData = filteredDailyData.filter(day => 
      day.workType === Nyfilter.value.workType
    )
  }
  
  // Filter by industry
  if (Nyfilter.value.industry) {
    filteredDailyData = filteredDailyData.filter(day => 
      day.industry === Nyfilter.value.industry
    )
  }
  
  // Filter by balance
  if (Nyfilter.value.balance) {
    filteredDailyData = filteredDailyData.filter(day => {
      const value = day.settledAmount
      if (Nyfilter.value.balance === 'high') return value > 500000
      if (Nyfilter.value.balance === 'medium') return value >= 100000 && value <= 500000
      if (Nyfilter.value.balance === 'low') return value < 100000
      return true
    })
  }
  
  // Convert filtered data to heatmap format
  let data = filteredDailyData.map(day => [
    day.date,
    day[selectedDataType.value] || 0
  ])
  
  // Apply radio time filter if active
  if (radioFilter.value) {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    
    data = data.filter(([dateStr]) => {
      const date = new Date(dateStr)
      const month = date.getMonth()
      
      if (radioFilter.value === 'today') {
        return month === currentMonth
      } else if (radioFilter.value === 'past') {
        return month < currentMonth
      }
      return true
    })
  }
  
  return data
})

// Get max value for visualMap
const maxValue = computed(() => {
  if (getHeatmapData.value.length === 0) return 10000
  return Math.max(...getHeatmapData.value.map(item => item[1]))
})

// Get label for current data type
const dataTypeLabel = computed(() => {
  const labels = {
    settledAmount: 'Afregnet beløb',
    caseValue: 'Sagsværdi',
    casesSettled: 'Antal sager'
  }
  return labels[selectedDataType.value] || 'Værdi'
})

// Helper function to format currency
const formatCurrency = (value) => {
  if (!value) return '0 kr'
  return `${Math.round(value).toLocaleString('da-DK')} kr`
}

// Format currency helper for statistics
const formatCurrencyCompact = (value) => {
  if (!value) return '0 kr'
  const formatted = Math.round(value).toLocaleString('da-DK')
  return `${formatted} kr`
}

// Helper functions for labels
const getStatusLabel = (value) => {
  const labels = {
    'aktiv': 'Aktiv',
    'under-behandling': 'Under behandling',
    'venter-modpart': 'Venter på modpart',
    'venter-klient': 'Venter på klient',
    'afsluttes-snart': 'Afsluttes snart'
  }
  return labels[value] || value
}

const getWorkTypeLabel = (value) => {
  const labels = {
    'klientmøder': 'Klientmøder',
    'retsmøder': 'Retsmøder',
    'interne-møder': 'Interne møder',
    'forberedelsesmøder': 'Forberedelsesmøder'
  }
  return labels[value] || value
}

const getIndustryLabel = (value) => {
  const labels = {
    'almene-boligsaelskaber': 'Almene boligsælskaber',
    'offentlige-myndigheder': 'Offentlige myndigheder',
    'private-ejendomsudviklere': 'Private ejendomsudviklere',
    'private-ejendomsinvestorer': 'Private ejendomsinvestorer',
    'kapital-fonde': 'Kapital fonde',
    'pensionskasser': 'Pensionskasser',
    'asset-managers': 'Asset managers'
  }
  return labels[value] || value
}

// Initialize chart
const initChart = () => {
  if (!chartContainer.value) return
  
  if (chartInstance) {
    chartInstance.dispose()
  }
  
  chartInstance = echarts.init(chartContainer.value)
  updateChart()
}

// Update chart with current data
const updateChart = () => {
  if (!chartInstance) return
  
  // Store yearData in a variable that the tooltip can access
  const yearData = calendarData.value?.years.find(y => y.year === selectedYear.value)
  const dailyDataMap = new Map()
  
  // e a map for faster lookup
  if (yearData?.dailyData) {
    yearData.dailyData.forEach(day => {
      dailyDataMap.set(day.date, day)
    })
  }
  
  const option = {
    tooltip: {
      formatter: function (params) {
        const value = params.value[1]
        const dateStr = params.value[0]
        let formattedValue
        
        if (selectedDataType.value === 'casesSettled') {
          formattedValue = `${value} sager`
        } else {
          formattedValue = formatCurrency(value)
        }
        
        // Get day data from the map
        const dayData = dailyDataMap.get(dateStr)
        
        let tooltipContent = `<strong>${dateStr}</strong><br/>${dataTypeLabel.value}: ${formattedValue}`
        
        if (dayData) {
          tooltipContent += `<br/><br/><strong>Detaljer:</strong>`
          if (dayData.status) tooltipContent += `<br/>Status: ${getStatusLabel(dayData.status)}`
          if (dayData.workType) tooltipContent += `<br/>Type: ${getWorkTypeLabel(dayData.workType)}`
          if (dayData.industry) tooltipContent += `<br/>Branche: ${getIndustryLabel(dayData.industry)}`
          if (dayData.details?.clientName) tooltipContent += `<br/>Klient: ${dayData.details.clientName}`
          if (dayData.details?.meetings) tooltipContent += `<br/>Møder: ${dayData.details.meetings}`
          if (dayData.details?.hoursLogged) tooltipContent += `<br/>Timer: ${dayData.details.hoursLogged}`
        }
        
        return tooltipContent
      },
      backgroundColor: 'rgba(13, 58, 92, 0.95)',
      borderColor: 'rgba(145, 204, 117, 0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      }
    },
    visualMap: {
      min: 0,
      max: maxValue.value,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 10,
      pieces: [
        { min: maxValue.value * 0.8, label: 'Meget høj', color: '#CFAE76' },  
        { min: maxValue.value * 0.6, max: maxValue.value * 0.8, label: 'Høj', color: '#36a8ff' },
        { min: maxValue.value * 0.4, max: maxValue.value * 0.6, label: 'Medium', color: '#1f80d0' },
        { min: maxValue.value * 0.2, max: maxValue.value * 0.4, label: 'Lav', color: '#145d9c' },
        { max: maxValue.value * 0.2, label: 'Meget lav', color: '#0d3a5c' }    
      ],
      textStyle: {
        color: '#fff'
      }
    },
    calendar: {
      top: 120,
      left: 50,
      right: 50,
      bottom: 20,
      cellSize: ['auto', 20],
      range: selectedYear.value.toString(),
      itemStyle: {
        borderWidth: 0.5,
        borderColor: '#1d3557',
        color: '#0a1f33'
      },
      yearLabel: { 
        show: true,
        color: '#bcd4ff',
        fontSize: 20
      },
      monthLabel: {
        color: '#bcd4ff',
        fontSize: 14
      },
      dayLabel: {
        color: '#bcd4ff',
        fontSize: 12
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#28486e',
          width: 2,
          type: 'solid'
        }
      }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: getHeatmapData.value
    }
  }
  
  chartInstance.setOption(option, true)
}

// Handle filter changes
const handleRadioFilter = (filter) => {
  radioFilter.value = filter
}

// Handle  filter changes from FilterPanel
const handleAdvancedFilter = (filters) => {
  console.log('Advanced filters applied:', filters)
  
  // Update all filter values from FilterPanel
  selectedDataType.value = filters.dataType
  selectedYear.value = filters.year
  Nyfilter.value = {
    status: filters.status,
    workType: filters.workType,
    balance: filters.balance,
    industry: filters.industry
  }
}

// Watch for data changes
watch([() => calendarData.value, selectedYear, selectedDataType, radioFilter, Nyfilter], () => {
  if (calendarData.value) {
    nextTick(() => {
      if (!chartInstance) {
        initChart()
      } else {
        updateChart()
      }
    })
  }
}, { deep: true })

// Lifecycle hooks
onMounted(async () => {
  await fetchCalendarData(props.initials)
  
  // Set default year to latest available
  if (availableYears.value.length > 0) {
    selectedYear.value = availableYears.value[0]
  }
  
  setTimeout(() => {
    nextTick(() => {
      if (calendarData.value) {
        initChart()
      }
    })
  }, 100)
  
  // Handle window resize
  const resizeHandler = () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  }
  window.addEventListener('resize', resizeHandler)
  
  // Store cleanup function
  window._calendarResizeHandler = resizeHandler
})

// Cleanup on unmount
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  if (window._calendarResizeHandler) {
    window.removeEventListener('resize', window._calendarResizeHandler)
    delete window._calendarResizeHandler
  }
})
</script>

<style scoped>
.gold-text {
  color: #CFAE76;
}
</style>