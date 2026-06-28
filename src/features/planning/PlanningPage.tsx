import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Screen, Card, Button, Input, EmptyState, Loader } from '../../components'
import type { Programme } from '../../lib/db'

type View = 'weekly' | 'daily'

export default function PlanningPage() {
  const [view, setView] = useState<View>('weekly')
  const [activities, setActivities] = useState<Programme[]>([])
  const [search, setSearch] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedActivity, setSelectedActivity] = useState<Programme | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActivities()
  }, [])

  async function loadActivities() {
    const { data } = await supabase.from('programme').select('*').order('ordre')
    setActivities(data ?? [])
    setLoading(false)
  }

  const filtered = activities.filter(a =>
    a.activite.toLowerCase().includes(search.toLowerCase()) ||
    a.jour.toLowerCase().includes(search.toLowerCase())
  )

  // Grouper par jour pour la vue semainier
  const groupedByDay = filtered.reduce((acc: Record<string, Programme[]>, a) => {
    if (!acc[a.jour]) acc[a.jour] = []
    acc[a.jour].push(a)
    return acc
  }, {})

  // Activités du jour sélectionné
  const todayActivities = filtered.filter(a => {
    const activityDate = activities
      .filter(x => x.jour === a.jour)
      .sort((x, y) => x.ordre - y.ordre)
      .findIndex(x => x.id === a.id)
    return a.jour === selectedDate
  })

  if (loading) return <Loader />

  if (selectedActivity) {
    return (
      <Screen title="📅 Détail">
        <Button onClick={() => setSelectedActivity(null)} color="paper" size="sm" className="mb-4">← Retour</Button>
        <Card>
          <h2 className="font-bold text-lg">{selectedActivity.activite}</h2>
          <p className="text-sm mt-2">{selectedActivity.jour} • {selectedActivity.horaires}</p>
          {selectedActivity.lieu_details && <p className="mt-2">📍 {selectedActivity.lieu_details}</p>}
          {selectedActivity.inscription_requise && selectedActivity.lien_inscription && (
            <a href={selectedActivity.lien_inscription} target="_blank" className="text-blue-600 underline mt-2 block">
              🔗 S'inscrire
            </a>
          )}
          {selectedActivity.repas_concerne && <p className="mt-2">🍽️ {selectedActivity.repas_concerne}</p>}
          {selectedActivity.regimes_allergies && <p className="text-xs mt-3">⚠️ {selectedActivity.regimes_allergies}</p>}
        </Card>
      </Screen>
    )
  }

  return (
    <Screen title="📅 Planning">
      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => setView('weekly')}
          color={view === 'weekly' ? 'blue' : 'paper'}
          size="sm"
          className="flex-1"
        >
          📅 Semaine
        </Button>
        <Button
          onClick={() => setView('daily')}
          color={view === 'daily' ? 'blue' : 'paper'}
          size="sm"
          className="flex-1"
        >
          📆 Jour
        </Button>
      </div>

      {view === 'weekly' ? (
        <div className="space-y-4">
          <Input placeholder="Cherche une activité..." value={search} onChange={e => setSearch(e.target.value)} />
          {Object.keys(groupedByDay).length === 0 ? (
            <EmptyState emoji="🗓️" title="Aucune activité" />
          ) : (
            Object.keys(groupedByDay).map(day => (
              <div key={day}>
                <p className="font-bold text-sara-blue mb-2">{day}</p>
                <div className="space-y-2">
                  {groupedByDay[day].map(a => (
                    <Card key={a.id} tappable onClick={() => setSelectedActivity(a)}>
                      <p className="font-bold text-sm">{a.activite}</p>
                      <p className="text-xs opacity-60">{a.horaires}</p>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border-3 border-sara-ink rounded-xl"
          />
          {activities.filter(a => a.jour === selectedDate).length === 0 ? (
            <EmptyState emoji="📆" title="Aucune activité ce jour" />
          ) : (
            <div className="space-y-2">
              {activities
                .filter(a => a.jour === selectedDate)
                .sort((a, b) => a.ordre - b.ordre)
                .map(a => (
                  <Card key={a.id} tappable onClick={() => setSelectedActivity(a)}>
                    <p className="font-bold">{a.activite}</p>
                    <p className="text-sm opacity-60">{a.horaires}</p>
                  </Card>
                ))}
            </div>
          )}
        </div>
      )}
    </Screen>
  )
}
