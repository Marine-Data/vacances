import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'

/** Écran de connexion/inscription rétro : pseudo + mot de passe (contracts.md §5.1). */
export default function LoginScreen() {
  const { session, loading, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<'login' | 'register'>('login') // toggle entre les deux
  const [pseudo, setPseudo] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
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

    // Validation
    if (!pseudo.trim()) {
      setError('Rentre ton pseudo.')
      return
    }
    if (!password) {
      setError('Rentre un mot de passe.')
      return
    }

    if (mode === 'register') {
      if (password !== passwordConfirm) {
        setError('Les mots de passe ne correspondent pas.')
        return
      }
      if (password.length < 6) {
        setError('Le mot de passe doit faire au moins 6 caractères.')
        return
      }
    }

    setSubmitting(true)
    const result =
      mode === 'login'
        ? await login(pseudo.trim(), password)
        : await register(pseudo.trim(), password)
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
          {/* Toggle mode */}
          <div className="mb-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setError(null)
                setPasswordConfirm('')
              }}
              className={`flex-1 py-2 font-body font-bold rounded-lg border-2 transition-colors ${
                mode === 'login'
                  ? 'border-sara-ink bg-sara-blue text-sara-ink'
                  : 'border-sara-ink/30 bg-white text-sara-ink/50'
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setError(null)
                setPasswordConfirm('')
              }}
              className={`flex-1 py-2 font-body font-bold rounded-lg border-2 transition-colors ${
                mode === 'register'
                  ? 'border-sara-ink bg-sara-pink text-sara-ink'
                  : 'border-sara-ink/30 bg-white text-sara-ink/50'
              }`}
            >
              S'inscrire
            </button>
          </div>

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
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
          />

          {mode === 'register' && (
            <>
              <label className="mt-1 font-body font-bold" htmlFor="passwordConfirm">
                Confirme le mot de passe
              </label>
              <Input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </>
          )}

          {error && (
            <p className="rounded-xl border-2 border-sara-ink bg-sara-orange px-3 py-2 font-body font-bold text-sara-ink">
              🙊 {error}
            </p>
          )}

          <Button
            type="submit"
            color={mode === 'login' ? 'blue' : 'pink'}
            disabled={submitting}
            className="mt-2"
          >
            {submitting
              ? mode === 'login'
                ? 'Connexion…'
                : 'Inscription…'
              : mode === 'login'
                ? '✨ Entrer'
                : '✨ Créer mon compte'}
          </Button>
        </form>
      </Card>

      <p className="mt-4 text-center font-body text-xs font-semibold text-sara-ink/50">
        App privée • Inscription ouverte 🔓
      </p>
    </div>
  )
}
