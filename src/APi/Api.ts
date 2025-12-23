const BASE_URL = 'https://oas31f7e47fdd11.free.beeceptor.com'

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
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/11.6.1',
      },
    })

    console.log('Login response all==>', response)

    if (!response.ok) {
      //401, 400 errors
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
