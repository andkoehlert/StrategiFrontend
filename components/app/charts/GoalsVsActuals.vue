<template>
  <div class="p-6 rounded-xl">
    <ECharts :option="chartOption" width="100%" height="550px" />

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
              <th class="p-4 text-xs text-center">Mål</th>
              <th class="p-4 text-xs text-center">Faktisk</th>
              <th class="p-4 text-xs text-center rounded-tr-lg">Difference %</th>
            </tr>
          </thead>

          <tbody v-if="props.segmentComparison?.length">
            <tr
              v-for="(s, i) in props.segmentComparison"
              :key="i"
              :class="i % 2 === 0 ? 'bg-[#00345C]' : 'bg-[#002847]'"
            >
              <td class="p-4 text-xs font-semibold">{{ s.name }}</td>
              <td class="p-4 text-xs text-center">{{ formatNumber(s.goalTotal) }}</td>
              <td class="p-4 text-xs text-center">{{ formatNumber(s.actualTotal) }}</td>
              <td
                class="p-4 text-xs text-center font-semibold"
                :class="((s.actualTotal - s.goalTotal)/s.goalTotal >= 0) ? 'text-green-400' : 'text-red-400'"
              >
                {{ s.goalTotal ? (((s.actualTotal - s.goalTotal) / s.goalTotal) * 100).toFixed(1) + '%' : '–' }}
              </td>
            </tr>
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

const formatNumber = (value) =>
  new Intl.NumberFormat('da-DK').format(value ?? 0)

const updateChart = () => {
  if (!props.segmentComparison?.length) return

  chartOption.value = {
    title: {
      text: `Mål vs. Faktisk (${props.year || ''})`,
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
  // Show each series separately in tooltip
  formatter: (params) => {
    let tooltip = `${params[0].axisValue}<br/>`
    params.forEach(p => {
      const diff = p.seriesName === 'Faktisk' 
        ? ((props.segmentComparison[p.dataIndex].actualTotal - props.segmentComparison[p.dataIndex].goalTotal) / props.segmentComparison[p.dataIndex].goalTotal) * 100
        : null
      tooltip += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${p.color};"></span>`
      tooltip += `${p.seriesName}: ${p.value?.toLocaleString('da-DK')}`
      if (diff !== null && !isNaN(diff)) tooltip += ` (${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%)`
      tooltip += '<br/>'
    })
    return tooltip
  }
},


    legend: {
      data: ['Mål', 'Faktisk'],
      textStyle: { color: '#fff', fontSize: 11 },
      top: 50,
      left: 0,
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
      data: props.segmentComparison.map(s => s.name),
      axisLabel: { color: '#fff', rotate: 45, interval: 0, margin: 15 },
      axisLine: { lineStyle: { color: '#fff' } }
    },

    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
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
    itemStyle: { color: '#FFCE34' }
  },
  {
    name: 'Faktisk',
    type: 'bar',
    data: props.segmentComparison.map(s => s.actualTotal),
    itemStyle: { color: '#65B581' },
    label: {
      show: true,
      position: 'top',
      color: '#fff',
      fontSize: 11,
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
