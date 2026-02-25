import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import { router } from './router'
import App from './App.vue'
import '@/assets/styles/base.css'
import '@/assets/styles/variables.css'
import '@/assets/styles/layout.css'
import '@/assets/styles/auth.css'

async function bootstrap() {
    const app = createApp(App)
    const pinia = createPinia()

    app.use(pinia)

    const auth = useAuthStore(pinia)

    if (auth.token) {
        try {
            await auth.fetchUser()
        } catch {
            auth.logout()
        }
    }

    app.use(router)
    app.mount('#app')
}

bootstrap()