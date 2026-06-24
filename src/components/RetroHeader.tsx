import { useAuth } from '../lib/auth'
import { Button } from './Button'

/** En-tête rétro : marque pixel, salutation, bouton de déconnexion. */
export function RetroHeader() {
  const { user, logout } = useAuth()
  const pseudo = user?.email?.split('@')[0] ?? ''

  return (
    <header className="shrink-0 border-b-3 border-sara-ink bg-gradient-to-br from-sara-blue to-sara-pink px-4 pb-3 pt-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-pixel text-[15px] [text-shadow:2px_2px_0_rgb(var(--sara-paper))]">
          🏖️ SARAILLON
        </span>
        <Button color="paper" size="sm" onClick={() => void logout()}>
          ⎋ Quitter
        </Button>
      </div>
      <p className="mt-1.5 font-body text-sm font-semibold opacity-80">
        Séjour entre amies 🌴 2026{pseudo && ` · salut ${pseudo} !`}
      </p>
    </header>
  )
}
