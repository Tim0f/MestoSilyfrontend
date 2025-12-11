import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  icon?: LucideIcon
  fullWidth?: boolean
  className?: string
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon: Icon,
  fullWidth = false,
  className = '',
}: ButtonProps) {
  const baseStyles = 'font-h2 rounded-lg transition transform active:scale-95 flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-customwhite',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-orange-600 hover:bg-orange-50',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }
  
  const disabledStyles = 'opacity-50 cursor-not-allowed'
  const widthStyles = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? disabledStyles : ''}
        ${widthStyles}
        ${className}
      `}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
      {children}
    </button>
  )
}

