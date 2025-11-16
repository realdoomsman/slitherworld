// API utilities with error handling

import { getSessionToken, isSessionExpired, clearSession } from './session'

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // Check session expiration
  if (isSessionExpired()) {
    clearSession()
    throw new APIError('Session expired. Please sign in again.', 401, 'SESSION_EXPIRED')
  }

  // Add auth token
  const token = getSessionToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Merge with provided headers
  if (options.headers) {
    Object.assign(headers, options.headers)
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Handle different status codes
    if (response.status === 401) {
      clearSession()
      throw new APIError('Session expired. Please sign in again.', 401, 'UNAUTHORIZED')
    }

    if (response.status === 402) {
      // Payment required - return the payment info
      const data = await response.json()
      return data as T
    }

    if (response.status === 429) {
      throw new APIError('Too many requests. Please slow down.', 429, 'RATE_LIMIT')
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new APIError(
        error.error || error.message || 'Request failed',
        response.status,
        error.code
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    // Network error
    if (error instanceof TypeError) {
      throw new APIError('Network error. Please check your connection.', 0, 'NETWORK_ERROR')
    }

    throw new APIError('An unexpected error occurred.', 500, 'UNKNOWN_ERROR')
  }
}

// Specific API methods
export const api = {
  auth: {
    challenge: (walletAddress: string) =>
      apiRequest<{ message: string }>('/api/auth/challenge', {
        method: 'POST',
        body: JSON.stringify({ walletAddress }),
      }),

    verify: (walletAddress: string, signature: string, message: string) =>
      apiRequest<{ token: string; walletAddress: string }>('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ walletAddress, signature, message }),
      }),
  },

  lobby: {
    create: (lobbyType: string) =>
      apiRequest<{ lobbyId: string; payment: any }>('/api/lobby/create', {
        method: 'POST',
        body: JSON.stringify({ lobbyType }),
      }),

    joinFree: (lobbyId: string) =>
      apiRequest<{ success: boolean }>('/api/lobby/join-free', {
        method: 'POST',
        body: JSON.stringify({ lobbyId }),
      }),

    verifyPayment: (data: {
      lobbyId: string
      txHash: string
      reference: string
      expectedAmount: number
    }) =>
      apiRequest<{ success: boolean }>('/api/lobby/verify-payment', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  player: {
    stats: () => apiRequest<any>('/api/player/stats'),
    matches: () => apiRequest<any>('/api/player/matches'),
  },

  leaderboard: {
    get: (type: string) =>
      apiRequest<any>(`/api/leaderboard?type=${type}`),
  },

  games: {
    active: () => apiRequest<any>('/api/games/active'),
  },
}
