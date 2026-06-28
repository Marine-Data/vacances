import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Screen, Card, EmptyState } from '../../components'

export default function GaleriePage() {
  const [photos, setPhotos] = useState<any[]>([])

  useEffect(() => {
    loadPhotos()
  }, [])

  async function loadPhotos() {
    const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false })
    setPhotos(data ?? [])
  }

  return (
    <Screen title="📸 Galerie">
      <div className="mb-4">
        <iframe src="https://widget.deezer.com/widget/light/playlist/1234567890" width="100%" height="100" frameBorder="0" allowTransparency allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
      </div>

      {photos.length === 0 ? (
        <EmptyState emoji="📸" title="Aucune photo" hint="Viendront bientôt !" />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {photos.map(p => (
            <Card key={p.id}>
              <p className="text-xs">{p.caption || 'Photo'}</p>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  )
}
