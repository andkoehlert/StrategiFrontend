<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import * as echarts from 'echarts'

const apiData = ref([])
const selectedYear = ref(null)
const chart = ref(null)

onMounted(async () => {
  const res = await fetch('https://specifikation.dev.kirklarsen.dk/timereg-data/13603-002')
  const json = await res.json()

  const caseKey = Object.keys(json)[0]
  apiData.value = json[caseKey].Query3 ?? []

  const years = apiData.value.map(i => Number(i.Dato.slice(0, 4)))
  selectedYear.value = Math.max(...years) 

  const el = document.getElementById('calendarChart')
  chart.value = echarts.init(el)

  updateChart()
})

// --------------------------------------
// COMPUTED: Filter data by selected year
// --------------------------------------
const filteredData = computed(() => {
  return apiData.value.filter(item =>
    item.Dato.startsWith(String(selectedYear.value))
  )
})

// --------------------------------------
// Chart data + arrow links
// --------------------------------------
const sortedData = computed(() => {
  return [...filteredData.value].sort(
    (a, b) => new Date(a.Dato) - new Date(b.Dato)
  )
})

const graphData = computed(() => sortedData.value.map(item => [item.Dato, Number(item.Total)]))

const links = computed(() => graphData.value.map((_, idx) => ({
  source: idx,
  target: idx + 1
})).slice(0, -1))


// --------------------------------------
// Calendar range for selected year
// --------------------------------------
const minDate = computed(() => `${selectedYear.value}-01-01`)
const maxDate = computed(() => `${selectedYear.value}-12-31`)

watch(selectedYear, () => {
  updateChart()
})

function updateChart() {
  if (!chart.value) return

  chart.value.setOption({
    tooltip: {
      position: 'top',
      formatter: params => {
        if (!params.value) return ''
        return `
          <b>${params.value[0]}</b><br>
          Total: ${params.value[1]}
        `
      }
    },

    calendar: {
      cellSize: 35,
      range: [minDate.value, maxDate.value],
      yearLabel: { show: true, color: '#bcd4ff' },

      itemStyle: {
        color: '#0a1f33',
        borderWidth: 1,
        borderColor: '#1d3557'
      },

      splitLine: {
        show: true,
        lineStyle: { color: '#28486e', width: 1 }
      },

      dayLabel: { color: '#bcd4ff' },
      monthLabel: { color: '#bcd4ff' }
    },

    series: [
      {
        type: 'graph',
        coordinateSystem: 'calendar',
        symbolSize: 12,
        edgeSymbol: ['none', 'arrow'],

        lineStyle: {
          color: '#4ec9ff',
          width: 2
        },

        itemStyle: {
          color: params => {
            const value = params.value?.[1] ?? 0
            return value > 0 ? '#4ec9ff' : '#142b44'
          },
          borderColor: '#82d4ff',
          borderWidth: 1
        },

        data: graphData.value,
        links: links.value
      }
    ]
  })
}
</script>

<template>
    <select v-model="selectedYear">
      <option
        v-for="year in [...new Set(apiData.map(i => Number(i.Dato.slice(0,4))))].sort()"
        :key="year"
        :value="year"
        
      >
        {{ year }}
      </option>
    </select>

  <div id="calendarChart" style="width:100%; height:800px;"></div>
</template>
