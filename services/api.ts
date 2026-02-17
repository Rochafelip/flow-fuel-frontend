import AsyncStorage from '@react-native-async-storage/async-storage'

const BASE_URL = 'http://192.168.1.2:8080'

export async function loginRequest(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('Email ou senha inválidos')
  }

  return response.json()
}

export async function authenticatedRequest(
  endpoint: string,
  options?: Partial<RequestInit>
) {
  const token = await AsyncStorage.getItem('@token')

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...options,
  })

  if (response.status === 401) {
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    throw new Error('Erro na requisição')
  }

  return response.json()
}
