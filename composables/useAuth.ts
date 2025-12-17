import { ref, computed } from 'vue'
import type {User} from '../interfaces/user'

const MOCK_USERS: User[] = [
  { initials: 'kw', name: 'Kristian', email: 'kw@lawfirm.dk' },
  { initials: 'jk', name: 'Jens', email: 'Jens@lawfirm.dk' },
]

const currentUser = ref<User | null>(null)
const isAuthenticated = computed(() => currentUser.value !== null)

export const useAuth = () => {
 
  const login = (initials: string): boolean => {
    const user = MOCK_USERS.find(u => u.initials.toLowerCase() === initials.toLowerCase())
    
    if (user) {
      currentUser.value = user
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('mockUser', JSON.stringify(user))
      }
      return true
    }
    
    return false
  }


  const logout = () => {
    currentUser.value = null
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('mockUser')
    }
  }


  const initializeAuth = () => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('mockUser')
      if (stored) {
        try {
          currentUser.value = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse stored user:', e)
          sessionStorage.removeItem('mockUser')
        }
      }
    }
  }

 
  const getUserInitials = (): string | null => {
    return currentUser.value?.initials || null
  }

 
  const getAvailableUsers = (): User[] => {
    return MOCK_USERS
  }

  return {
    currentUser: computed(() => currentUser.value),
    isAuthenticated,
    login,
    logout,
    initializeAuth,
    getUserInitials,
    getAvailableUsers,
  }
}