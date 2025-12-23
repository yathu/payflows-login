import type { User } from './index'

export interface TwoFactorResponse {
  token: string
  user: User
}
