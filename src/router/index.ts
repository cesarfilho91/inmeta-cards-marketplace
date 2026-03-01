import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/auth.store'

import PublicLayout from '@/layouts/PublicLayout.vue'
import DashboardLayout from '@/layouts/AppLayout.vue'

import MarketplaceView from '@/modules/marketplace/views/MarketplaceView.vue'
import LoginView from '@/modules/auth/views/LoginView.vue'
import RegisterView from '@/modules/auth/views/RegisterView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: PublicLayout,
            children: [
                {
                    path: '',
                    name: 'marketplace-public',
                    component: MarketplaceView
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { guestOnly: true }
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
            meta: { guestOnly: true }
        },

        {
            path: '/dashboard',
            component: DashboardLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    redirect: '/dashboard/marketplace'
                },
                {
                    path: 'marketplace',
                    name: 'marketplace',
                    component: MarketplaceView
                },
                {
                    path: 'create-trade',
                    name: 'create-trade',
                    component: () =>
                        import('@/modules/trades/views/CreateTradeView.vue')
                }
            ]
        }
    ]
})

router.beforeEach((to) => {
    const auth = useAuthStore()

    const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
    const guestOnly = to.matched.some(r => r.meta.guestOnly)

    if (requiresAuth && !auth.isAuthenticated) {
        return {
            path: '/login',
            query: { redirect: to.fullPath }
        }
    }

    if (guestOnly && auth.isAuthenticated) {
        return '/dashboard'
    }

    return true
})

export default router