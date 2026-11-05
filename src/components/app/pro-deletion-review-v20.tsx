'use client';

import React, { useState } from 'react';
import { Trash2, AlertTriangle, ShieldCheck, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DeletionDecisionV20, ProDeletionReviewV20 } from '@/lib/pro-deletion-review-v20';

const LABELS: Record<DeletionDecisionV20, string> = {
  DEMO_CIBLEE: 'Testé sur émulateurs',
  PRESERVER: 'Préserver',
  EXAMEN_MANUEL: 'Examen administratif',
  NON_INVENTORIE: 'Non inventorié',
  REPORTE: 'Reporté',
};

const COUNT_LABELS: Record<string, string> = {
  fichePrincipale: 'Fiche principale',
  statistiquesMensuelles: 'Statistiques individuelles',
  statistiquesAmbigues: 'Statistiques ambiguës',
  cacheLive: 'Cache de carte',
  historique: 'Historique',
  soumissionsAvecCopies: 'Soumissions rattachées',
  demandesModification: 'Revendications rattachées',
  demandesImagesLieesAuSlug: 'Demandes d’images (partiel)',
  sousCollectionsDirectes: 'Sous-collections directes',
};

type Props = Readonly<{
  title: string;
  collection: string;
  id: string;
  report: ProDeletionReviewV20 | null;
  loading: boolean;
  error: string;
  onPreview: () => void;
  publicPreview: {
    fichePresente:boolean;cacheLivePresente:boolean;cacheLiveConflit:boolean;
    indexes:{path:string;entreesRetirables:number}[];
    urlsImagesPossibles:number;nonVerifies:string[];actionAutorisee:boolean;
    mediaAudit?:{urlsFiche:number;urlsSousControleLabelMoto:number;demandesImagesLiees:number;
      demandesActivesAExaminer:number;verificationIncomplete:boolean;retraitBloque:boolean};
  } | null;
  publicPreviewLoading:boolean;
  publicPreviewError:string;
  publicApplying:boolean;
  publicApplyError:string;
  publicResult:{ok:boolean;fullyInvisibleOnInternet:boolean;remaining:string[]} | null;
  onPublicPreview:()=>void;
  onPublicApply:(reason:'owner_request'|'other')=>void;
  onClose: () => void;
}>;

function countText(value: number | null | undefined): string {
  return value === null || value === undefined ? 'Non évalué' : String(value);
}

/**
 * V20.2 — Revue compacte sans action de suppression, sans appel réseau autonome.
 * Le consentement porte exclusivement sur l'action de lecture onPreview.
 * Les resultats demeurent partiels ; aucun zero ne prouve une absence de donnees.
 */
