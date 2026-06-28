import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Screen, Card, Button, Input } from '../../components'

export default function SurprisesPage() {
  const [code, setCode] = useState('')
  const [secret, setSecret] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function reveal() {
    setError('')
    setSecret(null)
    setLoading(true)
    const { data, error: err } = await supabase.rpc('reveal_secret', { p_code: code })
    setLoading(false)
    
    if (err || !data || data.length === 0) {
      setError('Code incorrect 🙈')
    } else {
      setSecret(data[0])
    }
  }

  return (
    <Screen title="🎁 Surprises">
      <Card className="mb-4">
        <h3 className="font-bold mb-2">Code secret</h3>
        <Input placeholder="Entre le code..." value={code} onChange={e => setCode(e.target.value)} />
        <Button onClick={reveal} color="pink" className="mt-3 w-full" disabled={loading}>
          {loading ? '...' : '🔓 Révéler'}
        </Button>
      </Card>

      {error && <Card className="bg-sara-orange mb-4">{error}</Card>}

      {secret && (
        <Card>
          {secret.type === 'video' && secret.contenu_url && (
            <div>
              <p>📹 Vidéo:</p>
              <iframe src={secret.contenu_url} width="100%" height="300" className="mt-2"></iframe>
            </div>
          )}
          {secret.type === 'audio' && secret.contenu_url && (
            <div>
              <p>🎵 Audio:</p>
              <audio controls className="w-full mt-2">
                <source src={secret.contenu_url} type="audio/mpeg" />
              </audio>
            </div>
          )}
          {secret.message && <p className="mt-2 font-bold">{secret.message}</p>}
        </Card>
      )}
    </Screen>
  )
}
