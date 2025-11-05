import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-start gap-4">
      <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
      <div className="flex-1">
        <h3 className="text-red-900 font-semibold mb-1">Произошла ошибка</h3>
        <p className="text-red-700">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Попробовать снова
          </button>
        )}
      </div>
    </div>
  )
}

