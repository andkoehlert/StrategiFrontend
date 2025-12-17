<template>
  <div class="flex flex-col gap-6">
    <!-- Time Filter Row -->
    <div class="flex p-10 text-white flex-row bg-[#002847] rounded-xl justify-between items-center gap-6">
      <div class="text-2xl font-semibold leading-tight">
        DIN kalender <br/> {{ filters.year }}
      </div>

      <div class="flex items-center gap-6">
        <span class="h-10 border-r border-white/30"></span>

        <label class="flex items-center cursor-pointer group">
          <input
            type="radio"
            name="timeFilter"
            value="month"
            :checked="timeFilter === 'month'"
            @change="handleTimeFilter"
            class="hidden peer"
          />
          <span
            class="px-4 py-2 rounded-full border border-white/30 bg-white/10 
                   group-hover:bg-white/20 transition
                   peer-checked:bg-white peer-checked:text-[#002847] peer-checked:font-semibold"
          >
            Vis måneder
          </span>
        </label>

        <span class="h-6 border-r border-white/30"></span>

        <label class="flex items-center cursor-pointer group">
          <input
            type="radio"
            name="timeFilter"
            value="today"
            :checked="timeFilter === 'today'"
            @change="handleTimeFilter"
            class="hidden peer"
          />
          <span
            class="px-4 py-2 rounded-full border border-white/30 bg-white/10 
                   group-hover:bg-white/20 transition
                   peer-checked:bg-white peer-checked:text-[#002847] peer-checked:font-semibold"
          >
            Vis idag
          </span>
        </label>

        <span class="h-6 border-r border-white/30"></span>

        <label class="flex items-center cursor-pointer group">
          <input
            type="radio"
            name="timeFilter"
            value="past"
            :checked="timeFilter === 'past'"
            @change="handleTimeFilter"
            class="hidden peer"
          />
          <span
            class="px-4 py-2 rounded-full border border-white/30 bg-white/10 
                   group-hover:bg-white/20 transition
                   peer-checked:bg-white peer-checked:text-[#002847] peer-checked:font-semibold"
          >
            Tidligere afregninger
          </span>
        </label>
      </div>
    </div>

    <!-- Advanced Filters Row -->
    <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
      <!-- Data Type Filter -->
      <div class="bg-[#002847] rounded-xl p-4">
        <label class="block text-white text-sm font-semibold mb-3">
          Vis data
        </label>
        <select 
          v-model="filters.dataType" 
          @change="emitFilters"
          class="w-full bg-[#0d3a5c] text-white px-4 py-2 rounded-lg border border-white/20 
                 focus:outline-none focus:border-[#91cc75] cursor-pointer"
        >
          <option value="settledAmount">Afregnet beløb</option>
          <option value="caseValue">Sagsværdi</option>
          <option value="casesSettled">Antal sager</option>
        </select>
      </div>

      <!-- Year Filter -->
      <div class="bg-[#002847] rounded-xl p-4">
        <label class="block text-white text-sm font-semibold mb-3">
          År
        </label>
        <select 
          v-model="filters.year" 
          @change="emitFilters"
          class="w-full bg-[#0d3a5c] text-white px-4 py-2 rounded-lg border border-white/20 
                 focus:outline-none focus:border-[#91cc75] cursor-pointer"
        >
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <!-- Status Filter -->
      <div class="bg-[#002847] rounded-xl p-4">
        <label class="block text-white text-sm font-semibold mb-3">
          Sager efter status
        </label>
        <select 
          v-model="filters.status" 
          @change="emitFilters"
          class="w-full bg-[#0d3a5c] text-white px-4 py-2 rounded-lg border border-white/20 
                 focus:outline-none focus:border-[#91cc75] cursor-pointer"
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
      <div class="bg-[#002847] rounded-xl p-4">
        <label class="block text-white text-sm font-semibold mb-3">
          Arbejdsarter
        </label>
        <select 
          v-model="filters.workType" 
          @change="emitFilters"
          class="w-full bg-[#0d3a5c] text-white px-4 py-2 rounded-lg border border-white/20 
                 focus:outline-none focus:border-[#91cc75] cursor-pointer"
        >
          <option value="">Alle</option>
          <option value="klientmøder">Klientmøder</option>
          <option value="retsmøder">Retsmøder</option>
          <option value="interne-møder">Interne møder</option>
          <option value="forberedelsesmøder">Forberedelsesmøder</option>
        </select>
      </div>

      <!-- Balance Filter -->
      <div class="bg-[#002847] rounded-xl p-4">
        <label class="block text-white text-sm font-semibold mb-3">
          Sager saldo
        </label>
        <select 
          v-model="filters.balance" 
          @change="emitFilters"
          class="w-full bg-[#0d3a5c] text-white px-4 py-2 rounded-lg border border-white/20 
                 focus:outline-none focus:border-[#91cc75] cursor-pointer"
        >
          <option value="">Alle</option>
          <option value="high">> 500.000 kr</option>
          <option value="medium">100.000-500.000 kr</option>
          <option value="low">< 100.000 kr</option>
        </select>
      </div>

      <!-- Industry Filter -->
      <div class="bg-[#002847] rounded-xl p-4">
        <label class="block text-white text-sm font-semibold mb-3">
          Branche
        </label>
        <select 
          v-model="filters.industry" 
          @change="emitFilters"
          class="w-full bg-[#0d3a5c] text-white px-4 py-2 rounded-lg border border-white/20 
                 focus:outline-none focus:border-[#91cc75] cursor-pointer"
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

    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 items-center">
      <span class="text-white text-sm font-semibold">Aktive filtre:</span>
      
      <button
        v-if="filters.status"
        @click="clearFilter('status')"
        class="px-3 py-1 bg-[#91cc75] text-[#002847] rounded-full text-sm font-semibold 
               flex items-center gap-2 hover:bg-[#7ab85f] transition"
      >
        Status: {{ getStatusLabel(filters.status) }}
        <span class="text-lg leading-none">×</span>
      </button>

      <button
        v-if="filters.workType"
        @click="clearFilter('workType')"
        class="px-3 py-1 bg-[#91cc75] text-[#002847] rounded-full text-sm font-semibold 
               flex items-center gap-2 hover:bg-[#7ab85f] transition"
      >
        Arbejdsart: {{ getWorkTypeLabel(filters.workType) }}
        <span class="text-lg leading-none">×</span>
      </button>

      <button
        v-if="filters.balance"
        @click="clearFilter('balance')"
        class="px-3 py-1 bg-[#91cc75] text-[#002847] rounded-full text-sm font-semibold 
               flex items-center gap-2 hover:bg-[#7ab85f] transition"
      >
        Saldo: {{ getBalanceLabel(filters.balance) }}
        <span class="text-lg leading-none">×</span>
      </button>

      <button
        v-if="filters.industry"
        @click="clearFilter('industry')"
        class="px-3 py-1 bg-[#91cc75] text-[#002847] rounded-full text-sm font-semibold 
               flex items-center gap-2 hover:bg-[#7ab85f] transition"
      >
        Branche: {{ getIndustryLabel(filters.industry) }}
        <span class="text-lg leading-none">×</span>
      </button>

      <button
        @click="clearAllFilters"
        class="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold 
               hover:bg-red-600 transition"
      >
        Ryd alle filtre
      </button>
    </div>
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

// Clear filters but keep year and type
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
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}
</style>