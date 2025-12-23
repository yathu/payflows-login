import type { User } from './index'

export type AuthState = 'unauthenticated' | 'loginOnlySuccess' | 'authenticated'

export interface AuthStore {
  authState: AuthState
  token?: string
  user?: User
  passCode?: string
}
