<template>
  <div class="bg-gradient-to-b from-[#175381] to-[#175381]/30 p-6 rounded-xl">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-white text-lg font-semibold">Segment analyse</h3>
      <select 
        v-model="selectedYear" 
        class="bg-[#0d3a5c] text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-[#91cc75]"
      >
        <option v-for="year in availableYears" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>

    <!-- Bar Chart showing segment distribution -->
    <div class="mb-8">
      <h4 class="text-white text-md font-medium mb-3">Segment fordeling</h4>
      <div class="h-[400px]">
        <ECharts :option="barChartOption" width="100%" height="100%" />
      </div>
    </div>

    <!-- Line Chart showing trends -->
    <div>
      <h4 class="text-white text-md font-medium mb-3">Segment udvikling</h4>
      <div class="h-[500px]">
        <ECharts :option="lineChartOption" width="100%" height="100%" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import ECharts from '~/components/app/charts/ECharts.vue'

interface SegmentData {
  name: string
  total: number
  count?: number
  data?: number[]
}

interface YearData {
  year: number
  type: string
  segments: SegmentData[]
  categories?: string[]
  totals: {
    grandTotal: number
  }
}

interface HistoricalData {
  historicalData: {
    [key: string]: YearData
  }
  yearSummary: Array<{ year: number; total: number }>
}

const props = defineProps<{
  historicalData: HistoricalData | null
}>()

const selectedYear = ref(2024)

// Get available years from historical data
const availableYears = computed(() => {
  if (!props.historicalData?.historicalData) return [2024]
  return Object.keys(props.historicalData.historicalData)
    .map(Number)
    .sort((a, b) => b - a) // Sort descending (newest first)
})

// Get data for selected year
const selectedYearData = computed(() => {
  if (!props.historicalData?.historicalData) return null
  return props.historicalData.historicalData[selectedYear.value]
})

// Get only segments with data for selected year
const activeSegments = computed(() => {
  if (!selectedYearData.value?.segments) return []
  return selectedYearData.value.segments.filter(seg => seg.total > 0)
})

// Get all unique segment names across all years
const allSegmentNames = computed(() => {
  if (!props.historicalData?.historicalData) return []
  const namesSet = new Set<string>()
  Object.values(props.historicalData.historicalData).forEach(yearData => {
    yearData.segments.forEach(seg => {
      if (seg.total > 0) namesSet.add(seg.name)
    })
  })
  return Array.from(namesSet)
})

const barChartOption = ref({})
const lineChartOption = ref({})

const updateBarChart = () => {
  if (!selectedYearData.value || !activeSegments.value.length) return

  const segmentNames = activeSegments.value.map(s => s.name)
  const segmentTotals = activeSegments.value.map(s => s.total)
  
  const total = selectedYearData.value.totals.grandTotal
  const percentages = segmentTotals.map(t => ((t / total) * 100).toFixed(1))

  barChartOption.value = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#91cc75',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      },
      formatter: (params: any) => {
        const p = params[0]
        const idx = p.dataIndex
        const percentage = percentages[idx]
        return `
          <div style="padding: 5px;">
            <strong>${p.axisValue}</strong><br/>
            Total: <span style="color: #91cc75; font-weight: bold;">${p.data.toLocaleString()} DKK</span><br/>
            Share: <span style="color: #f0cb8b;">${percentage}%</span>
          </div>
        `
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: segmentNames,
      axisLabel: {
        color: '#fff',
        fontSize: 11,
        interval: 0,
        rotate: 45,
        formatter: (value: string) => {
          return value.length > 25 ? value.substring(0, 25) + '...' : value
        }
      },
      axisLine: {
        lineStyle: { color: 'rgba(255,255,255,0.3)' }
      },
      axisTick: {
        lineStyle: { color: 'rgba(255,255,255,0.3)' }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Amount (DKK)',
      nameTextStyle: {
        color: '#fff',
        fontSize: 14
      },
      axisLabel: {
        color: '#fff',
        fontSize: 12,
        formatter: (value: number) => {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M'
          } else if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'K'
          }
          return value.toString()
        }
      },
      axisLine: {
        lineStyle: { color: 'rgba(255,255,255,0.3)' }
      },
      splitLine: {
        lineStyle: { 
          color: 'rgba(255,255,255,0.1)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: 'Segment Total',
        type: 'bar',
        data: segmentTotals,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#91cc75' },
              { offset: 1, color: '#5fa34f' }
            ]
          },
          borderRadius: [8, 8, 0, 0],
          shadowColor: 'rgba(145, 204, 117, 0.5)',
          shadowBlur: 10
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#b3e699' },
                { offset: 1, color: '#91cc75' }
              ]
            },
            shadowColor: 'rgba(145, 204, 117, 0.8)',
            shadowBlur: 20
          }
        },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          fontSize: 11,
          fontWeight: 'bold',
          formatter: (params: any) => {
            const val = params.data
            if (val >= 1000000) {
              return (val / 1000000).toFixed(1) + 'M'
            } else if (val >= 1000) {
              return (val / 1000).toFixed(0) + 'K'
            }
            return val.toString()
          }
        },
        barWidth: '60%',
        barMaxWidth: 80
      }
    ]
  }
}

