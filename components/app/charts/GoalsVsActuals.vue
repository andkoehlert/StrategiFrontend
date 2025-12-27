<template>
  <div class="bg-gradient-to-b from-[#175381] to-[#175381]/30 p-6 rounded-xl">
    <ECharts :option="chartOption" width="100%" height="550px" />

    <div class="mt-4">
      <button
        @click="showTable = !showTable"
        class="px-4 py-2 bg-[#CFAE76] hover:bg-[#002847] text-white rounded-lg transition-colors"
      >
        {{ showTable ? 'Skjul tabel' : 'Vis i Excel format' }}
      </button>
    </div>

    <!--  Data Table with Categories -->
    <div v-if="showTable" class="mt-6 rounded-lg overflow-hidden">
      <div class="overflow-y-auto max-h-[60vh]">
        <table class="w-full text-sm text-white border-collapse">
          <thead class="bg-[#002847] sticky top-0">
            <tr>
              <th class="p-4 text-xs text-left rounded-tl-lg">Segment</th>
              <th class="p-4 text-xs text-center">Mål Total</th>
              <th class="p-4 text-xs text-center">Performance Total</th>
              <th class="p-4 text-xs text-center rounded-tr-lg">Difference %</th>
            </tr>
          </thead>

          <tbody v-if="props.segmentComparison?.length">
            <template v-for="(s, i) in props.segmentComparison" :key="i">
              <!-- Main row -->
              <tr
                :class="i % 2 === 0 ? 'bg-[#00345C]' : 'bg-[#002847]'"
                class="cursor-pointer hover:bg-[#175381]"
                @click="expandedRow = expandedRow === i ? -1 : i"
              >
                <td class="p-4 text-xs font-semibold">
                  {{ s.name }}
                  <span class="ml-2 text-gray-400">{{ expandedRow === i ? '▼' : '▶' }}</span>
                </td>
                <td class="p-4 text-xs text-center">{{ formatNumber(s.goalTotal) }}</td>
                <td class="p-4 text-xs text-center">{{ formatNumber(s.actualTotal) }}</td>
                <td
                  class="p-4 text-xs text-center font-semibold"
                  :class="((s.actualTotal - s.goalTotal)/s.goalTotal >= 0) ? 'text-green-400' : 'text-red-400'"
                >
                  {{ s.goalTotal ? (((s.actualTotal - s.goalTotal) / s.goalTotal) * 100).toFixed(1) + '%' : '–' }}
                </td>
              </tr>
              
              <!-- expand  category breakdown -->
              <tr v-if="expandedRow === i" class="bg-[#001F3D]">
                <td colspan="4" class="p-4">
                  <div class="text-xs space-y-2">
                    <div class="font-semibold text-gray-300 mb-2">Kategori opdeling:</div>
                    <div 
                      v-for="(category, catIdx) in s.categories" 
                      :key="catIdx"
                      class="flex justify-between items-center py-1 border-b border-gray-700"
                    >
                      <span class="text-gray-400">{{ category }}</span>
                      <div class="flex gap-4">
                        <span class="text-yellow-400">Mål: {{ formatNumber(s.goalData[catIdx]) }}</span>
                        <span class="text-green-400">Performance: {{ formatNumber(s.actualData[catIdx]) }}</span>
                        <span 
                          :class="s.actualData[catIdx] >= s.goalData[catIdx] ? 'text-green-400' : 'text-red-400'"
                        >
                          {{ s.goalData[catIdx] ? (((s.actualData[catIdx] - s.goalData[catIdx]) / s.goalData[catIdx]) * 100).toFixed(0) + '%' : '–' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>

          <tbody v-else>
            <tr>
              <td colspan="4" class="p-4 text-center text-white">Ingen data tilgængelig</td>
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
  segmentComparison: Array,
  year: Number
})

const chartOption = ref({})
const showTable = ref(false)
const expandedRow = ref(-1)

const formatNumber = (value) =>
  new Intl.NumberFormat('da-DK').format(value ?? 0)

