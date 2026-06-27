import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Screen, Card, Button, Input, Loader } from '../../components'

export default function RepasPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [newItem, setNewItem] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourses()
    const sub = supabase.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'courses'
    }, () => loadCourses()).subscribe()
    return () => sub.unsubscribe()
  }, [])

  async function loadCourses() {
    const { data } = await supabase.from('courses').select('*')
    setCourses(data ?? [])
    setLoading(false)
  }

  async function addItem() {
    if (!newItem.trim()) return
    await supabase.from('courses').insert({ libelle: newItem })
    setNewItem('')
    await loadCourses()
  }

  async function toggleItem(id: string) {
    const item = courses.find(c => c.id === id)
    await supabase.from('courses').update({ is_checked: !item.is_checked }).eq('id', id)
    await loadCourses()
  }

  if (loading) return <Loader />

  return (
    <Screen title="🍽️ Repas & Courses">
      <Card className="mb-4">
        <h3 className="font-bold mb-2">📝 Liste de courses</h3>
        <div className="flex gap-2">
          <Input placeholder="Ajouter..." value={newItem} onChange={e => setNewItem(e.target.value)} />
          <Button onClick={addItem} color="blue" size="sm">✓</Button>
        </div>
      </Card>

      <div className="space-y-2">
        {courses.map(c => (
          <Card key={c.id} className="flex items-center gap-2">
            <input type="checkbox" checked={c.is_checked} onChange={() => toggleItem(c.id)} />
            <span className={c.is_checked ? 'line-through opacity-50' : ''}>{c.libelle}</span>
          </Card>
        ))}
      </div>
    </Screen>
  )
}
