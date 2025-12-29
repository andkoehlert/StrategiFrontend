<template>
  <div class="p-6 rounded-xl h-full flex flex-col">
    
    <div v-if="!achievementPercentage" class="text-gray-400 text-center py-8">
      Ingen sammenligningsdata tilgængelig
    </div>
    
    <div v-else class="flex-1 flex flex-col space-y-4">
      <!-- Overall Achievement -->
      <div class="bg-[#002847]/50 p-4 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <span class="text-gray-300 text-sm">Omsætning opnåelse</span>
          <span class="text-white font-bold text-lg">
            {{ achievementPercentage.revenue.toFixed(1) }}%
          </span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div 
            class="h-2 rounded-full transition-all"
            :class="achievementPercentage.revenue >= 100 ? 'bg-green-500' : 'bg-yellow-500'"
            :style="{ width: Math.min(achievementPercentage.revenue, 100) + '%' }"
          ></div>
        </div>
      </div>

      <div class="bg-[#002847]/50 p-4 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <span class="text-gray-300 text-sm">Sager opnåelse</span>
          <span class="text-white font-bold text-lg">
            {{ achievementPercentage.cases.toFixed(1) }}%
          </span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div 
            class="h-2 rounded-full transition-all"
            :class="achievementPercentage.cases >= 100 ? 'bg-green-500' : 'bg-yellow-500'"
            :style="{ width: Math.min(achievementPercentage.cases, 100) + '%' }"
          ></div>
        </div>
      </div>
  <!-- Segment Breakdown -->
      <div class="space-y-2 flex-1 overflow-auto">
        <div 
          v-for="segment in segmentComparison" 
          :key="segment.name"
          class="bg-[#002847]/30 p-3 rounded text-sm"
        >
          <div class="flex justify-between items-center mb-1">
            <span class="text-white font-medium">{{ segment.name }}</span>
            <span 
              class="font-bold"
              :class="segment.achievement >= 100 ? 'text-green-400' : 'text-yellow-400'"
            >
              {{ segment.achievement.toFixed(0) }}%
            </span>
          </div>
          <div class="flex justify-between text-xs text-gray-400">
            <span>{{ segment.actualTotal.toLocaleString() }} / {{ segment.goalTotal.toLocaleString() }} kr</span>
            <span>{{ segment.actualCount }} / {{ segment.goalCount }} sager</span>
          </div>
        </div>
      </div>

      <!--  Insights -->
      <div class="bg-gradient-to-r from-blue-900/40 to-blue-800/40 p-10 rounded-lg border border-blue-700/30">
        <div class="flex items-start space-x-3">
          <div class="text-2xl">💡</div>
          <div class="flex-1">
            <h4 class="text-white font-semibold mb-2">Indsigter</h4>
            <div class="space-y-4 text-sm text-gray-300">
              <p v-for="(insight, index) in insights" :key="index">
                {{ insight }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  achievementPercentage: Object,
  segmentComparison: Array
})

const insights = computed(() => {
  if (!props.achievementPercentage || !props.segmentComparison) return []
  
  const messages = []
  const revenue = props.achievementPercentage.revenue
  const cases = props.achievementPercentage.cases
  
  // Overall performance message
  if (revenue >= 100) {
    messages.push(`🎉 Fantastisk! Du har nået ${revenue.toFixed(0)}% af dit omsætningsmål!`)
  } else if (revenue >= 80) {
    const remaining = 100 - revenue
    messages.push(`💪 Stærk præstation med ${revenue.toFixed(0)}% opnået. Kun ${remaining.toFixed(0)}% tilbage til målet!`)
  } else if (revenue >= 60) {
    messages.push(`📈 Du er godt på vej med ${revenue.toFixed(0)}% opnået. Fokuser på dine stærkeste segmenter.`)
  } else {
    messages.push(`🎯 Der er potentiale for forbedring. Se på hvilke segmenter der kan styrkes.`)
  }
  
  // Find top performers
  const topPerformers = props.segmentComparison
    .filter(s => s.achievement >= 100)
    .sort((a, b) => b.achievement - a.achievement)
  
  if (topPerformers.length > 0) {
    const top = topPerformers[0]
    messages.push(`🌟 ${top.name} er dit stærkeste segment med ${top.achievement.toFixed(0)}% opnåelse!`)
    
    // Show multiple top performers if available
    if (topPerformers.length > 1) {
      const overPerformers = topPerformers.filter(s => s.achievement >= 120)
      if (overPerformers.length > 1) {
        messages.push(`🚀 ${overPerformers.length} segmenter har overtruffet målet med over 120%!`)
      }
    }
  }
  
  // Find segments needing attention
  const needsAttention = props.segmentComparison
    .filter(s => s.achievement < 70 && s.goalTotal > 0)
    .sort((a, b) => a.achievement - b.achievement)
  
  if (needsAttention.length > 0) {
    const weakest = needsAttention[0]
    messages.push(`⚠️ ${weakest.name} trænger til fokus med kun ${weakest.achievement.toFixed(0)}% opnået.`)
  }
  
  // Case vs revenue 
  if (Math.abs(revenue - cases) > 15) {
    if (cases > revenue) {
      messages.push(`📊 Du har flere sager end forventet - overvej at fokusere på større sager.`)
    } else {
      messages.push(`💼 Dine gennemsnitlige sagsværdier ligger over målet - flot arbejde!`)
    }
  }
  
  // Calculate total reven
  const totalGoal = props.segmentComparison.reduce((sum, s) => sum + s.goalTotal, 0)
  const totalActual = props.segmentComparison.reduce((sum, s) => sum + s.actualTotal, 0)
  const gap = totalGoal - totalActual
  
  if (gap > 0 && revenue < 100) {
    messages.push(`💰 ${Math.abs(gap).toLocaleString()} kr mangler for at nå det fulde mål.`)
  } else if (gap < 0) {
    messages.push(`💎 Du har overtruffet målet med ${Math.abs(gap).toLocaleString()} kr ekstra omsætning!`)
  }
  
  // Segment  insight
  const activeSegments = props.segmentComparison.filter(s => s.actualTotal > 0).length
  const totalSegments = props.segmentComparison.length
  if (activeSegments < totalSegments) {
    const inactive = totalSegments - activeSegments
    messages.push(`🎯 ${inactive} segment${inactive > 1 ? 'er' : ''} har ingen omsætning endnu - nye muligheder?`)
  }
  
  // Case  insight
  const avgCaseValue = totalActual / props.segmentComparison.reduce((sum, s) => sum + s.actualCount, 0)
  const goalAvgCaseValue = totalGoal / props.segmentComparison.reduce((sum, s) => sum + s.goalCount, 0)
  
  if (avgCaseValue > goalAvgCaseValue * 1.1) {
    messages.push(`📈 Gennemsnitlig sagsværdi er ${((avgCaseValue / goalAvgCaseValue - 1) * 100).toFixed(0)}% over målet!`)
  } else if (avgCaseValue < goalAvgCaseValue * 0.9) {
    messages.push(`💡 Gennemsnitlig sagsværdi er lavere end forventet - fokus på større klienter?`)
  }
  
  return messages.slice(0, 4) 
})
</script>