const BASE_URL = 'https://oas31f7e47fdd11.free.beeceptor.com'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  pass_code: string
}

const signIn = async (credentials: LoginCredentials): Promise<LoginResponse | undefined> => {
  try {
    const response = await fetch(BASE_URL + '/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json',
        'access-control-allow-origin': '*',
        vary: 'Accept-Encoding',
      },
    })
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error(error)
    return undefined
  }
}
