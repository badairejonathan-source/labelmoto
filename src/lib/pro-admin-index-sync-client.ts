/** Un appel ciblé après le commit Firestore ; l'historique reste pending en cas d'échec. */
export async function syncPublicIndexAfterPublish(
  user: { getIdToken(): Promise<string> } | null | undefined,
  historyId: string,
): Promise<{ synced: boolean; error?: string }> {
  if (!user) return { synced: false, error: 'Session admin absente' };
  try {
    const token = await user.getIdToken();
    const response = await fetch('/api/admin/sync-public-index', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ historyId }),
    });
    const data = await response.json();
    if (!response.ok || data.ok !== true) return { synced: false, error: String(data.error || `HTTP ${response.status}`) };
    return { synced: true };
  } catch (error) {
    return { synced: false, error: error instanceof Error ? error.message : 'Connexion indisponible' };
  }
}
