import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type BadgeColor = 'blue' | 'pink' | 'yellow' | 'green' | 'purple' | 'orange' | 'paper'

const colorClass: Record<BadgeColor, string> = {
  blue: 'bg-sara-blue',
  pink: 'bg-sara-pink',
  yellow: 'bg-sara-yellow',
  green: 'bg-sara-green',
  purple: 'bg-sara-purple',
  orange: 'bg-sara-orange',
  paper: 'bg-sara-paper',
}

interface BadgeProps {
  children: ReactNode
  color?: BadgeColor
  className?: string
}

/** Petite pastille pixel (jour, statut…). Police Press Start 2P, avec parcimonie. */
export function Badge({ children, color = 'paper', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-lg border-2 border-sara-ink px-2 py-1 font-pixel text-[8px] leading-none shadow-hard-sm',
        colorClass[color],
        className,
      )}
    >
      {children}
    </span>
  )
}
