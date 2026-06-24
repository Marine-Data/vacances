import { NavLink } from 'react-router-dom'
import { cn } from '../lib/cn'

interface Tab {
  to: string
  icon: string
  label: string
  activeBg: string
}

/** Les 5 onglets (contracts.md §6.3 / saraillon-spec.md). */
export const NAV_TABS: Tab[] = [
  { to: '/planning', icon: '📅', label: 'PLANNING', activeBg: 'bg-sara-blue' },
  { to: '/jeux', icon: '🎲', label: 'JEUX', activeBg: 'bg-sara-yellow' },
  { to: '/repas', icon: '🍽️', label: 'REPAS', activeBg: 'bg-sara-green' },
  { to: '/galerie', icon: '📸', label: 'GALERIE', activeBg: 'bg-sara-purple' },
  { to: '/surprises', icon: '🎁', label: 'SURPRISES', activeBg: 'bg-sara-pink' },
]

/** Barre de navigation fixe en bas, onglet actif surligné de sa couleur. */
export function BottomNav() {
  return (
    <nav className="flex shrink-0 border-t-3 border-sara-ink bg-sara-paper pb-[env(safe-area-inset-bottom)]">
      {NAV_TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            cn(
              'flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 border-r-2 border-sara-ink/10 px-0.5 py-2 last:border-r-0',
              isActive && cn(tab.activeBg, '-mt-[3px] border-t-3 border-t-sara-ink'),
            )
          }
        >
          <span className="text-xl leading-none">{tab.icon}</span>
          <span className="font-pixel text-[7px] leading-none">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
