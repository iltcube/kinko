import { createApp } from 'vue'
import './styles/main.scss'
import 'primeicons/primeicons.css'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

export const app = createApp(App)
  .use(router)
  .use(PrimeVue, {
    ripple: true,
    unstyled: false,
    theme: {
      preset: Aura,
      options: {
        prefix: 'p',
        darkModeSelector: 'system',
        cssLayer: false
      }
    }
  })
