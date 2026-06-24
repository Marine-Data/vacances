import { EmptyState, Screen } from '../../components'

/**
 * Placeholder posé par C0. La conversation C4 remplacera le contenu de CETTE page
 * (playlist Deezer, galerie photos) sans toucher App.tsx ni le kit.
 */
export default function GaleriePage() {
  return (
    <Screen title="📸 Galerie">
      <EmptyState emoji="🚧" title="Bientôt disponible !" hint="Playlist & photos arrivent 📸" />
    </Screen>
  )
}
