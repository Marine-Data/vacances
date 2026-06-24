import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { Button } from './Button'

interface ErrorStateProps {
  title?: ReactNode
  detail?: ReactNode
  onRetry?: () => void
  className?: string
}

/** État d'erreur ludique : emoji + message + bouton « réessayer » optionnel. */
export function ErrorState({
  title = 'Oups, ça a planté…',
  detail,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('px-3 py-10 text-center', className)}>
      <div className="mb-2 text-5xl">💥</div>
      <p className="font-body text-lg font-bold text-sara-ink">{title}</p>
      {detail && <p className="mt-2 font-body text-sm font-semibold text-sara-ink/60">{detail}</p>}
      {onRetry && (
        <div className="mt-4 flex justify-center">
          <Button color="pink" size="sm" onClick={onRetry}>
            ↻ Réessayer
          </Button>
        </div>
      )}
    </div>
  )
}