const updateChart = () => {
  if (!props.segmentComparison?.length) return

  chartOption.value = {
    title: {
      text: `Mål vs. din performance (${props.year || ''})`,
      textStyle: { color: '#fff', fontSize: 16 },
      padding: [10, 0, 15, 0]
    },

    backgroundColor: 'transparent',

    toolbox: {
      top: 15,
      right: 20,
      feature: {
        saveAsImage: { title: 'Save as Image', backgroundColor: '#002847' },
        restore: { title: 'Restore' },
        magicType: {
          type: ['line', 'bar', 'stack'],
          title: { line: 'Line', bar: 'Bar', stack: 'Stack' }
        }
      },
      iconStyle: { borderColor: '#fff' }
    },

    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(13, 58, 92, 0.98)',
      borderColor: '#91cc75',
      borderWidth: 2,
      padding: 16,
      textStyle: { 
        color: '#fff', 
        fontSize: 14,
        lineHeight: 20
      },
      
      confine: false,
      formatter: (params) => {
        const dataIndex = params[0].dataIndex
        const segment = props.segmentComparison[dataIndex]
        
        // Filter non-zero categories
        const activeCategories = segment.categories
          .map((category, idx) => ({
            name: category,
            goalAmount: segment.goalData[idx],
            actualAmount: segment.actualData[idx],
            index: idx
          }))
          .filter(cat => cat.goalAmount > 0 || cat.actualAmount > 0)
        
        // Decide layout based on number of categories
        const useColumns = activeCategories.length > 5
        
        let tooltip = `<div style="padding: 8px; min-width: ${useColumns ? '700px' : '420px'}; max-width: 900px;">
          <div style="font-weight: bold; margin-bottom: 12px; font-size: 16px; border-bottom: 2px solid #91cc75; padding-bottom: 8px;">
            ${segment.name}
          </div>`
        
        // Overall totals
        tooltip += `<div style="margin-bottom: 12px; font-size: 14px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; padding: 4px 0;">
            <span style="color: #FFCE34; font-size: 14px;">Mål:</span>
            <span style="font-weight: bold; font-size: 15px;">${formatNumber(segment.goalTotal)} kr</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; padding: 4px 0;">
            <span style="color: #65B581; font-size: 14px;">Performance:</span>
            <span style="font-weight: bold; font-size: 15px;">${formatNumber(segment.actualTotal)} kr</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 6px 0; margin-top: 8px; border-top: 1px solid #004274;">
            <span style="font-size: 14px;">Difference:</span>
            <span style="color: ${segment.actualTotal >= segment.goalTotal ? '#65B581' : '#FF6B6B'}; font-weight: bold; font-size: 16px;">
              ${segment.goalTotal ? ((segment.actualTotal - segment.goalTotal) / segment.goalTotal * 100).toFixed(1) : '0'}%
            </span>
          </div>
        </div>`
        
        tooltip += `<div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid #004274;">
          <div style="font-size: 13px; color: #91cc75; margin-bottom: 8px; font-weight: 600;">
            Kategori opdeling (${activeCategories.length} kategorier):
          </div>
          <div style="display: grid; grid-template-columns: ${useColumns ? 'repeat(2, 1fr)' : '1fr'}; gap: 8px;">`
        
        activeCategories.forEach(cat => {
          const diff = cat.goalAmount ? ((cat.actualAmount - cat.goalAmount) / cat.goalAmount * 100).toFixed(0) : '0'
          const diffColor = cat.actualAmount >= cat.goalAmount ? '#65B581' : '#FF6B6B'
          
          tooltip += `<div style="font-size: 11px; padding: 8px; background: rgba(0,0,0,0.4); border-radius: 4px; border-left: 3px solid ${diffColor};">
            <div style="font-weight: 600; margin-bottom: 4px; font-size: 12px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${cat.name}">
              ${cat.name}
            </div>
            <div style="display: flex; justify-content: space-between; gap: 6px; font-size: 11px;">
              <span style="color: #FFCE34;">M: ${formatNumber(cat.goalAmount)}</span>
              <span style="color: #65B581;">P: ${formatNumber(cat.actualAmount)}</span>
              <span style="color: ${diffColor}; font-weight: 600;">${diff > 0 ? '+' : ''}${diff}%</span>
            </div>
          </div>`
        })
        
        tooltip += `</div></div></div>`
        return tooltip
      }
    },

    legend: {
      data: ['Mål', 'Performance'],
      textStyle: { color: '#fff', fontSize: 13 },  
      top: 50,
      left: 0,
      itemGap: 15,
      itemWidth: 30,  
      itemHeight: 16
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
      data: props.segmentComparison.map(s => s.name),
      axisLabel: { 
        color: '#fff', 
        rotate: 45, 
        interval: 0, 
        margin: 15,
        fontSize: 12  
      },
      axisLine: { lineStyle: { color: '#fff' } }
    },

    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
        fontSize: 12,  
        formatter: v =>
          v >= 1_000_000
            ? (v / 1_000_000).toFixed(1) + 'M'
            : v >= 1_000
            ? (v / 1_000) + 'k'
            : v
      },
      splitLine: { lineStyle: { color: '#004274' } }
    },

    series: [
      {
        name: 'Mål',
        type: 'bar',
        data: props.segmentComparison.map(s => s.goalTotal),
        itemStyle: { color: '#FFCE34' },
        barWidth: '35%'  
      },
      {
        name: 'Performance',
        type: 'bar',
        data: props.segmentComparison.map(s => s.actualTotal),
        itemStyle: { color: '#65B581' },
        barWidth: '35%',  
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          fontSize: 12,  
          fontWeight: 'bold',
          formatter: ({ dataIndex }) => {
            const s = props.segmentComparison[dataIndex]
            if (!s.goalTotal) return ''
            const diff = ((s.actualTotal - s.goalTotal) / s.goalTotal) * 100
            return `${diff > 0 ? '+' : ''}${diff.toFixed(0)}%`
          }
        }
      }
    ]
  }
}

watch(
  () => props.segmentComparison,
  updateChart,
  { deep: true, immediate: true }
)
</script>