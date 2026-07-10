export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', name, params);
  }
}
