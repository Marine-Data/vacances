import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Screen, Card, Button, EmptyState } from '../../components'

export default function JeuxPage() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadAssignments()
  }, [])

  async function loadAssignments() {
    const { data } = await supabase
      .from('corvee_assignments')
      .select('prenom, tache')
      .eq('date', today)
      .order('prenom')
    
    setAssignments(data ?? [])
  }

  async function tirerCorves() {
    setLoading(true)
    try {
      const response = await fetch('https://iupghubmnibbdipingnj.supabase.co/functions/v1/tirage-corvees-daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today })
      })
      
      if (response.ok) {
        await loadAssignments()
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <Screen title="🎲 Jeux & Défis">
      <Card className="mb-4">
        <h3 className="font-bold mb-3">🎪 Corvées du jour</h3>
        <Button onClick={tirerCorves} color="pink" disabled={loading} className="w-full mb-4">
          {loading ? '...' : '🎯 Nouveau tirage'}
        </Button>
        
        {assignments.length === 0 ? (
          <EmptyState emoji="📋" title="Aucune corvée assignée" hint="Fais un tirage !" />
        ) : (
          <div className="space-y-2">
            {assignments.map((a, i) => (
              <div key={i} className="flex justify-between items-center p-2 bg-sara-paper rounded border-2 border-sara-ink">
                <span className="font-bold text-sara-pink">{a.prenom}</span>
                <span className="text-sm text-sara-ink">{a.tache}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Screen>
  )
}
