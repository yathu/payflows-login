import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginView from '@/pages/login.vue'
import TwoFAView from '@/pages/twoFA.vue'
import DashboardView from '@/pages/dashboard.vue'
import { useAuthStore } from '@/stores/authStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LoginView,
    meta: { requireAuth: false },
  },
  {
    path: '/twoFA',
    component: TwoFAView,
    meta: { require2FA: true },
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requireAuth: true },
  },
  {
    // all other route redirect to login then before  each will handle auth redirection
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// navigation guard for autherization
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const { authState } = authStore

  if (to.name === '/') {
    // If user auth then redirect to dashboard
    if (authState === 'authenticated') {
      return next({ name: 'dashboard' })
    }
    // If login only redirec to 2fa
    if (authState === 'loginOnlySuccess') {
      return next({ name: 'twoFA' })
    }
    //default
    return next()
  }

  // check 2fa
  if (to.name === 'twoFA') {
    // If not auth then backto login
    if (authState === 'unauthenticated') {
      return next({ name: 'login' })
    }
    // If already authenticated redirect to dashboard
    if (authState === 'authenticated') {
      return next({ name: 'dashboard' })
    }

    // If not above then its login only so allow
    return next()
  }

  // check the protected routes, if to.meta.requiresAuth checks all protected routes rather to.name
  if (to.meta.requiresAuth) {
    // If not auth -> login
    if (authState === 'unauthenticated') {
      return next({ name: '/' })
    }
    // If login only -> 2FA
    if (authState === 'loginOnlySuccess') {
      return next({ name: 'twoFA' })
    }
    // else authenticated allow
    return next()
  }
  //default to the page
  next()
})

export default router
