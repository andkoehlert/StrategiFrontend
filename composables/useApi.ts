// composables/useApi.ts
import { useAuth } from './useAuth'
import { useRuntimeConfig } from '#imports'

export const useApi = () => {
  const { getToken } = useAuth()
  const config = useRuntimeConfig()

  const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const token = getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const url = `${config.public.apiBase}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  return { apiRequest }
}