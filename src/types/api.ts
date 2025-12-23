import type { User } from './index'

export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E }

export interface LoginCredentials {
  email: string
  password: string
}

export interface TwoFactorPayload {
  pass_code: string
  code: string
}

export interface LoginResponse {
  pass_code: string
}

export interface ErrorResponse {
  code: string
  message: string
}
export interface TwoFactorResponse {
  token: string
  user: User
}
