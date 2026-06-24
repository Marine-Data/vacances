import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

/** Champ de saisie 8-bit (bordure 3px + ombre dure). */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full rounded-xl border-3 border-sara-ink bg-white px-3.5 py-3 font-body font-semibold text-sara-ink shadow-hard-sm outline-none',
          'placeholder:text-sara-ink/40 focus:bg-sara-paper',
          className,
        )}
        {...rest}
      />
    )
  },
)
