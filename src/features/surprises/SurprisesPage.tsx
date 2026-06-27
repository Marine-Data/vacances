import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Screen, Card, Button, Input } from '../../components'

export default function SurprisesPage() {
  const [code, setCode] = useState('')
  const [secret, setSecret] = useState<any>(null)
  const [error, setError] = useState('')

  async function reveal() {
    setError('')
    const { data, error: err } = await supabase.rpc('reveal_secret', { p_code: code })
    if (err || !data || data.length === 0) {
      setError('Code incorrect 🙈')
      setSecret(null)
    } else {
      setSecret(data[0])
    }
  }

  return (
    <Screen title="🎁 Surprises">
      <Card className="mb-4">
        <h3 className="font-bold mb-2">Code secret</h3>
        <Input placeholder="Entre le code..." value={code} onChange={e => setCode(e.target.value)} />
        <Button onClick={reveal} color="pink" className="mt-3 w-full">🔓 Révéler</Button>
      </Card>

      {error && <Card className="bg-sara-orange">{error}</Card>}

      {secret && (
        <Card>
          {secret.type === 'video' && <p>📹 Vidéo: <a href={secret.contenu_url}>Cliquez ici</a></p>}
          {secret.type === 'audio' && <p>🎵 Audio: <a href={secret.contenu_url}>Cliquez ici</a></p>}
          {secret.message && <p className="mt-2">{secret.message}</p>}
        </Card>
      )}
    </Screen>
  )
}
