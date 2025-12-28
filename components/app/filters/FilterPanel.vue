<template>
  <div class="flex flex-col gap-4">
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
          <select 
            v-model="filters.dataType"
            @change="emitFilters"
            class="bg-[#0d3a5c] text-white px-4 py-2 rounded-lg border border-white/20 
                   focus:outline-none focus:border-[#91cc75] cursor-pointer text-sm custom-select"
          >
            <option value="settledAmount">Afregnet beløb</option>
            <option value="caseValue">Sagsværdi</option>
            <option value="casesSettled">Antal sager</option>
          </select>

          <select 
            v-model="filters.year"
            @change="emitFilters"
            class="bg-[#0d3a5c] text-white px-4 py-2 rounded-lg border border-white/20 
                   focus:outline-none focus:border-[#91cc75] cursor-pointer text-sm custom-select"
          >
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>

      <!-- Right: Time Filter Buttons -->
      <div class="flex items-center gap-4 lg:gap-6">
        <span class="hidden lg:block h-10 border-r border-white/30"></span>

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
          <span class="px-4 py-2 rounded-full border border-white/30 bg-white/10 
                       group-hover:bg-white/20 transition text-sm text-white whitespace-nowrap
                       peer-checked:bg-white peer-checked:text-[#002847] peer-checked:font-semibold">
            Tidligere afregninger
          </span>
        </label>
      </div>
    </div>

    <!-- Advanced Filters Toggle Button -->
    <button
      @click="showAdvanced = !showAdvanced"
      class="flex items-center justify-center gap-2 bg-[#002847] text-white px-6 py-3 
             rounded-xl hover:bg-[#003a5c] transition group"
    >
  
      <span class="font-semibold">Filtre din søgning</span>
      <span 
        v-if="activeFilterCount > 0"
        class="bg-[#91cc75] text-[#002847] px-2 py-0.5 rounded-full text-xs font-bold"
      >
        {{ activeFilterCount }}
      </span>
      <svg v-if="showAdvanced" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <!-- Expandable Filters -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
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
          <div>
            <label class="block text-white text-sm font-semibold mb-2">
              Sager efter status
            </label>
            <select 
              v-model="filters.status"
              @change="emitFilters"
              class="w-full bg-[#0d3a5c] text-white px-4 py-2 rounded-lg border border-white/20 
                     focus:outline-none focus:border-[#91cc75] cursor-pointer custom-select"
            >
              <option value="">Alle</option>
              <option value="aktiv">Aktiv</option>
              <option value="under-behandling">Under behandling</option>
              <option value="venter-modpart">Venter på modpart</option>
              <option value="venter-klient">Venter på klient</option>
              <option value="afsluttes-snart">Afsluttes snart</option>
            </select>
          </div>

          <!-- Work Type Filter -->
          <div>
            <label class="block text-white text-sm font-semibold mb-2">
              Arbejdsarter
            </label>
            <select 
              v-model="filters.workType"
              @change="emitFilters"
              class="w-full bg-[#0d3a5c] text-white px-4 py-2 rounded-lg border border-white/20 
                     focus:outline-none focus:border-[#91cc75] cursor-pointer custom-select"
            >
              <option value="">Alle</option>
              <option value="klientmøder">Klientmøder</option>
              <option value="retsmøder">Retsmøder</option>
              <option value="interne-møder">Interne møder</option>
              <option value="forberedelsesmøder">Forberedelsesmøder</option>
            </select>
          </div>

          <!-- Balance Filter -->
          <div>
            <label class="block text-white text-sm font-semibold mb-2">
              Sager saldo
            </label>
            <select 
              v-model="filters.balance"
              @change="emitFilters"
              class="w-full bg-[#0d3a5c] text-white px-4 py-2 rounded-lg border border-white/20 
                     focus:outline-none focus:border-[#91cc75] cursor-pointer custom-select"
            >
              <option value="">Alle</option>
              <option value="high">&gt; 500.000 kr</option>
              <option value="medium">100.000-500.000 kr</option>
              <option value="low">&lt; 100.000 kr</option>
            </select>
          </div>

          <!-- Industry Filter -->
          <div>
            <label class="block text-white text-sm font-semibold mb-2">
              Branche
            </label>
            <select 
              v-model="filters.industry"
              @change="emitFilters"
              class="w-full bg-[#0d3a5c] text-white px-4 py-2 rounded-lg border border-white/20 
                     focus:outline-none focus:border-[#91cc75] cursor-pointer custom-select"
            >
              <option value="">Alle</option>
              <option value="almene-boligsaelskaber">Almene boligsælskaber</option>
              <option value="offentlige-myndigheder">Offentlige myndigheder</option>
              <option value="private-ejendomsudviklere">Private ejendomsudviklere</option>
              <option value="private-ejendomsinvestorer">Private ejendomsinvestorer</option>
              <option value="kapital-fonde">Kapital fonde</option>
              <option value="pensionskasser">Pensionskasser</option>
              <option value="asset-managers">Asset managers</option>
            </select>
          </div>
        </div>

        <!-- Active Filters Tags -->
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 items-center pt-4 border-t border-white/10">
          <span class="text-white/70 text-sm font-semibold">Aktive filtre:</span>
          
          <button
            v-if="filters.status"
            @click="clearFilter('status')"
            class="px-3 py-1 bg-[#91cc75] text-[#002847] rounded-full text-sm font-semibold 
                   flex items-center gap-2 hover:bg-[#7ab85f] transition"
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
            class="px-3 py-1 bg-[#91cc75] text-[#002847] rounded-full text-sm font-semibold 
                   flex items-center gap-2 hover:bg-[#7ab85f] transition"
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
            class="px-3 py-1 bg-[#91cc75] text-[#002847] rounded-full text-sm font-semibold 
                   flex items-center gap-2 hover:bg-[#7ab85f] transition"
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
            class="px-3 py-1 bg-[#91cc75] text-[#002847] rounded-full text-sm font-semibold 
                   flex items-center gap-2 hover:bg-[#7ab85f] transition"
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

interface Filters {
  dataType: string
  year: number
  status: string
  workType: string
  balance: string
  industry: string
}

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
  console.log('Time filter changed to:', target.value)
  emit('filter', target.value)
}

const emitFilters = () => {
  console.log('Emitting advanced filters:', filters.value)
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
</style>