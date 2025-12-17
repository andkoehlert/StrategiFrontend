<template>
  <div class="bg-gradient-to-b from-[#175381] to-[#175381]/30 p-6 rounded-xl">
    <ECharts :option="chartOption" width="100%" height="550px" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ECharts from '~/components/app/charts/ECharts.vue'

const props = defineProps({
  data: Object,
  type: String 
})

const chartOption = ref({})

const updateChart = () => {
  if (!props.data) return
  
  const title = props.type === 'goals' ? 'Goals - Category Breakdown by Segment' : 'Actual - Category Breakdown by Segment'
  
  chartOption.value = {
    title: {
      text: title,
      textStyle: { color: '#fff', fontSize: 16 },
      padding: [10, 0, 15, 0]
    },
    backgroundColor: 'transparent',
    toolbox: {
      top: 15,
      right: 20,
      feature: {
        saveAsImage: {
          title: 'Save as Image',
          backgroundColor: '#002847'
        },
        dataView: { 
          readOnly: false,
          title: 'Data View'
        },
        restore: { title: 'Restore' },
        magicType: {
          type: ['line', 'bar', 'stack'],
          title: {
            line: 'Line',
            bar: 'Bar',
            stack: 'Stack'
          }
        }
      },
      iconStyle: {
        borderColor: '#fff'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
 legend: {
  data: props.data.categories,
  textStyle: { color: '#fff', fontSize: 11 },
  top: 50,
  left: 0,
  orient: 'horizontal',
  width: 1000,  
  height: 100,
  itemWidth: 25,
  itemHeight: 14,
  itemGap: 10  
},

    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: 130,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.data.segments.map(s => s.name),
      axisLabel: {
        color: '#fff',
        rotate: 45,
        interval: 0,
        margin: 15
      },
      axisLine: { lineStyle: { color: '#fff' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { 
        color: '#fff',
        margin: 10
      },
      axisLine: { lineStyle: { color: '#fff' } },
      splitLine: { lineStyle: { color: '#004274' } }
    },
    series: props.data.categories.map((category, idx) => ({
      name: category,
      type: 'bar',
      data: props.data.segments.map(s => s.data[idx])
    }))
  }
}

watch(() => props.data, updateChart, { deep: true, immediate: true })
</script>