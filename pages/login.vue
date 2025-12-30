<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a1f33] via-[#0d3a5c] to-[#175381] flex items-center justify-center p-4">
    <div class="bg-[#002847] rounded-3xl shadow-2xl p-12 w-full max-w-xl">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Dit strategi dashboard</h1>
        <p class="text-gray-300 text-sm">Log ind med din email og adgangskode</p>
        <p class="gold-text text-sm"><span class="uppercase">Opmærksom:</span> Login kan tage et stykke tid da backend skal starte op. </p>
      </div>

      <div v-if="error" class="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
        <p class="text-red-300 text-sm">{{ error }}</p>
      </div>

      <!-- Real Login Form -->
      <form @submit.prevent="handleRealLogin" class="space-y-4">
        <div>
          <label class="block text-white text-sm font-semibold mb-2">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="din@email.dk"
            class="w-full px-4 py-3 bg-[#0d3a5c] text-white border border-white/20 rounded-lg 
                   focus:outline-none focus:border-[#CFAE76] transition-colors"
          />
        </div>

        <div>
          <label class="block text-white text-sm font-semibold mb-2">
            Adgangskode
          </label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-3 bg-[#0d3a5c] text-white border border-white/20 rounded-lg 
                   focus:outline-none focus:border-[#CFAE76] transition-colors"
          />
        </div>

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

      <!-- Info Note -->
      <div class="mt-8 p-4 bg-[#0d3a5c]/50 border border-white/10 rounded-lg">
        <p class="text-gray-300 text-xs text-center">
          <strong class="text-white">Produktion:</strong> Dette login forbinder til backend API.
          Demo mode er tilgængelig til test formål.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { loginWithBackend } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// Real login handler
const handleRealLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Udfyld både email og adgangskode'
    return
  }

  loading.value = true
  error.value = ''

  const result = await loginWithBackend(email.value, password.value)

  if (result.success) {
    await router.push('/')
  } else {
    error.value = result.error || 'Login fejlede. Tjek dine oplysninger.'
    loading.value = false
  }
}
</script>
