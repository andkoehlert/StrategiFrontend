import { ref, computed } from 'vue'

interface User {
  id: string
  name: string
  email: string
  initials: string
}

interface LoginResponse {
  error: string | null
  data: {
    userId: string
    token: string
  }
}

const API_BASE_URL = 'https://mongo-api-2025.onrender.com/api/'

const currentUser = ref<User | null>(null)
const authToken = ref<string | null>(null)

export const useAuth = () => {
  const isAuthenticated = computed(() => !!authToken.value)

  // Initialize auth from localStorage
  const initializeAuth = () => {
    if (!process.client) return

    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('currentUser')

    if (token && user) {
      authToken.value = token
      currentUser.value = JSON.parse(user)
    }
  }

  // Login with backend API
  const loginWithBackend = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data: LoginResponse = await response.json()

      if (!response.ok || !data.data) {
        return { success: false, error: data.error || 'Login failed' }
      }

      authToken.value = data.data.token

      // Decode JWT payload (display only)
      const tokenPayload = JSON.parse(
        atob(data.data.token.split('.')[1])
      )

      currentUser.value = {
        id: data.data.userId,
        name: tokenPayload.name,
        email: tokenPayload.email,
        initials: tokenPayload.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase(),
      }

      if (process.client) {
        localStorage.setItem('authToken', authToken.value)
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      }

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

 
  const logout = () => {
    currentUser.value = null
    authToken.value = null

    if (process.client) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
    }
  }

  const getCurrentUser = () => currentUser.value
  const getUserInitials = () => currentUser.value?.initials || null
  const getToken = () => authToken.value

  return {
    // state
    currentUser,
    isAuthenticated,

    // actions
    initializeAuth,
    loginWithBackend,
    logout,

    // helpers
    getCurrentUser,
    getUserInitials,
    getToken,
  }
}
