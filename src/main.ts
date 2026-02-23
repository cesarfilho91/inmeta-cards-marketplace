import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import { router } from './router'
import App from './App.vue'

async function bootstrap() {
    const app = createApp(App)
    const pinia = createPinia()

    app.use(pinia)

    const auth = useAuthStore()

    if (auth.token) {
        try {
            await auth.fetchUser()
        } catch (error) {
            auth.logout()
        }
    }

    app.use(router)
    app.mount('#app')
}

bootstrap()