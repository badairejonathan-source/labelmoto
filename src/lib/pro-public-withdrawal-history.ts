/**
 * Historique PRIVÉ des retraits publics Label Moto.
 * Ne contient ni email, ni téléphone, ni justificatif, ni copie de la fiche.
 * L'API administrateur est le seul lecteur prévu.
 */
export const WITHDRAWAL_HISTORY_COLLECTION = 'admin_public_withdrawal_history';
export type WithdrawalReason = 'owner_request' | 'other';
export type WithdrawalStatus = 'pending_review' | 'sources_removed_to_verify';
export type WithdrawalHistoryView = {
  id: string;
  collection: string;
  docId: string;
  title: string;
  city: string;
  oldPath: string;
  reason: WithdrawalReason;
  status: WithdrawalStatus;
  createdAt: number;
  verifiedAt: number | null;
};

type RefTarget = {collection:string; id:string};
const safeText = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';
const safeSlug = (value:unknown) => typeof value==='string' && /^[a-zA-Z0-9_.-]{1,200}$/.test(value) ? value : '';

export function buildWithdrawalHistory(
 target: RefTarget, source: Record<string, unknown>, adminUid: string,
 reason: WithdrawalReason, now = Date.now(),
) {
 if (reason !== 'owner_request' && reason !== 'other') throw new Error('WITHDRAWAL_REASON_REQUIRED');
 const slug = safeSlug(source.slug);
 return {
  collection: target.collection,
  docId: target.id,
  title: safeText(source.title, 160) || target.id,
  city: safeText(source.city, 100) || safeText(source.ville, 100) || '',
  oldPath: `/${target.collection}/${slug || target.id}`,
  reason,
  status: 'pending_review' as WithdrawalStatus,
  createdAt: now,
  verifiedAt: null as number | null,
  adminUid,
 };
}

/** Liste à champs strictement autorisés ; jamais originalMainDoc ni candidateMedia. */
export function toWithdrawalHistoryView(id: string, value: Record<string,unknown>): WithdrawalHistoryView | null {
 const collection=safeText(value.collection,80);
 const docId=safeText(value.docId,200);
 const status=value.status;
 if (!collection || !docId || (status!=='pending_review' && status!=='sources_removed_to_verify')) return null;
 const reason=value.reason==='owner_request'?'owner_request':'other';
 const oldPath=safeText(value.oldPath,300);
 return {
  id,collection,docId,
  title:safeText(value.title,160)||docId,
  city:safeText(value.city,100),
  oldPath:oldPath.startsWith('/')&&!oldPath.startsWith('//')?oldPath:'',
  reason,status,
  createdAt:typeof value.createdAt==='number'&&Number.isFinite(value.createdAt)?value.createdAt:0,
  verifiedAt:typeof value.verifiedAt==='number'&&Number.isFinite(value.verifiedAt)?value.verifiedAt:null,
 };
}
