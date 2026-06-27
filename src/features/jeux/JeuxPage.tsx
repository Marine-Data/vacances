import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Screen, Card, Button, EmptyState } from '../../components'

export default function JeuxPage() {
  const [defi, setDefi] = useState<any>(null)
  const [corvee, setCorvee] = useState<any>(null)

  async function tirerDefi() {
    const { data: defis } = await supabase.from('defis').select('*').eq('actif', true)
    if (defis && defis.length > 0) {
      setDefi(defis[Math.floor(Math.random() * defis.length)])
    }
  }

  async function tirerCorvee() {
    const { data: corvees } = await supabase.from('corvees').select('*')
    const { data: team } = await supabase.from('equipe').select('*')
    if (corvees && team) {
      setCorvee({
        tache: corvees[Math.floor(Math.random() * corvees.length)],
        prenom: team[Math.floor(Math.random() * team.length)]
      })
    }
  }

  return (
    <Screen title="🎲 Jeux & Défis">
      <Card className="mb-4">
        <h3 className="font-bold mb-2">Défi du jour</h3>
        {defi ? (
          <p className="text-lg">{defi.texte} 🎯</p>
        ) : (
          <EmptyState emoji="🎲" title="Tire un défi" />
        )}
        <Button onClick={tirerDefi} color="yellow" className="mt-4">🎲 Nouveau défi</Button>
      </Card>

      <Card>
        <h3 className="font-bold mb-2">Loto corvées</h3>
        {corvee ? (
          <div className="text-lg">
            <p>Tâche: {corvee.tache.tache}</p>
            <p>Assignée à: {corvee.prenom.prenom}</p>
          </div>
        ) : (
          <EmptyState emoji="🎰" title="Tire une corvée" />
        )}
        <Button onClick={tirerCorvee} color="green" className="mt-4">🎰 Tirage</Button>
      </Card>
    </Screen>
  )
}
