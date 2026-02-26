import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import HomeView from '@/views/HomeView.vue'
import AppLayout from '@/layouts/AppLayout.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: LoginView,
            meta: { guestOnly: true }
        },
        {
            path: '/register',
            component: RegisterView,
            meta: { guestOnly: true }
        },
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'home',
                    component: HomeView
                }
            ]
        }
    ]
})

router.beforeEach((to) => {
    const auth = useAuthStore()

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const guestOnly = to.matched.some(record => record.meta.guestOnly)

    if (requiresAuth && !auth.isAuthenticated) {
        return '/login'
    }

    if (guestOnly && auth.isAuthenticated) {
        return '/'
    }
})

export default router