import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'

/** Écran de connexion rétro : pseudo + mot de passe (contracts.md §5.1). */
export default function LoginScreen() {
  const { session, loading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [pseudo, setPseudo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/planning'

  // Déjà connectée → on quitte le login.
  if (!loading && session) return <Navigate to={from} replace />

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)
    const result = await login(pseudo.trim(), password)
    setSubmitting(false)
    if (result.error) setError(result.error)
    else navigate(from, { replace: true })
  }

  return (
    <div className="w-full max-w-md px-5">
      <div className="mb-6 text-center">
        <div className="text-5xl">🏖️</div>
        <h1 className="mt-3 font-pixel text-base leading-relaxed [text-shadow:2px_2px_0_rgb(var(--sara-pink))]">
          SARAILLON
        </h1>
        <p className="mt-2 font-body font-semibold text-sara-ink/70">Séjour entre amies 🌴</p>
      </div>

      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="font-body font-bold" htmlFor="pseudo">
            Ton pseudo
          </label>
          <Input
            id="pseudo"
            value={pseudo}
            onChange={(event) => setPseudo(event.target.value)}
            placeholder="ex. Chunfei"
            autoComplete="username"
            autoFocus
            required
          />

          <label className="mt-1 font-body font-bold" htmlFor="password">
            Mot de passe
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="rounded-xl border-2 border-sara-ink bg-sara-orange px-3 py-2 font-body font-bold">
              🙊 {error}
            </p>
          )}

          <Button type="submit" color="pink" disabled={submitting} className="mt-2">
            {submitting ? 'Connexion…' : '✨ Entrer'}
          </Button>
        </form>
      </Card>

      <p className="mt-4 text-center font-body text-xs font-semibold text-sara-ink/50">
        Accès réservé aux invitées 🔒
      </p>
    </div>
  )
}
