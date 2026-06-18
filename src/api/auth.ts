import { apiClient, unwrap } from './client'
import type { AuthTokens, User } from '@/types'

interface OtpRequestPayload {
  phone: string
}

interface OtpVerifyPayload {
  phone: string
  code: string
  rememberMe: boolean
}

interface AuthResponse extends AuthTokens {
  user: User
}

export const authApi = {
  requestOtp: async (payload: OtpRequestPayload): Promise<{ requestId: string; expiresIn: number }> => {
    const res = await apiClient.post('/auth/otp/request', payload)
    return unwrap(res.data)
  },

  verifyOtp: async (payload: OtpVerifyPayload): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/otp/verify', payload)
    return unwrap(res.data)
  },

  me: async (): Promise<User> => {
    const res = await apiClient.get('/auth/me')
    return unwrap(res.data)
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },
}
