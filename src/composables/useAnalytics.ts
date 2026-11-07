/**
 * Composable for Google Analytics event tracking
 * Respects cookie consent - only tracks if consent is granted
 */

export const useAnalytics = () => {
  const hasConsent = (): boolean => {
    const consent = localStorage.getItem('fortu_cookie_consent')
    return consent === 'accepted'
  }

  const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    // Only track if consent is granted and gtag is available
    if (!hasConsent() || !(window as any).gtag) {
      return
    }

    try {
      ;(window as any).gtag('event', eventName, eventParams || {})
    } catch (error) {
      console.error('Failed to track analytics event:', error)
    }
  }

  /** Meta Pixel standard event (e.g. 'Contact'). Same consent rule as GA. */
  const trackPixel = (eventName: string, eventParams?: Record<string, any>) => {
    if (!hasConsent() || !(window as any).fbq) return
    try {
      ;(window as any).fbq('track', eventName, eventParams || {})
    } catch (error) {
      console.error('Failed to track pixel event:', error)
    }
  }

  return {
    trackEvent,
    trackPixel,
    hasConsent,
  }
}

