<template>
  <div class="bg-gradient-to-b from-[#175381] to-[#175381]/30 p-6 rounded-xl">
    <ECharts :option="chartOption" width="100%" height="550px" />
    
    <!-- Custom Table View Toggle -->
    <div class="mt-4">
      <button 
        @click="showTable = !showTable"
        class="px-4 py-2 bg-[#CFAE76] hover:bg-[#002847] text-white rounded-lg transition-colors"
      >
        {{ showTable ? 'Hide Table' : 'Vis i Excel format' }}
      </button>
    </div>

    <!-- Data Table -->
    <div v-if="showTable" class="mt-6 rounded-lg overflow-hidden">
      <div class="overflow-y-auto max-h-[60vh]">
        <table class="w-full text-sm text-white border-collapse">
          <thead class="bg-[#002847] sticky top-0">
            <tr>
              <th class="p-4 text-xs text-left rounded-tl-lg">Segment</th>
              <th 
                v-for="category in props.data?.categories" 
                :key="category"
                class="p-4 text-xs text-center"
              >
                {{ category }}
              </th>
              <th class="p-4 text-xs text-center rounded-tr-lg">Total</th>
            </tr>
          </thead>

          <tbody v-if="props.data?.segments?.length">
            <tr
              v-for="(segment, index) in props.data.segments"
              :key="index"
              :class="index % 2 === 0 ? 'bg-[#00345C]' : 'bg-[#002847]'"
            >
              <td class="p-4 text-xs font-semibold">{{ segment.name }}</td>
              <td 
                v-for="(value, idx) in segment.data" 
                :key="idx"
                class="p-4 text-xs text-center border-l border-[#004274]"
              >
                {{ formatNumber(value) }}
              </td>
              <td class="p-4 text-xs text-center font-semibold text-green-400 border-l-2 border-[#004274]">
                {{ formatNumber(segment.data.reduce((a, b) => a + b, 0)) }}
              </td>
            </tr>
          </tbody>

          <tfoot v-if="props.data?.segments?.length">
            <tr class="bg-[#001F3D] font-semibold">
              <td class="p-4 text-xs rounded-bl-lg">Total</td>
              <td 
                v-for="(category, idx) in props.data.categories" 
                :key="category"
                class="p-4 text-xs text-center border-l border-[#004274]"
              >
                {{ formatNumber(getCategoryTotal(idx)) }}
              </td>
              <td class="p-4 text-xs text-center text-green-400 border-l-2 border-[#004274] rounded-br-lg">
                {{ formatNumber(getGrandTotal()) }}
              </td>
            </tr>
          </tfoot>

          <tbody v-else>
            <tr>
              <td colspan="100%" class="p-4 text-center text-white">Ingen data tilgængelig</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
const showTable = ref(false)

const formatNumber = (value) => {
  if (value == null) return '0'
  return new Intl.NumberFormat('da-DK').format(value)
}

const getCategoryTotal = (categoryIndex) => {
  if (!props.data?.segments) return 0
  return props.data.segments.reduce((sum, segment) => {
    return sum + (segment.data[categoryIndex] || 0)
  }, 0)
}

const getGrandTotal = () => {
  if (!props.data?.segments) return 0
  return props.data.segments.reduce((sum, segment) => {
    return sum + segment.data.reduce((a, b) => a + b, 0)
  }, 0)
}

const generateDataViewHTML = () => {
  if (!props.data?.segments) return '<div>No data available</div>'
  
  let html = `
    <div style="padding: 20px; background: #001F3D; color: white; font-family: system-ui;">
      <h3 style="margin-bottom: 20px; color: white;">Data Table</h3>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead style="background: #002847;">
            <tr>
              <th style="padding: 12px; text-align: left; border: 1px solid #004274;">Segment</th>
  `
  
  props.data.categories.forEach(category => {
    html += `<th style="padding: 12px; text-align: center; border: 1px solid #004274;">${category}</th>`
  })
  
  html += `<th style="padding: 12px; text-align: center; border: 1px solid #004274;">Total</th></tr></thead><tbody>`
  
  props.data.segments.forEach((segment, index) => {
    const bgColor = index % 2 === 0 ? '#00345C' : '#002847'
    const rowTotal = segment.data.reduce((a, b) => a + b, 0)
    
    html += `<tr style="background: ${bgColor};">
      <td style="padding: 12px; border: 1px solid #004274; font-weight: 600;">${segment.name}</td>`
    
    segment.data.forEach(value => {
      html += `<td style="padding: 12px; text-align: center; border: 1px solid #004274;">${formatNumber(value)}</td>`
    })
    
    html += `<td style="padding: 12px; text-align: center; border: 1px solid #004274; color: #4ade80; font-weight: 600;">${formatNumber(rowTotal)}</td></tr>`
  })
  
  html += `</tbody><tfoot style="background: #001F3D; font-weight: 600;"><tr><td style="padding: 12px; border: 1px solid #004274;">Total</td>`
  
  props.data.categories.forEach((_, idx) => {
    html += `<td style="padding: 12px; text-align: center; border: 1px solid #004274;">${formatNumber(getCategoryTotal(idx))}</td>`
  })
  
  html += `<td style="padding: 12px; text-align: center; border: 1px solid #004274; color: #4ade80;">${formatNumber(getGrandTotal())}</td></tr></tfoot></table></div></div>`
  
  return html
}

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
          title: 'Data View',
          lang: ['Data View', 'Close', 'Refresh'],
          optionToContent: () => generateDataViewHTML(),
          contentToOption: (opt) => opt
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