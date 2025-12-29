<template>
  <div class="w-full h-full min-h-[420px]">
    <!-- Toggle -->
    <div class="flex justify-center mb-4 gap-2">
      <button
        class="px-4 py-1.5 rounded text-sm transition"
        :class="mode === 'month' ? activeBtn : inactiveBtn"
        @click="mode = 'month'"
      >
        Monthly
      </button>

      <button
        class="px-4 py-1.5 rounded text-sm transition"
        :class="mode === 'quarter' ? activeBtn : inactiveBtn"
        @click="mode = 'quarter'"
      >
        Quarterly
      </button>
    </div>

    <!-- Chart -->
    <div class="w-full h-[380px]">
      <div v-if="!yearData" class="flex items-center justify-center h-[450px] text-gray-400">
      Ingen data tilgængelig {{ year }}
    </div>
    <ECharts
  v-if="chartOption"
  :key="mode"
  :option="chartOption"
  width="100%"
  height="100%"
/>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ECharts from '~/components/app/charts/ECharts.vue'
import type { ProcessedMonthlyData } from '~/interfaces/monthly'
import type { ProcessedYearData } from '~/interfaces/quarterly'

/* ----------------------------------
   Props
---------------------------------- */
interface Props {
  monthlyData: ProcessedMonthlyData | null
  yearData: ProcessedYearData | null
  year: number
}

const props = defineProps<Props>()

/* ----------------------------------
   Toggle state
---------------------------------- */
const mode = ref<'month' | 'quarter'>('month')

/* ----------------------------------
   Button styles
---------------------------------- */
const activeBtn =
  'bg-[#f0cb8b] text-black font-semibold shadow'
const inactiveBtn =
  'bg-[#175381] text-white opacity-70 hover:opacity-100'

/* ----------------------------------
   MONTHLY (Bar chart)
---------------------------------- */
const monthlyOption = computed(() => {
  if (!props.monthlyData?.months?.length) return null

  const months = props.monthlyData.months.map(m => m.month)
  const afregnet = props.monthlyData.months.map(m => m.afregnet)
  const ditMaal = props.monthlyData.months.map(m => m.ditMaal)

  return {
    backgroundColor: 'transparent',
    animationDuration: 600,

    title: {
      text: `Monthly – ${props.year}`,
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
      }
    },

    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(13, 58, 92, 0.95)',
      borderColor: '#91cc75',
      borderWidth: 1,
      textStyle: { color: '#fff' }
    },

    legend: {
      data: ['Afregnet', 'Dit Mål'],
      top: 40,
      textStyle: { color: '#fff' }
    },

    grid: {
      top: 90,
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },

    xAxis: {
      type: 'category',
      data: months,
      axisLabel: { color: '#fff' },
      axisLine: { lineStyle: { color: '#fff' } }
    },

    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
        formatter: (v: number) =>
          v >= 1000 ? `${v / 1000}k` : v.toLocaleString('da-DK')
      },
      splitLine: {
        lineStyle: { color: 'rgba(255,255,255,0.1)' }
      }
    },

    series: [
      {
        name: 'Afregnet',
        type: 'bar',
        data: afregnet,
        barWidth: '40%',
        itemStyle: {
          color: '#f0cb8b',
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: 'Dit Mål',
        type: 'bar',
        data: ditMaal,
        barWidth: '40%',
        itemStyle: {
          color: '#cfae76',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
  }
})

/* ----------------------------------
   QUARTERLY (Pie chart)
---------------------------------- */
const quarterlyOption = computed(() => {
  if (!props.yearData?.quarterly) return null

  const { quarterly, totals } = props.yearData

  const percent = (v: number) =>
    totals.combined ? Math.round((v / totals.combined) * 100) : 0

  return {
    backgroundColor: 'transparent',
    animationDuration: 600,

    title: {
      text: `Quarterly – ${props.year}`,
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
      }
    },

    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(13, 58, 92, 0.95)',
      borderColor: '#91cc75',
      borderWidth: 1,
      textStyle: { color: '#fff' },
      formatter: (params: any) => {
        const q = quarterly[params.name as keyof typeof quarterly]
        if (!q) return ''

        let months = '<br/><br/><strong>Months:</strong><br/>'
        Object.entries(q.months).forEach(([m, v]) => {
          months += `${m}: ${v.toLocaleString('da-DK')} DKK<br/>`
        })

        return `
          <strong>${params.name}</strong><br/>
          Total: ${params.value.toLocaleString('da-DK')} DKK<br/>
          Percentage: ${params.data.percentage}%${months}
        `
      }
    },

    legend: {
      bottom: 10,
      textStyle: { color: '#fff' }
    },

    color: ['#f0cb8b', '#e2ae60', '#d9a253', '#cfae76'],

    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '55%'],
        data: [
          { name: 'Q1', value: quarterly.Q1.total, percentage: percent(quarterly.Q1.total) },
          { name: 'Q2', value: quarterly.Q2.total, percentage: percent(quarterly.Q2.total) },
          { name: 'Q3', value: quarterly.Q3.total, percentage: percent(quarterly.Q3.total) },
          { name: 'Q4', value: quarterly.Q4.total, percentage: percent(quarterly.Q4.total) }
        ],
        label: {
          color: '#fff',
          formatter: '{b}\n{d}%'
        },
        itemStyle: {
          borderColor: '#175381',
          borderWidth: 2
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 12,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        }
      }
    ]
  }
})

/* ----------------------------------
   ACTIVE OPTION
---------------------------------- */
const chartOption = computed(() =>
  mode.value === 'month'
    ? monthlyOption.value
    : quarterlyOption.value
)
</script>
