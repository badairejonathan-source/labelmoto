const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Événement standard via gtag (chargé dans layout)
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', name, params);
  }
}

// Événement garanti via sendBeacon — obligatoire pour tel: et liens externes
export function trackBeacon(
  name: string,
  params?: Record<string, string | number | boolean>
) {
  if (!GA_ID || typeof window === 'undefined' || !navigator.sendBeacon) return;
  try {
    const clientId = (() => {
      const m = document.cookie.match(/_ga=GA\d+\.\d+\.( \d+\.\d+)/);
      return m ? m[1] : `anon-${Math.random().toString(36).slice(2)}`;
    })();
    const qs = new URLSearchParams({
      v: '2',
      tid: GA_ID,
      cid: clientId,
      en: name,
      ...Object.entries(params || {}).reduce((acc, [k, v]) => {
        acc[`ep.${k}`] = String(v);
        return acc;
      }, {} as Record<string, string>),
    });
    navigator.sendBeacon(`https://www.google-analytics.com/g/collect?${qs}`);
  } catch {
    // silencieux
  }
}