export default function ProDeletionReviewV20({ title, collection, id, report, loading, error, onPreview, onClose,
  publicPreview, publicPreviewLoading, publicPreviewError, publicApplying, publicApplyError, publicResult,
  onPublicPreview, onPublicApply }: Props) {
  const [consentReads, setConsentReads] = useState(false);
  const [consentPublicReads,setConsentPublicReads] = useState(false);
  const [ackRemaining,setAckRemaining] = useState(false);
  const [confirmation,setConfirmation] = useState('');
  const [reason,setReason] = useState<'owner_request'|'other'>('owner_request');
  const confirmationExpected=`RETIRER_PUBLIC:${collection}/${id}`;
  const counts = report?.counts;
  const claims = counts?.demandesModification;
  const submissions = counts?.soumissionsAvecCopies;
  const ambiguous = counts?.statistiquesAmbigues;
  const subcollections = counts?.sousCollectionsDirectes;
  const warnings = report ? [...new Set([...report.coverage.avertissements, ...report.issues])] : [];
  const hasLinkedClaims = typeof claims === 'number' && claims > 0;
  const hasLinkedSubmissions = typeof submissions === 'number' && submissions > 0;
  const hasAmbiguous = typeof ambiguous === 'number' && ambiguous > 0;
  const hasSubcollections = typeof subcollections === 'number' && subcollections > 0;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-3 sm:p-6" role="presentation"
      onMouseDown={e => { if (!publicApplying && e.target === e.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="v20-title"
        onKeyDown={e => { if (e.key === 'Escape' && !publicApplying) onClose(); }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background p-4 sm:p-6 shadow-xl text-left">
        <header className="flex items-start gap-3 mb-3">
          <Trash2 aria-hidden="true" className="h-6 w-6 shrink-0 text-red-600" />
          <div className="min-w-0 flex-1">
            <h2 id="v20-title" className="font-bold text-base">Revue avant suppression</h2>
            <p className="text-sm font-semibold break-words">{title}</p>
            <p className="text-xs text-muted-foreground break-all">{collection}/{id}</p>
          </div>
        </header>

        <div role="status" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-900 text-xs mb-3">
          <p className="font-bold">Retrait public contrôlé</p>
          <p>La suppression réelle reste bloquée par défaut côté serveur. Le retrait des sources ne garantit pas la disparition des médias et des copies Google.</p>
        </div>

        {report && (
          <div className="rounded-xl border p-3 mb-3 space-y-3">
            <div>
              <h3 className="text-sm font-bold">Bilan du pré-audit partiel</h3>
              <p className="text-xs text-muted-foreground">Données repérées, sans garantie d'exhaustivité.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Fiche', value: counts?.fichePrincipale },
                { label: 'Stats individuelles', value: counts?.statistiquesMensuelles },
                { label: 'Revendications', value: claims },
                { label: 'Soumissions', value: submissions },
              ].map(item => (
                <div key={item.label} className="rounded-lg bg-muted/40 border px-2 py-2 min-w-0">
                  <p className="text-lg font-bold tabular-nums">{countText(item.value)}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <p className="font-bold flex items-center gap-2 mb-1"><AlertTriangle aria-hidden="true" className="h-4 w-4"/> Points nécessitant un examen</p>
              {hasLinkedClaims && <p>• {countText(claims)} revendication(s) rattachée(s) : dossier administratif à examiner.</p>}
              {hasLinkedSubmissions && <p>• {countText(submissions)} soumission(s) rattachée(s) : copies administratives à examiner.</p>}
              {hasAmbiguous && <p>• {countText(ambiguous)} statistique(s) ambiguë(s) : traitement suspendu.</p>}
              {hasSubcollections && <p>• {countText(subcollections)} sous-collection(s) : nettoyage reporté, suppression bloquée.</p>}
              {!hasLinkedClaims && !hasLinkedSubmissions && !hasAmbiguous && !hasSubcollections &&
                <p>Aucun de ces blocages n'est chiffré ici ; d'autres éléments peuvent rester à examiner.</p>}
              <p className="mt-2">Aucune suppression n'est autorisée, même si tous les compteurs affichent zéro.</p>
            </div>
          </div>
        )}

        <div className="rounded-xl border px-3 py-3 mb-3 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="h-4 w-4"/>
            <h3 className="font-bold text-sm">Pré-audit facultatif — lecture seule</h3>
          </div>
          <p className="text-xs text-muted-foreground">Interroge Firestore uniquement sur demande. Le nombre de lectures et le coût éventuel ne sont pas connus à l'avance. Aucun contrôle automatique.</p>
          <label className="flex items-start gap-2 text-xs cursor-pointer">
            <input type="checkbox" checked={consentReads} onChange={e => setConsentReads(e.target.checked)} className="mt-0.5" />
            <span>J'autorise les lectures Firebase du pré-audit, susceptibles d'être facturées.</span>
          </label>
          <Button type="button" variant="outline" className="w-full" disabled={true} onClick={onPreview}>
            {loading ? 'Contrôle en cours…' : report ? 'Actualiser le pré-audit' : 'Pré-audit complet non inclus dans cette publication'}
          </Button>
          {error && <p role="alert" className="text-red-700 text-xs font-semibold">{error}</p>}
          {!report && !loading && <p className="text-xs text-muted-foreground">Aucun pré-audit affiché. Cela ne signifie pas qu'il n'y a aucune donnée associée.</p>}
        </div>

        {report && (
          <div className="space-y-2 mb-3">
            <details className="group rounded-xl border px-3 py-2">
              <summary className="flex cursor-pointer items-center justify-between gap-2 text-sm font-semibold">
                Tous les compteurs du pré-audit <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 group-open:rotate-180" />
              </summary>
              <div className="mt-2 border-t pt-2">
                {Object.entries(report.counts).map(([name, count]) => (
                  <div key={name} className="flex justify-between gap-3 py-1 border-b last:border-0 text-xs">
                    <span>{COUNT_LABELS[name] || name}</span>
                    <strong className="shrink-0">{countText(count)}</strong>
                  </div>
                ))}
                <p className="text-xs text-amber-800 mt-2">Un zéro n'exclut pas des données absentes du périmètre du contrôle.</p>
              </div>
            </details>
            <details className="group rounded-xl border px-3 py-2">
              <summary className="flex cursor-pointer items-center justify-between gap-2 text-sm font-semibold">
                Décisions et couverture par catégorie <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 group-open:rotate-180" />
              </summary>
              <div className="mt-2 border-t pt-2 space-y-2">
                {report.coverage.perimetres.map(item => (
                  <div key={item.source} className="text-xs border-b last:border-0 pb-2">
                    <div className="flex flex-wrap justify-between gap-2"><strong>{item.source}</strong><span className="font-semibold text-amber-800">{LABELS[item.decision]}</span></div>
                    <p className="text-muted-foreground mt-1">{item.precision}</p>
                  </div>
                ))}
              </div>
            </details>
            <details className="group rounded-xl border px-3 py-2">
              <summary className="flex cursor-pointer items-center justify-between gap-2 text-sm font-semibold">
                Réserves techniques et éléments non traités ({warnings.length}) <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 group-open:rotate-180" />
              </summary>
              <div className="mt-2 border-t pt-2 text-xs space-y-1">
                {warnings.map((message, i) => <p key={`${i}-${message}`}>• {message}</p>)}
                <p className="font-medium text-amber-800 mt-2">Images et commentaires reportés. Support, prospection, sauvegardes et caches externes non exhaustivement inventoriés.</p>
              </div>
            </details>
          </div>
        )}

        <div className="rounded-xl border border-orange-200 p-3 mb-3 space-y-3" aria-label="Retrait public ciblé">
          <h3 className="font-bold text-sm">Retirer cette fiche de Label Moto</h3>
          <p className="text-xs text-muted-foreground">
            Contrôle ciblé : fiche, cache live, deux index JSON et demandes d’images liées à la fiche.
            Toute image encore accessible sur nos hébergements bloque le retrait réel tant que
            son nettoyage n’est pas sécurisé. Les copies Google restent à vérifier.
          </p>
          <label className="flex items-start gap-2 text-xs">
            <input type="checkbox" checked={consentPublicReads} onChange={e=>setConsentPublicReads(e.target.checked)} className="mt-0.5" />
            J'autorise les lectures Firebase ciblées : fiche, cache live, deux index Storage et
            jusqu’à 21 demandes d’images liées au slug (opérations éventuellement facturables).
          </label>
          <Button type="button" variant="outline" className="w-full" onClick={onPublicPreview}
            disabled={!consentPublicReads || publicPreviewLoading || publicApplying || !!publicResult}>
            {publicPreviewLoading?'Contrôle en cours…':'Vérifier la fiche et les index avant retrait'}
          </Button>
          {publicPreviewError && <p role="alert" className="text-xs text-red-700">{publicPreviewError}</p>}
          {publicPreview && !publicResult && (
            <div className="text-xs space-y-2 rounded-lg bg-muted/30 p-3">
              <p>Fiche principale : <strong>{publicPreview.fichePresente?'Présente':'Absente'}</strong></p>
              <p>Cache live : <strong>{publicPreview.cacheLiveConflit?'Conflit — STOP':publicPreview.cacheLivePresente?'Présent (sera ciblé)':'Absent'}</strong></p>
              {publicPreview.indexes.map(item=><p key={item.path}>{item.path} : <strong>{item.entreesRetirables} entrée(s) ciblée(s)</strong></p>)}
              <p>URLs médias possibles : <strong>{publicPreview.urlsImagesPossibles}</strong> (non effacées automatiquement).</p>
              {publicPreview.mediaAudit && <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-amber-900 space-y-1">
                <p>URLs hébergées par Label Moto / Firebase : <strong>{publicPreview.mediaAudit.urlsSousControleLabelMoto}</strong></p>
                <p>Demandes d’images liées : <strong>{publicPreview.mediaAudit.demandesImagesLiees}</strong>, dont <strong>{publicPreview.mediaAudit.demandesActivesAExaminer}</strong> à vérifier (y compris les refusées).</p>
                {publicPreview.mediaAudit.verificationIncomplete && <p className="font-semibold">Plus de 20 demandes : inventaire incomplet, STOP.</p>}
                {publicPreview.mediaAudit.retraitBloque && <p className="font-semibold">Média public potentiel : suppression suspendue, aucun fichier partagé ne sera touché.</p>}
              </div>}
              {!publicPreview.actionAutorisee && <p className="font-semibold text-amber-900">Écriture désactivée, cache ambigu ou médias à examiner. Aucun retrait possible actuellement.</p>}
              {publicPreview.actionAutorisee && (
                <div className="space-y-2 border-t pt-3">
                  <p className="font-semibold text-red-700">Action irréversible sur les sources principales. Une sauvegarde privée et un historique sont créés.</p>
                  <label className="block">Motif :
                    <select className="block mt-1 w-full rounded-md border p-2 bg-background" value={reason}
                      onChange={e=>setReason(e.target.value as 'owner_request'|'other')}>
                      <option value="owner_request">Demande du professionnel</option>
                      <option value="other">Autre motif</option>
                    </select>
                  </label>
                  <label className="flex items-start gap-2">
                    <input type="checkbox" checked={ackRemaining} onChange={e=>setAckRemaining(e.target.checked)} className="mt-0.5" />
                    Je comprends que les médias, caches externes et Google restent à contrôler.
                  </label>
                  <label className="block">Pour confirmer, saisis exactement : <strong className="break-all">{confirmationExpected}</strong>
                    <input className="block mt-1 w-full rounded-md border bg-background p-2" autoComplete="off"
                      spellCheck={false} value={confirmation} onChange={e=>setConfirmation(e.target.value)} />
                  </label>
                  <Button type="button" className="w-full bg-red-700 hover:bg-red-800 text-white"
                    disabled={!ackRemaining || confirmation!==confirmationExpected || publicApplying}
                    onClick={()=>onPublicApply(reason)}>
                    {publicApplying?'Retrait en cours…':'Retirer les sources publiques et journaliser'}
                  </Button>
                </div>
              )}
            </div>
          )}
          {publicApplyError && <p role="alert" className="rounded-lg border border-red-300 p-2 text-xs text-red-800">{publicApplyError} Ne relance pas l'opération sans examiner le verrou et la sauvegarde.</p>}
          {publicResult && (
            <div role="status" className="rounded-lg border border-amber-300 p-3 text-xs space-y-1">
              <p className="font-bold">Sources principales retirées et journalisées. Retrait Internet non certifié.</p>
              {publicResult.remaining.map((item,i)=><p key={i}>• {item}</p>)}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={publicApplying}>Fermer</Button>
          <Button type="button" disabled aria-disabled="true" className="flex-1 bg-gray-400 cursor-not-allowed">Effacement complet non certifié</Button>
        </div>
      </section>
    </div>
  );
}
