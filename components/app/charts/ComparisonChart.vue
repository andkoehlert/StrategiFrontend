<template>
  <div class="bg-gradient-to-b from-[#175381] to-[#175381]/30 p-6 rounded-xl">
    <ECharts :option="chartOption" width="100%" height="550px" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ECharts from '~/components/app/charts/ECharts.vue'

const props = defineProps({
  goalsData: Object,
  actualData: Object
})

const chartOption = ref({})

const updateChart = () => {
  if (!props.goalsData || !props.actualData) return
  
  chartOption.value = {
    title: {
      text: 'Goals vs Actual Performance 2024',
      subtext: `Goals: ${props.goalsData.totals.grandTotal.toLocaleString()} DKK | Actual: ${props.actualData.totals.grandTotal.toLocaleString()} DKK (${Math.round((props.actualData.totals.grandTotal / props.goalsData.totals.grandTotal) * 100)}%)`,
      textStyle: { color: '#fff', fontSize: 18 },
      subtextStyle: { color: '#91cc75', fontSize: 14, lineHeight: 22 },
      padding: [10, 0, 20, 0],
      itemGap: 15
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

          optionToContent: function(opt) {
            const axisData = opt.xAxis[0].data
            const goals = opt.series[0].data
            const actual = opt.series[1].data

            let html = `
              <div style="
                padding: 20px;
                color: #e2e8f0;
                font-family: system-ui, sans-serif;
                background: #0f2f4a;
                border-radius: 12px;
              ">
                <h3 style="margin-bottom: 15px; font-size: 18px; font-weight: 600;">
                  Data Table – Goals vs Actual
                </h3>

                <table style="
                  width: 100%;
                  border-collapse: collapse;
                  font-size: 14px;
                  border-radius: 10px;
                  overflow: hidden;
                ">
                  <thead>
                    <tr style="background: #15476b; color: white;">
                      <th style="padding: 10px; border-bottom: 1px solid #1e557d; text-align: left;">Segment</th>
                      <th style="padding: 10px; border-bottom: 1px solid #1e557d; text-align: right;">Goals (DKK)</th>
                      <th style="padding: 10px; border-bottom: 1px solid #1e557d; text-align: right;">Actual (DKK)</th>
                      <th style="padding: 10px; border-bottom: 1px solid #1e557d; text-align: right;">Achievement</th>
                    </tr>
                  </thead>
                  <tbody>
            `

            axisData.forEach((name, i) => {
              const g = goals[i]
              const a = actual[i]
              const pct = Math.round((a / g) * 100)

              html += `
                <tr style="background: ${i % 2 ? '#11344f' : '#0d2a3f'};">
                  <td style="padding: 10px; border-bottom: 1px solid #143d5b;">${name}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #143d5b; text-align: right;">${g.toLocaleString()}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #143d5b; text-align: right;">${a.toLocaleString()}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #143d5b; text-align: right;">${pct}%</td>
                </tr>
              `
            })

            html += `
                  </tbody>
                </table>
              </div>
            `

            return html
          }
        },

        restore: { title: 'Restore' }
      },
      iconStyle: {
        borderColor: '#fff'
      }
    },

    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        let result = params[0].axisValue + '<br/>'
        params.forEach(item => {
          result += `${item.marker} ${item.seriesName}: ${item.value.toLocaleString()} DKK<br/>`
        })
        if (params.length === 2) {
          const percentage = Math.round((params[1].value / params[0].value) * 100)
          result += `<strong>Achievement: ${percentage}%</strong>`
        }
        return result
      }
    },

    legend: {
      data: ['Goals', 'Actual'],
      textStyle: { color: '#fff', fontSize: 12 },
      top: 80,
      itemGap: 20
    },

    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: 140,
      containLabel: true
    },

    xAxis: {
      type: 'category',
      data: props.goalsData.segments.map(s => s.name),
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
        formatter: '{value}',
        margin: 10
      },
      axisLine: { lineStyle: { color: '#fff' } },
      splitLine: { lineStyle: { color: '#004274' } }
    },

    series: [
      {
        name: 'Goals',
        type: 'bar',
        data: props.goalsData.segments.map(s => s.total),
        itemStyle: { color: '#5470c6' },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          formatter: '{c}',
          distance: 10
        }
      },
      {
        name: 'Actual',
        type: 'bar',
        data: props.actualData.segments.map(s => s.total),
        itemStyle: { color: '#91cc75' },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          formatter: '{c}',
          distance: 10
        }
      }
    ]
  }
}

watch(() => [props.goalsData, props.actualData], updateChart, { deep: true, immediate: true })
</script>

<style scoped>
/* ---- ECharts DataView Dark Mode ---- */
.echarts-dataview {
  background: #0f2f4a !important;
  color: #e2e8f0 !important;
  border-radius: 12px !important;
  padding: 0 !important;
}

.echarts-dataview .textarea-wrapper {
  background: #0f2f4a !important;
  color: #e2e8f0 !important;
}

.echarts-popup-container {
  background: #0f2f4a !important;
}

.echarts-dataview .btn {
  background: #15476b !important;
  color: white !important;
  border: none !important;
  border-radius: 6px !important;
  padding: 6px 14px !important;
}

.echarts-dataview .btn:hover {
  background: #1e5f8f !important;
}

</style>
