/** Vérifie l'accès anonyme réel à un index public, pas uniquement l'ACL Storage.
 * Aucun réseau lors de l'import. Le téléchargement est exécuté uniquement après
 * une écriture autorisée sous verrou V23.
 */
import { createHash } from 'node:crypto';

const MAX_PUBLIC_BYTES = 9 * 1024 * 1024;
const BUCKET_PATTERN = /^[a-z0-9][a-z0-9.-]{2,250}$/;
const ALLOWED_PATHS = new Set(['public/points.json', 'public/seo-pros.json']);

export type PublicFetch = (url: string, init: RequestInit) => Promise<Pick<Response, 'ok' | 'status' | 'arrayBuffer'>>;
const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

export async function verifyAnonymousIndexRead(input: {
  bucket: string;
  path: string;
  generation: string;
  expected: Buffer;
  fetcher?: PublicFetch;
}): Promise<void> {
  const { bucket, path, generation, expected } = input;
  if (!BUCKET_PATTERN.test(bucket) || !ALLOWED_PATHS.has(path) ||
      !/^[1-9][0-9]*$/.test(generation) || !Buffer.isBuffer(expected) ||
      expected.length > MAX_PUBLIC_BYTES) {
    throw new Error('INDEX_PUBLIC_VERIFY_ARGUMENT_INVALID');
  }

  // La génération publiée est explicitement demandée. Une URL nouvelle évite
  // les réponses d'un cache intermédiaire lors du contrôle post-écriture.
  const url = `https://storage.googleapis.com/${bucket}/${path}?generation=${generation}&lm_verify=${sha256(expected).slice(0, 16)}`;
  const fetcher = input.fetcher ?? fetch;
  const response = await fetcher(url, {
    method: 'GET', cache: 'no-store', redirect: 'error',
    signal: AbortSignal.timeout(15000),
    headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' },
  });
  if (!response.ok || response.status !== 200) {
    throw new Error(`INDEX_PUBLIC_HTTP_NOT_ACCESSIBLE_${response.status}`);
  }
  const actual = Buffer.from(await response.arrayBuffer());
  if (actual.length > MAX_PUBLIC_BYTES || sha256(actual) !== sha256(expected)) {
    throw new Error('INDEX_PUBLIC_CONTENT_MISMATCH');
  }
}
