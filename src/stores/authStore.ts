import type { AuthStore, User } from '@/types'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', {
  state: (): AuthStore => ({
    authState: 'unauthenticated',
    token: null,
    user: null,
    passCode: null,
    otpAttempts: 0,
    isOtpLocked: false,
    otpLockedTime: null,
    lastOtpAttemptTime: null,
    maxtOtpAttemptTimes: 3,
  }),
  getters: {
    isAuthenticated: (state) => state.authState === 'authenticated',
    isLoginOnlySuccess: (state) => state.authState === 'loginOnlySuccess',
    isUnAuthenticated: (state) => state.authState === 'unauthenticated',
    getOtpAtteptsRemaining: (state) => state.maxtOtpAttemptTimes - state.otpAttempts,
    canAttemptOtp: (state) => state.otpAttempts < state.maxtOtpAttemptTimes,
  },
  actions: {
    setLoginOnlySuccess(passCode: string) {
      this.authState = 'loginOnlySuccess'
      this.passCode = passCode

      //set in session storage for temp & expire on close
      sessionStorage.setItem('authState', this.authState)
      sessionStorage.setItem('passCode', this.passCode)
    },

    handleOtp() {
      //all logic handles here
      if (this.otpAttempts >= this.maxtOtpAttemptTimes) {
        this.isOtpLocked = true
        this.otpLockedTime = Date.now()
        return
      }
      this.otpAttempts += 1
      this.lastOtpAttemptTime = Date.now()
      localStorage.setItem('lastOtpAttemptTime', this.lastOtpAttemptTime.toString())
    },

    setAuthenticated(token: string, user: User) {
      this.authState = 'authenticated'
      this.token = token
      this.user = user

      localStorage.setItem('authState', this.authState)
      localStorage.setItem('token', this.token)

      if (this.user?.id) {
        //it's in if bcz json stringify may throw error if user is undefined
        localStorage.setItem('user', JSON.stringify(this.user))
      }

      //crear after presist auth & token
      sessionStorage.removeItem('authState')
      sessionStorage.removeItem('passCode')
    },

    setUnauthenticated() {
      this.authState = 'unauthenticated'
      this.token = null
      this.user = null
      this.passCode = null

      localStorage.removeItem('authState')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('authState')
      sessionStorage.removeItem('passCode')
    },
    // Initialize auth when page loads
    initAuth() {
      const initAuthState = localStorage.getItem('authState')
      const initToken = localStorage.getItem('token')
      const initUser = localStorage.getItem('user')
      const lastOtpAttemptTime = localStorage.getItem('lastOtpAttemptTime')

      try {
        if (initAuthState === 'authenticated' && initToken) {
          this.authState = 'authenticated'
          this.token = initToken
          this.user = initUser ? JSON.parse(initUser) : undefined

          if (lastOtpAttemptTime) {
            this.lastOtpAttemptTime = parseInt(lastOtpAttemptTime)
          }
          return
        }
      } catch (error) {
        console.error('Error at check init auth', error)
      }

      // Check if user in 2fa stage
      const sessionAuthState = sessionStorage.getItem('authState')
      const sessionpassCode = sessionStorage.getItem('passCode')

      if (sessionAuthState === 'loginOnlySuccess' && sessionpassCode) {
        this.authState = 'loginOnlySuccess'
        this.passCode = sessionpassCode
        return
      }

      // Otherwise set unauthenticated
      this.authState = 'unauthenticated'
      this.user = null
    },
  },
})
