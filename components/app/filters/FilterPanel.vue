<template>
  <div class="flex flex-col gap-4">
    <!-- Main Header Bar -->
    <div class="flex flex-col lg:flex-row bg-[#002847] rounded-xl p-6 gap-6">
      <div class="flex flex-col lg:flex-row items-start lg:items-center gap-6 flex-1">
        <div class="text-white">
          <div class="text-2xl font-semibold leading-tight">
            DIN kalender
          </div>
          <div class="text-lg text-white/70">{{ filters.year }}</div>
        </div>

        <span class="hidden lg:block h-12 border-r border-white/30"></span>

        <!-- Data Type & Year -->
        <div class="flex gap-3">
         <div class="relative">
  <select 
    v-model="filters.dataType"
    @change="emitFilters"
    class="appearance-none bg-gradient-to-r from-[#175381]/40 to-[#175381]/20 
           text-white font-bold px-4 py-2 pr-10 rounded-lg border border-white/20 
           cursor-pointer backdrop-blur transition-all duration-300 
           hover:border-white/40 hover:from-[#175381]/60 hover:to-[#175381]/40 
           focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
  >
    <option class="bg-[#002847] text-white" value="settledAmount">Afregnet beløb</option>
    <option class="bg-[#002847] text-white" value="caseValue">Sagsværdi</option>
    <option class="bg-[#002847] text-white" value="casesSettled">Antal sager</option>
  </select>

  <!-- Custom arrow -->
  <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 z-10">
    <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>

<div class="relative">
          <select 
            v-model="filters.year"
            @change="emitFilters"
           class="appearance-none bg-gradient-to-r from-[#175381]/40 to-[#175381]/20 text-white font-bold px-4 py-2 pr-10 rounded-lg border border-white/20 cursor-pointer backdrop-blur transition-all duration-300 hover:border-white/40 hover:from-[#175381]/60 hover:to-[#175381]/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
          >
            <option v-for="year in availableYears" :key="year" :value="year"            
               class="bg-[#002847] text-white"
>
              {{ year }}
            </option>
          </select>
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
            </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 lg:gap-6 flex-wrap lg:flex-nowrap">
        <span class="hidden lg:block h-10 border-r border-white/30"></span>

        <!-- Time Filter  -->
        <div class="flex items-center gap-3">
          <label class="flex items-center cursor-pointer group">
            <input
              type="radio"
              name="timeFilter"
              value="month"
              :checked="timeFilter === 'month'"
              @change="handleTimeFilter"
              class="hidden peer"
            />
            <span class="px-4 py-2 rounded-full border border-white/30 bg-white/10 
                         group-hover:bg-white/20 transition text-sm text-white whitespace-nowrap
                         peer-checked:bg-white peer-checked:text-[#002847] peer-checked:font-semibold">
              Vis måneder
            </span>
          </label>

          <label class="flex items-center cursor-pointer group">
            <input
              type="radio"
              name="timeFilter"
              value="today"
              :checked="timeFilter === 'today'"
              @change="handleTimeFilter"
              class="hidden peer"
            />
            <span class="px-4 py-2 rounded-full border border-white/30 bg-white/10 
                         group-hover:bg-white/20 transition text-sm text-white whitespace-nowrap
                         peer-checked:bg-white peer-checked:text-[#002847] peer-checked:font-semibold">
              Vis idag
            </span>
          </label>

          <label class="flex items-center cursor-pointer group">
            <input
              type="radio"
              name="timeFilter"
              value="past"
              :checked="timeFilter === 'past'"
              @change="handleTimeFilter"
              class="hidden peer"
            />
          
          </label>
        </div>

        <span class="hidden lg:block h-10 border-r border-white/30"></span>

        <!-- Filters -->
        <button
          @click="showAdvanced = !showAdvanced"
          class="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 
                 rounded-full border border-white/30 transition text-sm whitespace-nowrap font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
          Filtre
          <span 
            v-if="activeFilterCount > 0"
            class="bg-[#cfae76] text-[#002847] px-2 py-0.5 rounded-full text-xs font-bold"
          >
            {{ activeFilterCount }}
          </span>
        </button>
      </div>
    </div>

    <!--   Filters Panel -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="showAdvanced" class="bg-[#002847] rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white font-semibold text-lg">Filtrer dine data</h3>
          <button
            v-if="hasActiveFilters"
            @click="clearAllFilters"
            class="text-red-400 hover:text-red-300 text-sm font-semibold flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Ryd alle
          </button>
        </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- Status Filter -->
  <div class="relative">
    <label class="block text-white text-sm font-semibold mb-2">
      Sager efter status
    </label>
    <select 
      v-model="filters.status"
      @change="emitFilters"
      class="w-full appearance-none bg-gradient-to-r from-[#175381]/40 to-[#175381]/20 text-white px-4 py-2 rounded-lg border border-white/20 
             focus:outline-none focus:ring-2 focus:ring-yellow-400/60 cursor-pointer transition-all duration-300"
    >
      <option class="bg-[#002847] text-white" value="">Alle</option>
      <option class="bg-[#002847] text-white" value="aktiv">Aktiv</option>
      <option class="bg-[#002847] text-white" value="under-behandling">Under behandling</option>
      <option class="bg-[#002847] text-white" value="venter-modpart">Venter på modpart</option>
      <option class="bg-[#002847] text-white" value="venter-klient">Venter på klient</option>
      <option class="bg-[#002847] text-white" value="afsluttes-snart">Afsluttes snart</option>
    </select>
    <!-- Gold arrow centered -->
    <div class="pointer-events-none absolute right-3 bottom-6 inset-y-0 flex items-center z-10">
      <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>

  <div class="relative">
    <label class="block text-white text-sm font-semibold mb-2">Arbejdsarter</label>
    <select 
      v-model="filters.workType"
      @change="emitFilters"
      class="w-full appearance-none bg-gradient-to-r from-[#175381]/40 to-[#175381]/20 text-white px-4 py-2 rounded-lg border border-white/20 
             focus:outline-none focus:ring-2 focus:ring-yellow-400/60 cursor-pointer transition-all duration-300"
    >
      <option class="bg-[#002847] text-white" value="">Alle</option>
      <option class="bg-[#002847] text-white" value="klientmøder">Klientmøder</option>
      <option class="bg-[#002847] text-white" value="retsmøder">Retsmøder</option>
      <option class="bg-[#002847] text-white" value="interne-møder">Interne møder</option>
      <option class="bg-[#002847] text-white" value="forberedelsesmøder">Forberedelsesmøder</option>
    </select>
    <div class="pointer-events-none absolute right-3 bottom-6 inset-y-0 flex items-center z-10">
      <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>

  <div class="relative">
    <label class="block text-white text-sm font-semibold mb-2">Sager saldo</label>
    <select 
      v-model="filters.balance"
      @change="emitFilters"
      class="w-full appearance-none bg-gradient-to-r from-[#175381]/40 to-[#175381]/20 text-white px-4 py-2 rounded-lg border border-white/20 
             focus:outline-none focus:ring-2 focus:ring-yellow-400/60 cursor-pointer transition-all duration-300"
    >
      <option class="bg-[#002847] text-white" value="">Alle</option>
      <option class="bg-[#002847] text-white" value="high">&gt; 500.000 kr</option>
      <option class="bg-[#002847] text-white" value="medium">100.000-500.000 kr</option>
      <option class="bg-[#002847] text-white" value="low">&lt; 100.000 kr</option>
    </select>
    <div class="pointer-events-none absolute right-3 bottom-6 inset-y-0 flex items-center z-10">
      <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>

  <div class="relative">
    <label class="block text-white text-sm font-semibold mb-2">Branche</label>
    <select 
      v-model="filters.industry"
      @change="emitFilters"
      class="w-full appearance-none bg-gradient-to-r from-[#175381]/40 to-[#175381]/20 text-white px-4 py-2 rounded-lg border border-white/20 
             focus:outline-none focus:ring-2 focus:ring-yellow-400/60 cursor-pointer transition-all duration-300"
    >
      <option class="bg-[#002847] text-white" value="">Alle</option>
      <option class="bg-[#002847] text-white" value="almene-boligsaelskaber">Almene boligsælskaber</option>
      <option class="bg-[#002847] text-white" value="offentlige-myndigheder">Offentlige myndigheder</option>
      <option class="bg-[#002847] text-white" value="private-ejendomsudviklere">Private ejendomsudviklere</option>
      <option class="bg-[#002847] text-white" value="private-ejendomsinvestorer">Private ejendomsinvestorer</option>
      <option class="bg-[#002847] text-white" value="kapital-fonde">Kapital fonde</option>
      <option class="bg-[#002847] text-white" value="pensionskasser">Pensionskasser</option>
      <option class="bg-[#002847] text-white" value="asset-managers">Asset managers</option>
    </select>
    <div class="pointer-events-none absolute right-3 bottom-6 inset-y-0 flex items-center z-10">
      <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>



        <!-- Active Filters Tags -->
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 items-center pt-4 border-t border-white/10">
          <span class="text-white/70 text-sm font-semibold">Aktive filtre:</span>
          
          <button
            v-if="filters.status"
            @click="clearFilter('status')"
            class="px-3 py-1 bg-[#cfae76] text-[#002847] rounded-full text-sm font-semibold 
                   flex items-center gap-2 hover:bg-[#e0414c] transition"
          >
            Status: {{ getStatusLabel(filters.status) }}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <button
            v-if="filters.workType"
            @click="clearFilter('workType')"
            class="px-3 py-1 bg-[#cfae76] text-[#002847] rounded-full text-sm font-semibold 
                   flex items-center gap-2 hover:bg-[#e0414c] transition"
          >
            Arbejdsart: {{ getWorkTypeLabel(filters.workType) }}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <button
            v-if="filters.balance"
            @click="clearFilter('balance')"
            class="px-3 py-1 bg-[#cfae76] text-[#002847] rounded-full text-sm font-semibold 
                   flex items-center gap-2 hover:bg-[#e0414c] transition"
          >
            Saldo: {{ getBalanceLabel(filters.balance) }}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <button
            v-if="filters.industry"
            @click="clearFilter('industry')"
            class="px-3 py-1 bg-[#cfae76] text-[#002847] rounded-full text-sm font-semibold 
                   flex items-center gap-2 hover:bg-[#e0414c] transition"
          >
            Branche: {{ getIndustryLabel(filters.industry) }}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type {Filters} from '../../../interfaces/filters'

 interface Props {
  availableYears?: number[]
  defaultYear?: number
}

const props = withDefaults(defineProps<Props>(), {
  availableYears: () => [2024],
  defaultYear: 2024
})

const emit = defineEmits<{
  filter: [value: string]
  Nyfilter: [filters: Filters]
}>()

const timeFilter = ref<string>('month')
const showAdvanced = ref<boolean>(false)

const filters = ref<Filters>({
  dataType: 'settledAmount',
  year: props.defaultYear,
  status: '',
  workType: '',
  balance: '',
  industry: ''
})

// Watch for defaultYear changes
watch(() => props.defaultYear, (newYear) => {
  filters.value.year = newYear
})

const hasActiveFilters = computed(() => {
  return filters.value.status !== '' || 
         filters.value.workType !== '' || 
         filters.value.balance !== '' || 
         filters.value.industry !== ''
})

const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.status) count++
  if (filters.value.workType) count++
  if (filters.value.balance) count++
  if (filters.value.industry) count++
  return count
})

const handleTimeFilter = (e: Event) => {
  const target = e.target as HTMLInputElement
  timeFilter.value = target.value
  emit('filter', target.value)
}

const emitFilters = () => {
  emit('Nyfilter', { ...filters.value })
}

const clearFilter = (key: keyof Filters) => {
  if (key === 'dataType' || key === 'year') return 
  filters.value[key] = ''
  emitFilters()
}

const clearAllFilters = () => {
  filters.value = {
    dataType: filters.value.dataType, 
    year: filters.value.year, 
    status: '',
    workType: '',
    balance: '',
    industry: ''
  }
  emitFilters()
}

// Label helpers
const getStatusLabel = (value: string): string => {
  const labels: Record<string, string> = {
    'aktiv': 'Aktiv',
    'under-behandling': 'Under behandling',
    'venter-modpart': 'Venter på modpart',
    'venter-klient': 'Venter på klient',
    'afsluttes-snart': 'Afsluttes snart'
  }
  return labels[value] || value
}

const getWorkTypeLabel = (value: string): string => {
  const labels: Record<string, string> = {
    'klientmøder': 'Klientmøder',
    'retsmøder': 'Retsmøder',
    'interne-møder': 'Interne møder',
    'forberedelsesmøder': 'Forberedelsesmøder'
  }
  return labels[value] || value
}

const getBalanceLabel = (value: string): string => {
  const labels: Record<string, string> = {
    'high': '> 500.000 kr',
    'medium': '100.000-500.000 kr',
    'low': '< 100.000 kr'
  }
  return labels[value] || value
}

const getIndustryLabel = (value: string): string => {
  const labels: Record<string, string> = {
    'almene-boligsaelskaber': 'Almene boligsælskaber',
    'offentlige-myndigheder': 'Offentlige myndigheder',
    'private-ejendomsudviklere': 'Private ejendomsudviklere',
    'private-ejendomsinvestorer': 'Private ejendomsinvestorer',
    'kapital-fonde': 'Kapital fonde',
    'pensionskasser': 'Pensionskasser',
    'asset-managers': 'Asset managers'
  }
  return labels[value] || value
}
</script>

<style scoped>
.custom-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.bottom-6 {
      bottom: calc(var(--spacing) * -6);
}
</style>