import { EmptyState, Screen } from '../../components'

/**
 * Placeholder posé par C0. La conversation C1 remplacera le contenu de CETTE page
 * (liste des activités, détail, checklists, filtre) sans toucher App.tsx ni le kit.
 */
export default function PlanningPage() {
  return (
    <Screen title="📅 Planning">
      <EmptyState emoji="🚧" title="Bientôt disponible !" hint="Le planning des vacances arrive 📅" />
    </Screen>
  )
}
