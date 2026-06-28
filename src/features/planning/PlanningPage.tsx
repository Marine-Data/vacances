import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Screen, Card, EmptyState, Loader } from '../../components'

export default function PlanningPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('programme').select('*').order('ordre').then(({ data }) => {
      setActivities(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <Loader />

  return (
    <Screen title="📅 Planning">
      {activities.length === 0 ? (
        <EmptyState emoji="🗓️" title="Aucune activité" />
      ) : (
        <div className="space-y-2">
          {activities.map((a: any) => (
            <Card key={a.id} className="p-2">
              <p className="font-bold text-sm">{a.activite}</p>
              <p className="text-xs opacity-60">{a.jour} • {a.horaires}</p>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  )
}
