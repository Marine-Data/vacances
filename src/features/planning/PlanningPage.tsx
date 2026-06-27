import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Screen, Card, Button, Input, EmptyState, Loader } from '../../components'
import type { Programme } from '../../lib/db'

export default function PlanningPage() {
  const [activities, setActivities] = useState<Programme[]>([])
  const [filtered, setFiltered] = useState<Programme[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Programme | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('programme').select('*').order('ordre').then(({ data }) => {
      setActivities(data ?? [])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    setFiltered(activities.filter(a => 
      a.activite.toLowerCase().includes(search.toLowerCase())
    ))
  }, [search, activities])

  if (loading) return <Loader />

  if (!selected) {
    return (
      <Screen title="📅 Planning">
        <Input placeholder="Cherche..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="mt-4 space-y-2">
          {filtered.length === 0 ? (
            <EmptyState emoji="🗓️" title="Aucune activité" />
          ) : (
            filtered.map(a => (
              <Card key={a.id} tappable onClick={() => setSelected(a)}>
                <p className="font-bold">{a.activite}</p>
                <p className="text-sm opacity-60">{a.jour} • {a.horaires}</p>
              </Card>
            ))
          )}
        </div>
      </Screen>
    )
  }

  return (
    <Screen title="📅 Détail">
      <Button onClick={() => setSelected(null)} color="paper" size="sm" className="mb-4">← Retour</Button>
      <Card>
        <h2 className="font-bold text-lg">{selected.activite}</h2>
        <p className="text-sm mt-2">{selected.jour} • {selected.horaires}</p>
        {selected.lieu_details && <p className="mt-2">📍 {selected.lieu_details}</p>}
      </Card>
    </Screen>
  )
}
