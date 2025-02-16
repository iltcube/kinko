import { app } from './app'
import { registerServiceWorker } from './app/registerServiceWorker'

app.mount('#app')

registerServiceWorker()
