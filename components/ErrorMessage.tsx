import { APIError } from '@/lib/api'

interface ErrorMessageProps {
  error: Error | APIError | string | null
  onRetry?: () => void
  onDismiss?: () => void
}

export default function ErrorMessage({ error, onRetry, onDismiss }: ErrorMessageProps) {
  if (!error) return null

  const getMessage = () => {
    if (typeof error === 'string') return error
    if (error instanceof APIError) {
      // User-friendly messages
      switch (error.code) {
        case 'SESSION_EXPIRED':
          return 'Your session has expired. Please sign in again.'
        case 'UNAUTHORIZED':
          return 'You need to sign in to continue.'
        case 'RATE_LIMIT':
          return 'Too many requests. Please wait a moment.'
        case 'NETWORK_ERROR':
          return 'Network error. Please check your connection.'
        default:
          return error.message
      }
    }
    return error.message || 'An unexpected error occurred.'
  }

  return (
    <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <p className="text-red-400 font-semibold mb-2">{getMessage()}</p>
          <div className="flex gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold transition-colors"
              >
                Try Again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm font-semibold transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
