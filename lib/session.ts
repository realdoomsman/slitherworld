// Session management utilities

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('sessionToken')
}

export function setSessionToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('sessionToken', token)
  localStorage.setItem('sessionExpiry', String(Date.now() + 35 * 60 * 1000)) // 35 minutes
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('sessionToken')
  localStorage.removeItem('sessionExpiry')
}

export function isSessionExpired(): boolean {
  if (typeof window === 'undefined') return true
  const expiry = localStorage.getItem('sessionExpiry')
  if (!expiry) return true
  return Date.now() > parseInt(expiry)
}

export function getSessionTimeRemaining(): number {
  if (typeof window === 'undefined') return 0
  const expiry = localStorage.getItem('sessionExpiry')
  if (!expiry) return 0
  const remaining = parseInt(expiry) - Date.now()
  return Math.max(0, remaining)
}

// Auto-refresh session before expiration
export function setupSessionRefresh(onExpired: () => void): () => void {
  const checkInterval = setInterval(() => {
    if (isSessionExpired()) {
      clearSession()
      onExpired()
    }
  }, 60000) // Check every minute

  return () => clearInterval(checkInterval)
}
