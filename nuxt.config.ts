import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
    css: ['./assets/css/tailwind.css'],
    vite: {
    plugins: [
      tailwindcss(),
    ],
  },
    runtimeConfig: {
  public: {
    apiBase: "https://specifikation.dev.kirklarsen.dk"
  }
},
  modules: [
    '@nuxt/test-utils/module',
  ],

})
