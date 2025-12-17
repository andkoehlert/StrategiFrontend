<template>
  <div class="w-full h-full min-h-[300px]">
    <div v-if="!monthlyData" class="flex items-center justify-center h-full text-gray-400">
      No monthly data available for {{ year }}
    </div>
    <ECharts 
      v-else
      :option="chartOption" 
      width="100%" 
      height="100%" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ECharts from '~/components/app/charts/ECharts.vue'
import type { ProcessedMonthlyData } from '~/interfaces/monthly'

interface Props {
  monthlyData: ProcessedMonthlyData | null
  year: number
  title?: string
}

const props = defineProps<Props>()

const chartOption = computed(() => {
  if (!props.monthlyData?.months || props.monthlyData.months.length === 0) return {}

  const months = props.monthlyData.months.map(d => d.month)
  const afregnet = props.monthlyData.months.map(d => d.afregnet)
  const ditMaal = props.monthlyData.months.map(d => d.ditMaal)

  return {
    title: {
      text: props.title || ` ${props.year}`,
      left: 'center',
      textStyle: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: 'bold',
        lineHeight: 28 
      }
    },
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(13, 58, 92, 0.95)',
      borderColor: '#91cc75',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      formatter: (params: any) => {
        let result = `<strong>${params[0].axisValue}</strong><br/>`
        params.forEach((param: any) => {
          const value = param.data.toLocaleString('da-DK')
          result += `${param.marker} ${param.seriesName}: ${value} DKK<br/>`
        })
        
        // Calculate percentage
        if (params.length === 2) {
          const actual = params[0].data
          const goal = params[1].data
          const percentage = goal > 0 ? ((actual / goal) * 100).toFixed(1) : 0
          result += `<br/>Achievement: ${percentage}%`
        }
        
        return result
      }
    },
    legend: {
      data: ['Afregnet', 'Dit Mål'],
      top: 50,
      textStyle: {
        color: '#fff',
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months,
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
          return value.toLocaleString('da-DK')
        }
      },
      axisLine: {
        lineStyle: { color: '#fff' }
      },
      splitLine: {
        lineStyle: { 
          color: 'rgba(255,255,255,0.1)' 
        }
      }
    },
    series: [
      {
        name: 'Afregnet',
        type: 'bar',
        data: afregnet,
        itemStyle: {
          color: '#f0cb8b',
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: false
        },
        barWidth: '40%'
      },
      {
        name: 'Dit Mål',
        type: 'bar',
        data: ditMaal,
        itemStyle: {
          color: '#cfae76',
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: false
        },
        barWidth: '40%'
      }
    ]
  }
})
</script>