<template>
  <div class="flex p-10 text-white flex-row bg-[#002847] rounded-xl justify-between">
    <div>
      <h2 class="mb-2">DINE TAL</h2>
         <div class="relative inline-block">
        <select 
          :value="year" 
          @change="$emit('update:year', Number($event.target.value))"
          class="appearance-none bg-gradient-to-r from-[#cfae76] to-[#f0cb8b] text-white px-6 py-3 pr-10 rounded-lg font-bold cursor-pointer hover:from-[#145d9c] hover:to-[#145d9c] transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:scale-105 border-2 border-white/20"
        >
          <option class="text-black" v-for="yearOption in availableYears" :key="yearOption" :value="yearOption">
            {{ yearOption }}
          </option>
        </select>
        <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <span class="border-right"></span>

    <div>
      <h2>
        AFREGNET SALDO <br/>
        <span class="gold-text">{{ totalamount }} kr</span>
      </h2>
    </div>

    <span class="border-right"></span>

    <div>
      <h2>
        UDSTÅENDE TIDSREGISTREING <br/>
        <span class="gold-text">{{ udståendetids }} kr</span>
      </h2>
    </div>

    <span class="border-right"></span>

    <div>
      <h2>
        TOTAL POTIENALE <br/>
        <span class="gold-text">{{ totalPotienale }} kr</span>
      </h2>
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
</script>

<style scoped>
.border-right {
  border-right: 1px solid #7d7d7d;
}
</style>