import { EmptyState, Screen } from '../../components'

/**
 * Placeholder posé par C0. La conversation C3 remplacera le contenu de CETTE page
 * (repas, liste de courses temps réel) sans toucher App.tsx ni le kit.
 */
export default function RepasPage() {
  return (
    <Screen title="🍽️ Repas & Courses">
      <EmptyState emoji="🚧" title="Bientôt disponible !" hint="Repas & liste de courses arrivent 🍽️" />
    </Screen>
  )
}
