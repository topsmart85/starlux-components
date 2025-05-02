// nuxt.config.ts
export default defineNuxtConfig({
  // Set the app in development mode
  dev: process.env.NODE_ENV !== 'production',

  // Meta tags for accessibility and SEO
  app: {
    head: {
      title: 'StarLux Airlines Components',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'description', content: 'StarLux Airlines component implementation' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/image',
    'nuxt-security'
  ],

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },

  // Build configuration
  build: {
    transpile: ['lucide-vue-next']
  },

  // Vite configuration for performance
  vite: {
    optimizeDeps: {
      include: ['vue', '@vueuse/core', 'lucide-vue-next']
    }
  }
})