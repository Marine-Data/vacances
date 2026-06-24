import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

interface ScreenProps {
  /** Titre pixel de l'écran (ex. « 📅 Planning »). */
  title?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Conteneur d'un écran de feature : titre pixel optionnel + animation d'entrée.
 * Les pages des features (C1–C5) enveloppent leur contenu dans <Screen>.
 */
export function Screen({ title, children, className }: ScreenProps) {
  return (
    <section className={cn('animate-pop', className)}>
      {title != null && (
        <h2 className="mb-4 mt-0.5 font-pixel text-[13px] leading-relaxed">{title}</h2>
      )}
      {children}
    </section>
  )
}
