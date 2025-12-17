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

onMounted(() => {
  if (chartRef.value) {
    // Add devicePixelRatio option for high-DPI displays
  chartInstance = $echarts.init(chartRef.value, 'light', {
  renderer: 'svg'
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
watch(() => props.option, (newOption) => {
  chartInstance?.setOption(newOption, true)
}, { deep: true })

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>