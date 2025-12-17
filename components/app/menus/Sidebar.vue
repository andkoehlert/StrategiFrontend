<script setup lang="ts">
import { ref } from 'vue'

const isExpanded = ref(false)

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

const menuItems = [
  { name: 'Home', icon: 'home', link: '/' },
  { name: 'Cases', icon: 'description'},
  { name: 'Settings', icon: 'settings'},
]
</script>

<template>
  <div
    class="flex rounded-lg flex-col bg-gray-800 border-r border-gray-700 h-screen text-white transition-all duration-200"
    :class="[isExpanded ? 'w-64' : 'w-16']"
     style="background-color: #002847"
  >
    <div
      class="flex items-center   h-16 cursor-pointer border-b border-gray-700"
      :class="[isExpanded ? 'justify-end pr-4' : 'justify-center']"
      @click="toggleExpanded"
    >
      <span class="text-white text-xl">
        {{ isExpanded ? 'x' : '☰' }}
      </span>
    </div>

    <nav class="flex flex-col flex-1 mt-4">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.name"
        :to="item.link"
        class="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors rounded"
      >
        <span class="material-symbols-outlined text-2xl">
          {{ item.icon }}
        </span>

        <span
          v-if="isExpanded"
          class="ml-4 font-medium text-white"
        >
          {{ item.name }}
        </span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 48;
}
</style>
