import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

// Handle SPA redirect from 404.html
const redirectPath = sessionStorage.getItem('spa-redirect')
if (redirectPath) {
  sessionStorage.removeItem('spa-redirect')
  router.replace(redirectPath)
}
