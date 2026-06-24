/**
 * src/components/PushPromptBanner.tsx
 * Banneau ludique invitant l'utilisateur à activer les notifications push.
 * N'apparaît que si :
 * - Les push sont supportées
 * - La permission est à "prompt" (pas encore déterminée)
 * - L'utilisateur n'a pas encore de souscription
 */

import { useEffect, useState } from 'react'
import { cn } from '../lib/cn'
import { Button } from './Button'
import { activerNotificationsPush, isPushSupported, getPushPermissionStatus } from '../lib/push'

export function PushPromptBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Afficher le banneau si push supportées ET permission pas encore demandée
    if (isPushSupported() && getPushPermissionStatus() === 'prompt') {
      setIsVisible(true)
    }
  }, [])

  if (!isVisible) return null

  async function handleActivate() {
    setLoading(true)
    const result = await activerNotificationsPush()
    setLoading(false)

    if (result.success) {
      setIsVisible(false)
      // Toast optionnel : "Notifications activées ! 🎉"
    }
  }

  return (
    <div
      className={cn(
        'mx-3.5 mt-4 flex items-center gap-3 rounded-2xl border-2 border-sara-yellow',
        'bg-sara-yellow/20 p-3.5'
      )}
    >
      <span className="shrink-0 text-2xl">🔔</span>
      <div className="flex-1">
        <p className="font-body font-bold text-sara-ink">Reste connectée !</p>
        <p className="text-xs font-semibold text-sara-ink/70">
          Reçois les alertes même quand tu fermes l'app.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          color="paper"
          size="sm"
          onClick={() => setIsVisible(false)}
          disabled={loading}
          className="text-[11px]"
        >
          Plus tard
        </Button>
        <Button
          color="yellow"
          size="sm"
          onClick={handleActivate}
          disabled={loading}
          className="text-[11px]"
        >
          {loading ? '...' : 'Oui !'}
        </Button>
      </div>
    </div>
  )
}
