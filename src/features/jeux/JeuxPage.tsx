import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Screen, Card, Button, EmptyState } from '../../components'

export default function JeuxPage() {
  const [defiTexte, setDefiTexte] = useState('')
  const [corveeTexte, setCorveeTexte] = useState('')
  const [prenomTexte, setPrenomTexte] = useState('')
  const [loading, setLoading] = useState(false)

  async function tirerDefi() {
    setLoading(true)
    const { data, error } = await supabase
      .from('defis')
      .select('texte')
      .eq('actif', true)
      .limit(1)
    
    if (!error && data?.length) {
      const random = data[Math.floor(Math.random() * data.length)]
      setDefiTexte(random.texte)
    }
    setLoading(false)
  }

  async function tirerLoto() {
    setLoading(true)
    const { data: corvees } = await supabase.from('corvees').select('tache')
    const { data: equipe } = await supabase.from('equipe').select('prenom')
    
    if (corvees?.length && equipe?.length) {
      setCorveeTexte(corvees[Math.floor(Math.random() * corvees.length)].tache)
      setPrenomTexte(equipe[Math.floor(Math.random() * equipe.length)].prenom)
    }
    setLoading(false)
  }

  return (
    <Screen title="🎲 Jeux & Défis">
      <div className="space-y-4">
        <Card>
          <h3 className="font-bold mb-3">📢 Défi du jour</h3>
          {defiTexte && <p className="text-lg font-bold text-sara-yellow mb-3">{defiTexte}</p>}
          <Button onClick={tirerDefi} color="yellow" disabled={loading} className="w-full">
            {loading ? '...' : '🎲 Nouveau défi'}
          </Button>
        </Card>

        <Card>
          <h3 className="font-bold mb-3">🎪 Loto corvées</h3>
          {corveeTexte && (
            <div className="space-y-2 mb-3">
              <p className="text-sm">📝 Corvée: <span className="font-bold">{corveeTexte}</span></p>
              <p className="text-sm">👤 Assignée à: <span className="font-bold text-sara-pink">{prenomTexte}</span></p>
            </div>
          )}
          <Button onClick={tirerLoto} color="pink" disabled={loading} className="w-full">
            {loading ? '...' : '🎯 Tirage'}
          </Button>
        </Card>
      </div>
    </Screen>
  )
}
