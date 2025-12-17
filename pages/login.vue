<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a1f33] via-[#0d3a5c] to-[#175381] flex items-center justify-center p-4">
<div class="bg-[#002847] rounded-3xl shadow-2xl p-12 w-full max-w-xl">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Dit strategi dashboard</h1>
        <p class="text-gray-300 text-sm">Vælg en bruger for at fortsætte</p>
      </div>

      <div v-if="error" class="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
        <p class="text-red-300 text-sm">{{ error }}</p>
      </div>

      <div class="space-y-4 mb-6">
        <label class="block text-white text-sm font-semibold mb-2">
          Vælg bruger (Demo)
        </label>
        
        <div 
          v-for="user in availableUsers" 
          :key="user.initials"
          @click="selectUser(user.initials)"
          class="p-4 bg-[#0d3a5c] hover:bg-[#175381] border border-white/20 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white font-semibold">{{ user.name }}</p>
              <p class="text-gray-300 text-sm">{{ user.email }}</p>
            </div>
<div class="bg-[#CFAE76] text-[#002847] px-3 py-1 rounded-full font-bold text-sm">
              {{ user.initials.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-white/20"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-[#002847] text-gray-400">test</span>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        

      <button
  type="submit"
  :disabled="loading"
  class="w-full bg-[#CFAE76] hover:bg-[#bfa063] text-[#002847] font-bold py-3 px-4 rounded-lg 
         transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
>

          <span v-if="loading">Logger ind...</span>
          <span v-else>Log ind</span>
        </button>
      </form>

      <!-- Info Note til Exam det vil ændre sig i produktion -->
      <div class="mt-8 p-4 bg-[#0d3a5c]/50 border border-white/10 rounded-lg">
        <p class="text-gray-300 text-xs text-center">
          <strong class="text-white">Til eksamen:</strong> Dette er en mock-login til eksamen. 
          
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { login, getAvailableUsers } = useAuth()

const initials = ref('')
const loading = ref(false)
const error = ref('')
const availableUsers = getAvailableUsers()

const selectUser = (userInitials: string) => {
  initials.value = userInitials
  handleLogin()
}

const handleLogin = async () => {
  if (!initials.value) {
    error.value = 'Vælg en bruger først'
    return
  }

  loading.value = true
  error.value = ''

  await new Promise(resolve => setTimeout(resolve, 500))

  const success = login(initials.value.toLowerCase())

  if (success) {
    router.push('/')
  } else {
    error.value = `Bruger med initialer "${initials.value}" ikke fundet. Prøv: ${availableUsers.map(u => u.initials).join(', ')}`
    loading.value = false
  }
}
</script>