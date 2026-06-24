import { EmptyState, Screen } from '../../components'

/**
 * Placeholder posé par C0. La conversation C5 remplacera le contenu de CETTE page
 * (code secret → vidéo/audio via la RPC reveal_secret) sans toucher App.tsx ni le kit.
 */
export default function SurprisesPage() {
  return (
    <Screen title="🎁 Surprises">
      <EmptyState emoji="🚧" title="Bientôt disponible !" hint="Les surprises se préparent 🎁" />
    </Screen>
  )
}
