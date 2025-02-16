import { app } from './app'
import { registerServiceWorker } from './app/registerServiceWorker'

registerServiceWorker()

app.mount('#app')
