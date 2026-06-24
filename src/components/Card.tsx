import type { HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Rend la carte cliquable (curseur + enfoncement au clic). */
  tappable?: boolean
}

/** Carte 8-bit : fond clair, bordure 3px, ombre dure 4px (contracts.md §6.3). */
export function Card({ tappable, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border-3 border-sara-ink bg-white p-4 shadow-hard',
        tappable &&
          'cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
