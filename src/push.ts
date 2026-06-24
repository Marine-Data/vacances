/**
 * src/lib/push.ts — Gestion des Web Push Notifications (Saraillon)
 * 
 * Contient :
 * - activerNotificationsPush() : demande la permission + subscribe
 * - desactiverNotificationsPush() : unsubscribe + supprime de la DB
 * - getPushPermissionStatus() : état actuel de la permission
 * - initPushServiceWorker() : enregistre le SW au démarrage
 */

import { supabase } from './supabase'

const VAPID_PUBLIC_KEY =
  'BAO4cgcv8VL1tm6fKUjmq3g2saho_h5lMdj6tvmatvBF7WAZctesCVaUNZGfpOI9258QeyW3PhFE-EOWPyyLooI'

/**
 * Convertir une clé VAPID base64 en Uint8Array pour l'API PushManager.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

/**
 * Vérifier si le navigateur supporte les notifications push.
 */
export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

/**
 * Récupérer l'état actuel de la permission de notification.
 */
export function getPushPermissionStatus(): NotificationPermission | 'unsupported' {
  if (!isPushSupported()) return 'unsupported'
  return Notification.permission
}

/**
 * Enregistrer le Service Worker au démarrage de l'app.
 */
export async function initPushServiceWorker(): Promise<void> {
  if (!isPushSupported()) {
    console.warn('Push notifications non supportées sur cet appareil.')
    return
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })
    console.log('Service Worker enregistré:', registration)
  } catch (error) {
    console.error('Erreur lors de l'enregistrement du Service Worker:', error)
  }
}

/**
 * Activer les notifications push.
 * 1. Demander la permission à l'utilisateur
 * 2. S'abonner à PushManager
 * 3. Sauvegarder la souscription dans Supabase
 */
export async function activerNotificationsPush(): Promise<{ success: boolean; error?: string }> {
  // Vérification préalable
  const { data: authData } = await supabase.auth.getSession()
  if (!authData.session) {
    return { success: false, error: 'Connecte-toi pour activer les notifications.' }
  }

  if (!isPushSupported()) {
    return {
      success: false,
      error: 'Les notifications ne sont pas supportées sur cet appareil.',
    }
  }

  try {
    // 1. Demander la permission
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      return {
        success: false,
        error: 'Permission refusée. Tu peux la réactiver dans les réglages du navigateur.',
      }
    }

    // 2. S'abonner au push
    const registration = await navigator.serviceWorker.ready
    let subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
    }

    // 3. Sauvegarder dans Supabase
    const keys = subscription.toJSON().keys as Record<string, string>
    const { error } = await supabase.from('push_subscriptions').upsert(
      [
        {
          user_id: authData.session.user.id,
          endpoint: subscription.endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
          user_agent: navigator.userAgent,
        },
      ],
      { onConflict: 'endpoint' }
    )

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de l'activation des notifications:', error)
    return {
      success: false,
      error: 'Impossible d'activer les notifications. Réessaie plus tard.',
    }
  }
}

/**
 * Désactiver les notifications push.
 * 1. Unsubscribe du PushManager
 * 2. Supprimer la souscription de Supabase
 */
export async function desactiverNotificationsPush(): Promise<{ success: boolean; error?: string }> {
  const { data: authData } = await supabase.auth.getSession()
  if (!authData.session) {
    return { success: false, error: 'Connecte-toi pour gérer les notifications.' }
  }

  if (!isPushSupported()) {
    return { success: false, error: 'Les notifications ne sont pas supportées.' }
  }

  try {
    // 1. Unsubscribe du PushManager
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      await subscription.unsubscribe()

      // 2. Supprimer de Supabase
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', subscription.endpoint)
    }

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la désactivation des notifications:', error)
    return {
      success: false,
      error: 'Impossible de désactiver les notifications.',
    }
  }
}

/**
 * Vérifier si cette utilisatrice est actuellement abonnée aux push (sur cet appareil).
 */
export async function isPushSubscribed(): Promise<boolean> {
  if (!isPushSupported()) return false

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    return subscription !== null
  } catch {
    return false
  }
}