const updateLineChart = () => {
  if (!props.historicalData?.historicalData) return

  const years = availableYears.value.sort((a, b) => a - b) // Sort ascending for line chart
  const segmentNames = allSegmentNames.value

  // Color palette for different segments
  const colors = [
    '#91cc75',
    '#5fa34f',
    '#f0cb8b',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452'
  ]

  // Create series data for each segment
  const series = segmentNames.map((segmentName, index) => {
    const data = years.map(year => {
      const yearData = props.historicalData?.historicalData[year]
      const segment = yearData?.segments.find(s => s.name === segmentName)
      return segment?.total || 0
    })

    return {
      name: segmentName,
      type: 'line',
      data: data,
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 3
      },
      itemStyle: {
        color: colors[index % colors.length],
        borderWidth: 2,
        borderColor: '#fff'
      },
      emphasis: {
        focus: 'series',
        lineStyle: {
          width: 4
        }
      }
    }
  })

  lineChartOption.value = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#91cc75',
      borderWidth: 1,
      textStyle: {
        color: '#fff'
      },
      formatter: (params: any) => {
        let result = `<strong>${params[0].axisValue}</strong><br/>`
        params.forEach((p: any) => {
          if (p.value > 0) {
            result += `
              <div style="display: flex; align-items: center; margin-top: 5px;">
                <span style="display: inline-block; width: 10px; height: 10px; background: ${p.color}; border-radius: 50%; margin-right: 5px;"></span>
                ${p.seriesName}: <span style="color: #91cc75; font-weight: bold; margin-left: 5px;">${p.value.toLocaleString()} DKK</span>
              </div>
            `
          }
        })
        return result
      }
    },
    legend: {
      data: segmentNames,
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      top: 10,
      type: 'scroll',
      pageTextStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: years,
      boundaryGap: false,
      axisLabel: {
        color: '#fff',
        fontSize: 12
      },
      axisLine: {
        lineStyle: { color: 'rgba(255,255,255,0.3)' }
      },
      axisTick: {
        lineStyle: { color: 'rgba(255,255,255,0.3)' }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Amount (DKK)',
      nameTextStyle: {
        color: '#fff',
        fontSize: 14
      },
      axisLabel: {
        color: '#fff',
        fontSize: 12,
        formatter: (value: number) => {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M'
          } else if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'K'
          }
          return value.toString()
        }
      },
      axisLine: {
        lineStyle: { color: 'rgba(255,255,255,0.3)' }
      },
      splitLine: {
        lineStyle: { 
          color: 'rgba(255,255,255,0.1)',
          type: 'dashed'
        }
      }
    },
    series: series
  }
}

// Watch for changes
watch(selectedYear, () => {
  updateBarChart()
})

watch(() => props.historicalData, () => {
  updateBarChart()
  updateLineChart()
}, { deep: true, immediate: true })
</script>