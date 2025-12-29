<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import type { EChartsOption } from 'echarts'

const props = defineProps<{
  option: EChartsOption
  width?: string
  height?: string
}>()

const { $echarts } = useNuxtApp()
const chartRef = ref<HTMLElement>()
let chartInstance: any = null

// Expose the chart instance to parent components
defineExpose({
  getChartInstance: () => chartInstance
})

onMounted(() => {
  if (chartRef.value) {
    chartInstance = $echarts.init(chartRef.value, 'light', {
      renderer: 'canvas' 
    })

    chartInstance.setOption(props.option)
    
    // Handle resize
    window.addEventListener('resize', handleResize)
  }
})

const handleResize = () => {
  chartInstance?.resize()
}

// Watch for option changes
watch(
  () => props.option,
  (newOption) => {
    if (!chartInstance || !newOption) return

    chartInstance.clear() 
    chartInstance.setOption(newOption, {
      notMerge: true,
      lazyUpdate: false
    })
  },
  { deep: true, immediate: true }
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>