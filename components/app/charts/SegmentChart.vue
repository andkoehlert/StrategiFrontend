<template>
  <div class="w-full h-full">
    <div v-if="!yearData" class="flex items-center justify-center h-[450px] text-gray-400">
      No data available for {{ year }}
    </div>
    <ECharts 
      v-else
      :option="chartOption" 
      width="100%" 
      height="450px" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ECharts from '~/components/app/charts/ECharts.vue'
import type { ProcessedYearlyData } from '~/interfaces/yearly'

interface Props {
  yearData: ProcessedYearlyData | null
  year: number
}

const props = defineProps<Props>()

const chartOption = computed(() => {
  if (!props.yearData) return {}
  
  const actual = props.yearData.actual
  const goal = props.yearData.goal
  const percentage = props.yearData.percentage
  const remaining = props.yearData.difference
  
  return {
    title: {
      text: `Actual vs Goals ${props.year}`,
      subtext: `${percentage}% of goal achieved`,
      textStyle: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: 'bold' 
      },
      subtextStyle: { 
        color: percentage >= 100 ? '#91cc75' : '#f0cb8b', 
        fontSize: 14 
      },
      left: 'center',
      top: 20
    },
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#175381',
      borderColor: '#91cc75',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      formatter: (params: any) => {
        const value = params.value.toLocaleString('da-DK')
        const percent = params.percent.toFixed(1)
        return `
          <strong>${params.name}</strong><br/>
          ${value} ${props.yearData?.currency || 'DKK'}<br/>
          ${percent}%
        `
      }
    },
    legend: {
      top: '15%',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 13
      }
    },
    series: [
      {
        name: 'Performance',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '70%'],
        startAngle: 180,
        endAngle: 360,
        data: [
          { 
            value: actual, 
            name: `Actual ${props.year}`,
            itemStyle: { 
              color: '#f0cb8b',
              borderRadius: 5,
              borderColor: '#175381',
              borderWidth: 2
            },
            label: {
              color: '#fff',
              formatter: '{b}\n{c} DKK',
              fontSize: 13
            }
          },
          { 
            value: remaining > 0 ? remaining : 0, 
            name: remaining > 0 ? `Remaining` : 'Goal Exceeded!',
            itemStyle: { 
              color: remaining > 0 ? '#cfae76' : '#91cc75',
              borderRadius: 5,
              borderColor: '#175381',
              borderWidth: 2
            },
            label: {
              color: '#fff',
              formatter: remaining > 0 ? '{b}\n{c} DKK' : '{b}',
              fontSize: 13
            }
          }
        ],
        label: {
          show: true,
          position: 'outside',
          color: '#fff'
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 10,
          lineStyle: {
            color: '#fff'
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        }
      }
    ]
  }
})
</script>