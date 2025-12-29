<template>
  <div class="bg-gradient-to-r from-[#002847] to-[#003d5c] rounded-2xl overflow-hidden shadow-xl">
    <!-- Header Section -->
    <div class="p-4 flex items-center justify-between border-b border-white/10">
      <div class="flex items-center gap-2">
        <h3 class="text-white text-xl font-bold">Dine tal for</h3>
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

  <!-- Custom arrow -->
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
      <!--  Balance -->
      <div class="bg-gradient-to-br from-[#175381]/40 to-[#175381]/20 rounded-lg p-4 hover:from-[#175381]/50 hover:to-[#175381]/30 transition-all duration-300 border border-white/5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-500/20">
            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-white text-xs font-medium mb-1">Afregnet saldo</h3>
            <p class="gold-text text-xl font-bold">{{ formatNumber(totalamount) }} <span class="gold-text text-sm font-normal">kr</span></p>
          </div>
        </div>
      </div>

      <!--   Registratison -->
      <div class="bg-gradient-to-br from-[#175381]/40 to-[#175381]/20 rounded-lg p-4 hover:from-[#175381]/50 hover:to-[#175381]/30 transition-all duration-300 border border-white/5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-yellow-500/20">
            <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-white text-xs font-medium mb-1">Udestående tidsregistreringer</h3>
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
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalamount: Number,
  udståendetids: Number,
  totalPotienale: Number,
  year: Number,
  availableYears: Array
})

defineEmits(['update:year'])

const formatNumber = (value) => {
  if (!value && value !== 0) return '0'
  return value.toLocaleString('da-DK')
}
</script>
