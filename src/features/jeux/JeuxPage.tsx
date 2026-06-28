import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Screen, Card, EmptyState } from '../../components'

export default function JeuxPage() {
  const [assignments, setAssignments] = useState<any[]>([])
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    supabase.from('corvee_assignments').select('prenom, tache').eq('date', today).order('prenom').then(({ data }) => {
      setAssignments(data || [])
    })
  }, [])

  return (
    <Screen title="🎲 Jeux & Corvées">
      {assignments.length === 0 ? (
        <EmptyState emoji="📋" title="Aucune corvée assignée" />
      ) : (
        <div className="space-y-2">
          {assignments.map((a: any, i: number) => (
            <Card key={i} className="p-3 flex justify-between">
              <span className="font-bold text-sara-pink">{a.prenom}</span>
              <span className="text-sm">{a.tache}</span>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  )
}
