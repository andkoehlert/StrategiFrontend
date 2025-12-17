export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, initializeAuth } = useAuth()
  
  initializeAuth()

  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/')
  }
})