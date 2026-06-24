import { EmptyState, Screen } from '../../components'

/**
 * Placeholder posé par C0. La conversation C2 remplacera le contenu de CETTE page
 * (défi du jour, loto corvées) sans toucher App.tsx ni le kit.
 */
export default function JeuxPage() {
  return (
    <Screen title="🎲 Jeux & Défis">
      <EmptyState emoji="🚧" title="Bientôt disponible !" hint="Défis & loto corvées en approche 🎲" />
    </Screen>
  )
}
