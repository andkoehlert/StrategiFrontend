<template>
  <div class="w-full h-full">
    <div v-if="!yearSummary || yearSummary.length === 0" class="flex items-center justify-center h-full text-gray-400">
      No historical data available
    </div>
    <ECharts 
      v-else
      :option="chartOption" 
      width="100%" 
      height="100%" 
      @click="handleChartClick" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ECharts from '~/components/app/charts/ECharts.vue'
import type { YearSummary } from '~/interfaces/historie'

interface Props {
  yearSummary: YearSummary[]
  selectedYear: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'year-selected', year: number): void
}>()

const chartOption = computed(() => {
  if (!props.yearSummary || props.yearSummary.length === 0) return {}
  
  const years = props.yearSummary.map(item => item.year)
  const totals = props.yearSummary.map(item => item.total)
  
  return {
    backgroundColor: 'transparent',
    grid: {
      left: '8%',
      right: '5%',
      top: '10%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: years,
      boundaryGap: false,
      axisLabel: {
        color: '#fff',
        fontSize: 11
      },
      axisLine: {
        lineStyle: { color: '#fff' }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
        fontSize: 11,
        formatter: (value: number) => {
          if (value >= 1000) {
            return (value / 1000) + 'k'
          }
          return value
        }
      },
      axisLine: {
        lineStyle: { color: '#fff' }
      },
      splitLine: {
        lineStyle: { color: '#004274' }
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: 'rgba(13, 58, 92, 0.95)',
      borderColor: '#91cc75',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      formatter: (params: any) => {
        const item = params[0]
        return `<strong>${item.name}</strong><br/>Total: ${item.value.toLocaleString('da-DK')} DKK<br/><span style="color: #91cc75;">Click to select year</span>`
      }
    },
    series: [
      {
        name: 'Total',
        type: 'line',
        data: totals,
        smooth: true,
        cursor: 'pointer',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(91, 204, 117, 0.8)' },
              { offset: 1, color: 'rgba(91, 204, 117, 0.1)' }
            ]
          }
        },
        lineStyle: {
          color: '#5bcc75',
          width: 2
        },
        itemStyle: {
          color: '#5bcc75'
        },
        emphasis: {
          itemStyle: {
            color: '#fff',
            borderColor: '#5bcc75',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(91, 204, 117, 0.5)'
          },
          scale: true
        },
        markPoint: props.selectedYear ? {
          data: [
            {
              coord: [
                years.indexOf(props.selectedYear),
                totals[years.indexOf(props.selectedYear)]
              ],
              symbol: 'circle',
              symbolSize: 15,
              itemStyle: {
                color: '#fff',
                borderColor: '#5bcc75',
                borderWidth: 3,
                shadowBlur: 10,
                shadowColor: 'rgba(91, 204, 117, 0.8)'
              }
            }
          ]
        } : undefined
      }
    ]
  }
})

const handleChartClick = (params: any) => {
  if (params.componentType === 'series' && props.yearSummary) {
    const year = props.yearSummary[params.dataIndex].year
    emit('year-selected', year)
  }
}
</script>