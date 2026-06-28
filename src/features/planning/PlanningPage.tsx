import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Screen, Card, Button, Input, EmptyState, Loader } from '../../components'
import type { Programme } from '../../lib/db'

export default function PlanningPage() {
  const [activities, setActivities] = useState<Programme[]>([])
  const [view, setView] = useState<'weekly' | 'daily'>('weekly')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('programme').select('*').order('ordre').then(({ data }) => {
      setActivities(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <Loader />

  const filtered = activities.filter(a =>
    a.activite.toLowerCase().includes(search.toLowerCase())
  )

  const byDay = filtered.reduce((acc: Record<string, Programme[]>, a) => {
    if (!acc[a.jour]) acc[a.jour] = []
    acc[a.jour].push(a)
    return acc
  }, {})

  return (
    <Screen title="📅 Planning">
      <div className="flex gap-2 mb-4">
        <Button onClick={() => setView('weekly')} color={view === 'weekly' ? 'blue' : 'paper'} size="sm" className="flex-1">📅 Semaine</Button>
        <Button onClick={() => setView('daily')} color={view === 'daily' ? 'blue' : 'paper'} size="sm" className="flex-1">📆 Jour</Button>
      </div>

      <Input placeholder="Cherche..." value={search} onChange={e => setSearch(e.target.value)} className="mb-4" />

      {view === 'weekly' ? (
        <div className="space-y-4">
          {Object.keys(byDay).length === 0 ? (
            <EmptyState emoji="🗓️" title="Aucune activité" />
          ) : (
            Object.entries(byDay).map(([day, acts]) => (
              <div key={day}>
                <p className="font-bold text-sara-blue mb-2">{day}</p>
                <div className="space-y-1">
                  {acts.map(a => (
                    <Card key={a.id} className="p-2">
                      <p className="text-sm font-bold">{a.activite}</p>
                      <p className="text-xs opacity-60">{a.horaires}</p>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <EmptyState emoji="📆" title="Aucune activité" />
          ) : (
            filtered.map(a => (
              <Card key={a.id} className="p-2">
                <p className="font-bold">{a.activite}</p>
                <p className="text-xs opacity-60">{a.jour} • {a.horaires}</p>
              </Card>
            ))
          )}
        </div>
      )}
    </Screen>
  )
}
