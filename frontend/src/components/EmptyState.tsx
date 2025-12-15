import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon size={64} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-h2 text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-h2 hover:from-orange-600 hover:to-orange-700 transition"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

