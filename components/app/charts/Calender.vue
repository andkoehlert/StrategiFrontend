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
        
        <!-- Statistics Summary -->
        <div v-if="yearStatistics" class="grid  grid-cols-4 mt-4  gap-4 mb-6 p-6 bg-[#0d3a5c]/50 rounded-lg">
          <div class="text-center">
            <p class="text-gray-300 text-xs mb-1">Total afregnet</p>
            <p class="text-white font-semibold">{{ formatCurrency(yearStatistics.totalSettled) }}</p>
          </div>
          <div class="text-center">
            <p class="text-gray-300 text-xs mb-1">Total sagsværdi</p>
            <p class="text-white font-semibold">{{ formatCurrency(yearStatistics.totalCaseValue) }}</p>
          </div>
          <div class="text-center">
            <p class="text-gray-300 text-xs mb-1">Antal sager</p>
            <p class="text-white font-semibold">{{ yearStatistics.totalCases }}</p>
          </div>
          <div class="text-center">
            <p class="text-gray-300 text-xs mb-1">Dage vist</p>
            <p class="text-white font-semibold">{{ getHeatmapData.length }}</p>
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
        
        // Find the daily data for this date to show additional info
        const yearData = calendarData.value?.years.find(y => y.year === selectedYear.value)
        const dayData = yearData?.dailyData.find(d => d.date === dateStr)
        
        let tooltipContent = `${dateStr}<br/>${dataTypeLabel.value}: ${formattedValue}`
        
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

// Handle filter changes
const handleRadioFilter = (filter) => {
  radioFilter.value = filter
}

// Handle advanced filter changes from FilterPanel
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

// Format currency helper
const formatCurrency = (value) => {
  if (!value) return '0 kr'
  return `${Math.round(value).toLocaleString()} kr`
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