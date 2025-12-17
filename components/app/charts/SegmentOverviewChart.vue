<template>
  <div class="w-full h-full min-h-[600px]">
    <div v-if="!segmentData" class="flex items-center justify-center h-full text-gray-400">
      No segment data available for {{ year }}
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
import type { ProcessedSegmentData } from '~/interfaces/segment'

interface Props {
  segmentData: ProcessedSegmentData | null
  year: number
}

const props = defineProps<Props>()

const chartOption = computed(() => {
  if (!props.segmentData?.segments) return {}
  
  const segments = props.segmentData.segments
  const totalAmount = props.segmentData.totalAmount
  
  // Prepare dataset: [percentage, amount, segment name]
  const source = [
    ['percentage', 'amount', 'segment']
  ]
  
  // Add each segment with its percentage and total
  segments.forEach(segment => {
    const percentage = totalAmount > 0 ? (segment.amount / totalAmount) * 100 : 0
    source.push([
      percentage,
      segment.amount,
      segment.name
    ])
  })
  
  return {
    backgroundColor: 'transparent',
    dataset: {
      source: source
    },
    grid: { 
      containLabel: true,
      left: '3%',
      right: '8%',
      top: '8%',
      bottom: '18%'
    },
    xAxis: { 
      name: 'Amount (DKK)',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        color: '#fff',
        fontSize: 12
      },
      axisLabel: {
        color: '#fff',
        fontSize: 10,
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
    yAxis: { 
      type: 'category',
      axisLabel: {
        color: '#fff',
        fontSize: 11,
        width: 150,
        overflow: 'truncate'
      },
      axisLine: {
        lineStyle: { color: '#fff' }
      }
    },
    visualMap: {
      orient: 'horizontal',
      left: 'center',
      bottom: 10,
      min: 0,
      max: 100,
      text: ['High %', 'Low %'],
      textStyle: {
        color: '#fff'
      },
      dimension: 0, 
      inRange: {
        color: ['#FD665F', '#FFCE34', '#65B581']
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
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
        const percentage = item.value[0].toFixed(1)
        const amount = item.value[1].toLocaleString('da-DK')
        const segment = item.value[2]
        return `<strong>${segment}</strong><br/>Amount: ${amount} DKK<br/>Percentage: ${percentage}%`
      }
    },
    series: [
      {
        type: 'bar',
        encode: {
          x: 'amount',
          y: 'segment'
        },
        label: {
          show: true,
          position: 'right',
          color: '#fff',
          formatter: (params: any) => {
            const percentage = params.value[0].toFixed(0)
            return `${percentage}%`
          },
          fontSize: 11
        },
        barMaxWidth: 30,
        itemStyle: {
          borderRadius: 4
        }
      }
    ]
  }
})
</script>