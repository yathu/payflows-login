// const BASE_URL = 'https://oas31f7e47fdd11.free.beeceptor.com'

import type {
  ErrorResponse,
  LoginCredentials,
  LoginResponse,
  Result,
  TwoFactorPayload,
  TwoFactorResponse,
} from '@/types'

const BASE_URL = import.meta.env.DEV
  ? '/api' // Development - uses Vite proxy (no CORS)
  : 'https://oas31f7e47fdd11.free.beeceptor.com'

//currently we are repeting same fetch code, for prod app we can create a common fetch wrapper or axios instance to handle errors, headers, etc.
export const signIn = async (
  credentials: LoginCredentials,
): Promise<Result<LoginResponse, ErrorResponse>> => {
  try {
    const response = await fetch(BASE_URL + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      //we handle 401, 400 not need for now
      if (response.status === 401) {
        return {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'This email and password pair doesn’t match any known account.',
          },
        }
      }
      throw new Error(`Response status: ${response.status}`)
    }

    const result = await response.json()
    console.log('Login response==>', result)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('signInError==>', error)
    return {
      success: false,
      error: {
        code: 'network_error',
        message: 'Something went wrong. Please try again later.',
      },
    }
  }
}

export const verifyOtp = async (
  payload: TwoFactorPayload,
): Promise<Result<TwoFactorResponse, ErrorResponse>> => {
  try {
    //mock for testing delay
    if (payload.code !== '123456') {
      //return error message & code after delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return {
        success: false,
        error: {
          code: 'INVALID_2FA',
          message: 'Invalid pass_code or 2FA code',
        },
      }
    } else {
      //return success after delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return {
        success: true,
        data: {
          token: 'mocked_jwt_token_abcdefg12345',
          user: {
            id: 'user_12345',
            name: 'John Doe',
            email: 'test@user.com',
          },
        },
      }
    }
  } catch (error) {
    console.error('verify OTP error==>', error)
    return {
      success: false,
      error: {
        code: 'network_error',
        message: 'Something went wrong. Please try again later.',
      },
    }
  }
}

export const getNewOtpMock = async (): Promise<number> => {
  setTimeout(() => {}, 2000)
  return 123456
}
