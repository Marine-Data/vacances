/**
 * src/components/PushToggleButton.tsx
 * Bouton du header pour activer/désactiver les notifications push.
 * Affiche l'état actuel et permet de basculer.
 */

import { useEffect, useState } from 'react'
import {
  activerNotificationsPush,
  desactiverNotificationsPush,
  isPushSubscribed,
  isPushSupported,
} from '../lib/push'

interface PushToggleButtonProps {
  onToggle?: (enabled: boolean) => void
}

export function PushToggleButton({ onToggle }: PushToggleButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isPushSupported()) return

    isPushSubscribed().then(setIsSubscribed).catch(console.error)
  }, [])

  async function handleToggle() {
    setLoading(true)
    setError(null)

    const result = isSubscribed
      ? await desactiverNotificationsPush()
      : await activerNotificationsPush()

    setLoading(false)

    if (result.success) {
      setIsSubscribed(!isSubscribed)
      onToggle?.(!isSubscribed)
    } else {
      setError(result.error || 'Erreur inconnue')
      // Afficher le toast d'erreur à l'utilisateur
    }
  }

  if (!isPushSupported()) return null

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="rounded-lg border-2 border-sara-ink bg-sara-paper px-3 py-2 text-sm font-semibold text-sara-ink transition-colors hover:bg-sara-pink/10 active:translate-x-0.5 active:translate-y-0.5"
      title={isSubscribed ? 'Désactiver les notifications' : 'Activer les notifications'}
    >
      {loading ? '⏳' : isSubscribed ? '🔔' : '🔕'}
    </button>
  )
}
