<template>
  <div class="bg-gradient-to-r from-[#002847] to-[#003d5c] rounded-2xl overflow-hidden shadow-xl">
    <!-- Header Section -->
<div class="pl-5 pt-3  flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h3 class="text-white text-xl font-bold">Dine mål for</h3>
      <div class="relative">
  <select
    :value="year"
    @change="$emit('update:year', Number($event.target.value))"
    class="
      appearance-none
      bg-gradient-to-r from-[#175381]/40 to-[#175381]/20
      text-white font-bold
      px-4 py-2 pr-10
      rounded-lg
      border border-white/20
      cursor-pointer
      backdrop-blur
      transition-all duration-300
      hover:border-white/40
      hover:from-[#175381]/60 hover:to-[#175381]/40
      focus:outline-none
      focus:ring-2 focus:ring-yellow-400/60
    "
  >
    <option
      v-for="yearOption in availableYears"
      :key="yearOption"
      :value="yearOption"
      class="bg-[#002847] text-white"
    >
      {{ yearOption }}
    </option>
  </select>

  <!--  arrow -->
  <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
    <svg
      class="w-4 h-4 text-yellow-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.5"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </div>
</div>

      </div>
    </div>

    <!--  Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 p-5">
      <!-- Total Goals -->
      <div class="bg-gradient-to-br from-[#175381]/40 to-[#175381]/20 rounded-lg p-4 hover:from-[#175381]/50 hover:to-[#175381]/30 transition-all duration-300 border border-white/5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-purple-500/20">
            <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-white text-xs font-medium mb-1">Total mål</h3>
            <p class="gold-text text-xl font-bold">{{ formatNumber(totalGoals) }} <span class="gold-text text-sm font-normal">kr</span></p>
          </div>
        </div>
      </div>

      <!--  Balance -->
      <div class="bg-gradient-to-br from-[#175381]/40 to-[#175381]/20 rounded-lg p-4 hover:from-[#175381]/50 hover:to-[#175381]/30 transition-all duration-300 border border-white/5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-500/20">
            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-white text-xs font-medium mb-1">Afregnet saldo</h3>
            <p class="gold-text text-xl font-bold">{{ formatNumber(totalamount) }} <span class="gold-text text-sm font-normal">kr</span></p>
          </div>
        </div>
      </div>

      <!--   Registration -->
      <div class="bg-gradient-to-br from-[#175381]/40 to-[#175381]/20 rounded-lg p-4 hover:from-[#175381]/50 hover:to-[#175381]/30 transition-all duration-300 border border-white/5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-yellow-500/20">
            <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-white text-xs font-medium mb-1">Udestående timer</h3>
            <p class="gold-text text-xl font-bold">{{ formatNumber(udståendetids) }} <span class="gold-text text-sm font-normal">kr</span></p>
          </div>
        </div>
      </div>

      <!-- Total Potential -->
      <div class="bg-gradient-to-br from-[#175381]/40 to-[#175381]/20 rounded-lg p-4 hover:from-[#175381]/50 hover:to-[#175381]/30 transition-all duration-300 border border-white/5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-500/20">
            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-white text-xs font-medium mb-1">Total potentiale</h3>
            <p class="gold-text text-xl font-bold">{{ formatNumber(totalPotienale) }} <span class="gold-text text-sm font-normal">kr</span></p>
          </div>
        </div>
      </div>

      <!--  Rate -->
      <div class="bg-gradient-to-br from-[#175381]/40 to-[#175381]/20 rounded-lg p-4 hover:from-[#175381]/50 hover:to-[#175381]/30 transition-all duration-300 border border-white/5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="achievementRateColor">
            <svg class="w-5 h-5" :class="achievementRateIconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-white text-xs font-medium mb-1">Målopfyldelse</h3>
    <div class="flex items-center gap-2">
  <p class="gold-text text-xl font-bold">
    {{ achievementRate }}%
  </p>
  <p
    class="text-xs font-medium"
    :class="achievementRateTextColor"
  >
    {{ achievementRateLabel }}
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
  totalamount: Number,
  udståendetids: Number,
  totalPotienale: Number,
  totalGoals: Number,
  year: Number,
  availableYears: Array
})

defineEmits(['update:year'])

const formatNumber = (value) => {
  if (!value && value !== 0) return '0'
  return value.toLocaleString('da-DK')
}

const achievementRate = computed(() => {
  if (!props.totalGoals || props.totalGoals === 0) return 0
  return Math.round((props.totalamount / props.totalGoals) * 100)
})

const achievementRateColor = computed(() => {
  const rate = achievementRate.value
  if (rate >= 100) return 'bg-green-500/20'
  if (rate >= 75) return 'bg-yellow-500/20'
  return 'bg-red-500/20'
})

const achievementRateIconColor = computed(() => {
  const rate = achievementRate.value
  if (rate >= 100) return 'text-green-400'
  if (rate >= 75) return 'text-yellow-400'
  return 'text-red-400'
})

const achievementRateTextColor = computed(() => {
  const rate = achievementRate.value
  if (rate >= 100) return 'text-green-400'
  if (rate >= 75) return 'text-yellow-400'
  return 'text-red-400'
})

// motivating text
const achievementRateLabel = computed(() => {
  const rate = achievementRate.value
  if (rate >= 100) return 'Mål opnået! 🎉'
  if (rate >= 75) return 'På rette vej'
  return 'Under forventet'
})
</script>
