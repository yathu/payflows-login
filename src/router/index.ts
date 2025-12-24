import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginView from '@/pages/login.vue'
import TwoFAView from '@/pages/twoFA.vue'
import DashboardView from '@/pages/dashboard.vue'
import { useAuthStore } from '@/stores/authStore'

export const PATHS = {
  LOGIN: '/',
  TWOFA: '/twoFA',
  DASHBOARD: '/dashboard',
} as const

const routes: RouteRecordRaw[] = [
  {
    path: PATHS.LOGIN,
    name: 'login',
    component: LoginView,
    meta: { requireAuth: false },
  },
  {
    path: PATHS.TWOFA,
    component: TwoFAView,
    meta: { require2FA: true },
  },
  {
    path: PATHS.DASHBOARD,
    component: DashboardView,
    meta: { requireAuth: true },
  },
  {
    // all other route redirect to login then before  each will handle auth redirection
    path: '/:pathMatch(.*)*',
    redirect: PATHS.LOGIN,
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

  if (to.name === 'login') {
    // If user auth then redirect to dashboard
    if (authState === 'authenticated') {
      return next(PATHS.DASHBOARD)
    }
    // If login only redirec to 2fa
    if (authState === 'loginOnlySuccess') {
      return next(PATHS.TWOFA)
    }
    //default
    return next()
  }

  // check 2fa
  if (to.meta.require2FA) {
    // If not auth then backto login
    if (authState === 'unauthenticated') {
      return next(PATHS.LOGIN)
    }
    // If already authenticated redirect to dashboard
    if (authState === 'authenticated') {
      return next(PATHS.DASHBOARD)
    }

    // If not above then its login only so allow
    return next()
  }

  // check the protected routes, if to.meta.requiresAuth checks all protected routes rather to.name
  if (to.meta.requireAuth) {
    // If not auth -> login
    if (authState === 'unauthenticated') {
      return next(PATHS.LOGIN)
    }
    // If login only -> 2FA
    if (authState === 'loginOnlySuccess') {
      return next(PATHS.TWOFA)
    }
    // else authenticated allow
    return next()
  }
  //default to the page
  next()
})

export default router
