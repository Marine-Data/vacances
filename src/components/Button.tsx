import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export type ButtonColor = 'yellow' | 'blue' | 'pink' | 'green' | 'purple' | 'orange' | 'paper'

const colorClass: Record<ButtonColor, string> = {
  yellow: 'bg-sara-yellow',
  blue: 'bg-sara-blue',
  pink: 'bg-sara-pink',
  green: 'bg-sara-green',
  purple: 'bg-sara-purple',
  orange: 'bg-sara-orange',
  paper: 'bg-sara-paper',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor
  size?: 'md' | 'sm'
}

/** Bouton 8-bit « pressable » : s'enfonce au clic, ombre dure (contracts.md §6.3). */
export function Button({
  color = 'yellow',
  size = 'md',
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl border-3 border-sara-ink font-body font-extrabold text-sara-ink shadow-hard transition-transform',
        'active:translate-x-1 active:translate-y-1 active:shadow-none',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-hard',
        colorClass[color],
        size === 'md'
          ? 'min-h-[48px] w-full px-4 py-3 text-base'
          : 'min-h-[40px] px-3.5 py-2.5 text-sm',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
