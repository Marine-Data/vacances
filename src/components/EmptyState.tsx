import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

interface EmptyStateProps {
  emoji?: string
  title: ReactNode
  hint?: ReactNode
  className?: string
}

/** État vide ludique : gros emoji + message (contracts.md §6.3). */
export function EmptyState({ emoji = '🕳️', title, hint, className }: EmptyStateProps) {
  return (
    <div className={cn('px-3 py-10 text-center', className)}>
      <div className="mb-2 text-5xl">{emoji}</div>
      <p className="font-body text-lg font-bold text-sara-ink/80">{title}</p>
      {hint && <p className="mt-2 font-body text-sm font-semibold text-sara-ink/60">{hint}</p>}
    </div>
  )
}
