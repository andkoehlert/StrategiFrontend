// utils/apiClient.ts
const API_BASE_URL = 'http://localhost:4000' 

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean
}

export const apiClient = {
  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { requiresAuth = false, headers = {}, ...fetchOptions } = options

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    }

    // Add auth token if required
    if (requiresAuth && process.client) {
      const token = localStorage.getItem('authToken')
      if (token) {
        defaultHeaders['auth-token'] = token
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers: defaultHeaders,
    })

    // Handle unauthorized
    if (response.status === 401) {
      // Clear auth and redirect to login
      if (process.client) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('currentUser')
        window.location.href = '/login'
      }
      throw new Error('Unauthorized')
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'API request failed')
    }

    return data
  },

  get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', requiresAuth })
  },

  post<T>(endpoint: string, body: any, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      requiresAuth,
    })
  },

  put<T>(endpoint: string, body: any, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      requiresAuth,
    })
  },

  delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', requiresAuth })
  },
}

