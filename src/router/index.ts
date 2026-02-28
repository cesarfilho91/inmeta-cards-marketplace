import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/auth.store'

import LoginView from '@/modules/auth/views/LoginView.vue'
import RegisterView from '@/modules/auth/views/RegisterView.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import MarketplaceView from '@/modules/marketplace/views/MarketplaceView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'marketplace',
            component: MarketplaceView
        },
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
            path: '/app',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/HomeView.vue')
                },
                {
                    path: 'create-trade',
                    name: 'create-trade',
                    component: () => import('@/modules/trades/views/CreateTradeView.vue')
                }
            ]
        }
    ]
})

router.beforeEach(async (to) => {
    const auth = useAuthStore()

    const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
    const guestOnly = to.matched.some(r => r.meta.guestOnly)

    if (requiresAuth && !auth.isAuthenticated) {
        return '/login'
    }

    if (guestOnly && auth.isAuthenticated) {
        return '/app'
    }

    return true
})

export default router