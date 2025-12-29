

export interface User {
  id: string
  name: string
  email: string
  initials: string
}

export interface LoginResponse {
  error: string | null
  data: {
    userId: string
    token: string
  }
}