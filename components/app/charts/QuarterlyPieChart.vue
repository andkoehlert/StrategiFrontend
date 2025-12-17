<template>
  <div class="w-full h-full min-h-[400px]" >
    <div v-if="!yearData" class="flex items-center justify-center h-full text-gray-400">
      No data available for {{ year }}
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
import type { ProcessedYearData } from '~/interfaces/quarterly'

interface Props {
  yearData: ProcessedYearData | null
  year: number
  type?: 'actual' | 'goals'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'actual'
})

const chartOption = computed(() => {
  // Guard clause - return empty object if no data
  if (!props.yearData?.quarterly) return {}
  
  const quarterly = props.yearData.quarterly
  const totals = props.yearData.totals
  
  // Helper function to calculate percentage
  const calculatePercentage = (value: number): number => {
    return Math.round((value / totals.combined) * 100)
  }
  
  const pieData = [
    { 
      value: quarterly.Q1.total, 
      name: 'Q1', 
      percentage: calculatePercentage(quarterly.Q1.total) 
    },
    { 
      value: quarterly.Q2.total, 
      name: 'Q2', 
      percentage: calculatePercentage(quarterly.Q2.total) 
    },
    { 
      value: quarterly.Q3.total, 
      name: 'Q3', 
      percentage: calculatePercentage(quarterly.Q3.total) 
    },
    { 
      value: quarterly.Q4.total, 
      name: 'Q4', 
      percentage: calculatePercentage(quarterly.Q4.total) 
    }
  ]
  
  return {
    backgroundColor: 'transparent',
    color: ['#f0cb8b', '#e2ae60', '#d9a253', '#cfae76'],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(13, 58, 92, 0.95)',
      borderColor: '#91cc75',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      formatter: (params: any) => {
        const quarterKey = params.name as keyof typeof quarterly
        const quarter = quarterly[quarterKey]
        
        if (!quarter) return ''
        
        let monthsBreakdown = '<br/><br/><strong>Monthly breakdown:</strong><br/>'
        for (const [month, value] of Object.entries(quarter.months)) {
          monthsBreakdown += `${month}: ${value.toLocaleString('da-DK')} DKK<br/>`
        }
        
        return `
          <strong>${params.name}</strong><br/>
          Total: ${params.value.toLocaleString('da-DK')} DKK<br/>
          Percentage: ${params.data.percentage}%
          ${monthsBreakdown}
        `
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      textStyle: {
        color: '#fff',
        fontSize: 12
      }
    },
    series: [
      {
        name: 'Quarter',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        data: pieData,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#175381',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          color: '#fff',
          formatter: '{b}\n{d}%',
          fontSize: 13
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