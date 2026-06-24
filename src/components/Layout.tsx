import { Outlet } from 'react-router-dom'
import { RetroHeader } from './RetroHeader'
import { BottomNav } from './BottomNav'

/**
 * Coquille « téléphone » (contracts.md §6.3) : conteneur max-w-md centré,
 * en-tête + zone de contenu scrollable (<Outlet />) + bottom-nav.
 * Sur grand écran, un cadre arrondi à ombre dure évoque un smartphone.
 */
export function Layout() {
  return (
    <div className="flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-sara-paper sm:h-[min(900px,94vh)] sm:rounded-[34px] sm:border-4 sm:border-sara-ink sm:shadow-hard-lg">
      <RetroHeader />
      <main className="flex-1 overflow-y-auto px-3.5 pb-6 pt-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
