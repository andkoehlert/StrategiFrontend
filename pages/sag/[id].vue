<template>
  <div>
    <h1>Sag: {{ caseNumber }}</h1>

    <div v-if="loading">Indlæser...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <h2>Query1</h2>
      <ul>
<li v-for="item in data?.Query1" :key="item.Nummer">
          {{ item.id }} - {{ item["Sag vedr_"] }} - {{ item.Sagskategori }}
        </li>
      </ul>

      <h2>Query3</h2>
      <ul>
        <li v-for="item in data?.Query3" :key="item.Medarbejder + item.Dato">
          {{ item.Medarbejder }}: {{ item.Beskrivelse }} ({{ item.Timer }} timer)
        </li>
      </ul>

      <h2>Query4</h2>
      <ul>
        <li v-for="item in data?.Query4" :key="item.Name">
          Ansvarlig: {{ item.Ansvarlig }}, Sagsbehandler: {{ item.Sagsbehandler }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const caseNumber = route.params.id

const data = ref(null)
const loading = ref(true)
const error = ref(null)


</script>
