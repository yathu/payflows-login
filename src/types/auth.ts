import type { User } from './index'

export type AuthState = 'unauthenticated' | 'loginOnlySuccess' | 'authenticated'

export interface AuthStore {
  authState: AuthState | null
  token: string | null
  user: User | null
  passCode: string | null
  otpAttempts: number
  otpLockedTime: number | null
  lastOtpAttemptTime: number | null
  maxtOtpAttemptTimes: number
}
