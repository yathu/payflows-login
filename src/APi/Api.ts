// const BASE_URL = 'https://oas31f7e47fdd11.free.beeceptor.com'

const BASE_URL = import.meta.env.DEV
  ? '/api' // Development - uses Vite proxy (no CORS)
  : 'https://oas31f7e47fdd11.free.beeceptor.com'

type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E }

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  pass_code: string
}

export interface ErrorResponse {
  code: string
  message: string
}

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

    console.log('Login response all==>', response)

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
