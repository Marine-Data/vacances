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
  const [editingResponsables, setEditingResponsables] = useState('')
  const [editingPetitDej, setEditingPetitDej] = useState('')

  useEffect(() => {
    loadActivities()
  }, [])

  async function loadActivities() {
    const { data } = await supabase.from('programme').select('*').order('ordre')
    setActivities(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    setFiltered(activities.filter(a => 
      a.activite.toLowerCase().includes(search.toLowerCase()) ||
      a.jour.toLowerCase().includes(search.toLowerCase())
    ))
  }, [search, activities])

  async function updateField(id: string, field: string, value: string) {
    await supabase.from('programme').update({ [field]: value }).eq('id', id)
    await loadActivities()
    if (selected?.id === id) {
      const updated = activities.find(a => a.id === id)
      if (updated) setSelected(updated)
    }
  }

  if (loading) return <Loader />

  if (!selected) {
    return (
      <Screen title="📅 Planning">
        <Input placeholder="Cherche une activité..." value={search} onChange={e => setSearch(e.target.value)} className="mb-4" />
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <EmptyState emoji="🗓️" title="Aucune activité" />
          ) : (
            filtered.map(a => (
              <Card key={a.id} tappable onClick={() => { setSelected(a); setEditingResponsables(a.responsables || ''); setEditingPetitDej(a.petit_dejeuner || ''); }}>
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
        {selected.inscription_requise && selected.lien_inscription && (
          <a href={selected.lien_inscription} target="_blank" className="text-blue-600 underline mt-2">🔗 S'inscrire</a>
        )}
        {selected.repas_concerne && <p className="mt-2">🍽️ {selected.repas_concerne}</p>}
        
        <div className="mt-4 border-t pt-3">
          <label className="text-xs font-bold">Responsables</label>
          <Input value={editingResponsables} onChange={e => setEditingResponsables(e.target.value)} className="mt-1" />
          <Button onClick={() => updateField(selected.id, 'responsables', editingResponsables)} color="green" size="sm" className="mt-2 w-full">💾 Enregistrer</Button>
        </div>

        {selected.regimes_allergies && <p className="text-xs mt-3">⚠️ {selected.regimes_allergies}</p>}
      </Card>
    </Screen>
  )
}
