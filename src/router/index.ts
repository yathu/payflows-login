import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LoginView from '@/pages/login.vue'
import TwoFAView from '@/pages/twoFA.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LoginView,
  },
  {
    path:'/2fa',
    component:TwoFAView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
