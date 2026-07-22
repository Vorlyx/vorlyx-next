'use client'

/**
 * Error boundary component
 * Catches and displays errors that occur during rendering
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-vorlyx-dark-gray text-white p-8">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-lg mb-4">{error.message}</p>
      {error.digest && (
        <p className="text-sm text-vorlyx-text-gray mb-4">
          Error ID: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        className="bg-white text-vorlyx-black px-6 py-3 rounded-full hover:bg-vorlyx-light-gray transition-colors"
      >
        Try again
      </button>
    </div>
  )
}

