import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Screen, Card, Loader, EmptyState } from '../../components'
import { useAuth } from '../../lib/auth'

export default function GaleriePage() {
  const { user } = useAuth()
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadPhotos()
  }, [])

  async function loadPhotos() {
    const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false })
    setPhotos(data ?? [])
    setLoading(false)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!user || !e.target.files?.[0]) return
    setUploading(true)

    const file = e.target.files[0]
    const path = `${user.id}/${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase.storage.from('photos').upload(path, file)

    if (!uploadError) {
      await supabase.from('photos').insert({ storage_path: path, uploaded_by: user.id })
      await loadPhotos()
    }
    setUploading(false)
  }

  if (loading) return <Loader />

  return (
    <Screen title="📸 Galerie">
      <Card className="mb-4">
        <h3 className="font-bold">Upload une photo</h3>
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="mt-2" />
      </Card>

      {photos.length === 0 ? (
        <EmptyState emoji="📸" title="Aucune photo" />
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
