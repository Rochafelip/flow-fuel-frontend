import { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AuthContextData {
  token: string | null
  loading: boolean
  signIn: (token: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: any) {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadToken()
  }, [])

  async function loadToken() {
    const storedToken = await AsyncStorage.getItem('@app_token')
    setToken(storedToken)
    setLoading(false)
  }

  async function signIn(newToken: string) {
    await AsyncStorage.setItem('@app_token', newToken)
    setToken(newToken)
  }

  async function signOut() {
    await AsyncStorage.removeItem('@app_token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
