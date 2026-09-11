export const ALLOWED_PRO_COLLECTIONS = [
  'concessions',
  'associations',
  'relais',
  'creators',
] as const;

export type ProCollection = (typeof ALLOWED_PRO_COLLECTIONS)[number];

export function isAllowedProCollection(value: string): value is ProCollection {
  return (ALLOWED_PRO_COLLECTIONS as readonly string[]).includes(value);
}

export function normalizeDomain(value: string): string {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/^www\./, '')
    .replace(/\.$/, '');
}

export function getEmailDomain(email: string): string {
  const parts = (email || '').trim().toLowerCase().split('@');
  return parts.length === 2 ? normalizeDomain(parts[1]) : '';
}

export function getWebsiteDomain(website: string): string {
  const raw = (website || '').trim();
  if (!raw) return '';

  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return normalizeDomain(url.hostname);
  } catch {
    return '';
  }
}

export function domainsMatch(emailDomain: string, websiteDomain: string): boolean {
  const email = normalizeDomain(emailDomain);
  const website = normalizeDomain(websiteDomain);

  if (!email || !website) return false;

  // V1 deliberately uses an exact domain match (after removing only "www").
  // A subdomain is treated as different and therefore falls back to manual
  // verification, which keeps the automatic signal conservative.
  return email === website;
}
