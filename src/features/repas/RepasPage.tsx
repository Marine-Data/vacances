import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Screen, Card, Button, Input, Loader } from '../../components'

export default function RepasPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [newItem, setNewItem] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCourses()
    const channel = supabase.channel('courses')
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
      loadCourses()
    }).subscribe()
    return () => { void channel.unsubscribe() }
  }, [])

  async function loadCourses() {
    const { data } = await supabase.from('courses').select('*').order('created_at')
    setCourses(data ?? [])
    setLoading(false)
  }

  async function addItem() {
    if (!newItem.trim()) return
    await supabase.from('courses').insert({ libelle: newItem })
    setNewItem('')
  }

  async function toggleItem(id: string) {
    const item = courses.find(c => c.id === id)
    await supabase.from('courses').update({ is_checked: !item.is_checked }).eq('id', id)
  }

  async function deleteItem(id: string) {
    await supabase.from('courses').delete().eq('id', id)
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
          <Card key={c.id} className="flex items-center gap-2 p-3">
            <input type="checkbox" checked={c.is_checked} onChange={() => toggleItem(c.id)} />
            <span className={c.is_checked ? 'line-through opacity-50 flex-1' : 'flex-1'}>{c.libelle}</span>
            <button onClick={() => deleteItem(c.id)} className="text-red-500">✕</button>
          </Card>
        ))}
      </div>
    </Screen>
  )
}
