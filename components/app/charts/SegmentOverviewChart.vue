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
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  achievementPercentage: Object,
  segmentComparison: Array
})
</script>