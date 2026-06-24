import { cn } from '../lib/cn'

interface LoaderProps {
  label?: string
  className?: string
}

/** Loader rétro : 4 carrés clignotants (contracts.md §6.3). */
export function Loader({ label, className }: LoaderProps) {
  return (
    <div
      className={cn('flex flex-col items-center gap-3 py-4', className)}
      role="status"
      aria-live="polite"
    >
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-3.5 w-3.5 animate-blink bg-sara-ink"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      {label && <p className="font-body font-semibold text-sara-ink/70">{label}</p>}
    </div>
  )
}
