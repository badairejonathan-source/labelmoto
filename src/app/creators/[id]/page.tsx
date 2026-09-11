import type { Metadata } from 'next';
import { getAdminFirestore } from '@/lib/firebase-admin';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ExternalLink,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Video,
} from 'lucide-react';

function sanitize(data: any): any {
  if (!data) return null;
  return JSON.parse(JSON.stringify(data));
}

async function getCreator(idOrSlug: string) {
  const db = getAdminFirestore();

  try {
    const idDoc =
      await db
        .collection('creators')
        .doc(idOrSlug)
        .get();

    if (idDoc.exists) {
      return sanitize({
        id: idDoc.id,
        ...idDoc.data(),
      });
    }

    const snap =
      await db
        .collection('creators')
        .where('slug', '==', idOrSlug)
        .limit(1)
        .get();

    if (!snap.empty) {
      return sanitize({
        id: snap.docs[0].id,
        ...snap.docs[0].data(),
      });
    }
  }
  catch (error) {
    console.error(
      '[CREATOR] lecture impossible',
      error
    );
  }

  return null;
}

function text(
  ...values: unknown[]
): string {
  for (const value of values) {
    const candidate =
      String(value ?? '').trim();

    if (
      candidate &&
      candidate.toLowerCase() !== 'null' &&
      candidate.toLowerCase() !== 'undefined'
    ) {
      return candidate;
    }
  }

  return '';
}

function cleanExternalUrl(
  value: unknown
): string {
  const raw =
    text(value);

  if (
    !raw ||
    raw === '#' ||
    raw === '-'
  ) {
    return '';
  }

  if (
    /^https?:\/\//i.test(raw)
  ) {
    return raw;
  }

  if (
    /^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw)
  ) {
    return `https://${raw}`;
  }

  return '';
}

function instagramUrl(
  creator: any
): string {
  const direct =
    cleanExternalUrl(
      creator.instagramUrl
    );

  if (direct) {
    return direct;
  }

  const handle =
    text(
      creator.instagram,
      creator.instagramHandle
    )
      .replace(/^@/, '')
      .replace(/^\/+|\/+$/g, '');

  if (!handle) {
    return '';
  }

  if (
    !/^[a-z0-9._]+$/i.test(handle)
  ) {
    return '';
  }

  return `https://www.instagram.com/${handle}/`;
}

function instagramLabel(
  url: string
): string {
  if (!url) {
    return '';
  }

  try {
    const parsed =
      new URL(url);

    const handle =
      parsed.pathname
        .split('/')
        .filter(Boolean)[0];

    return handle
      ? `@${handle}`
      : 'Instagram';
  }
  catch {
    return 'Instagram';
  }
}

function extractBaseLocation(
  creator: any
): string {
  const explicit =
    text(
      creator.city,
      creator.ville,
      creator.publicLocationLabel
    );

  if (explicit) {
    return explicit;
  }

  const address =
    text(creator.address);

  if (!address) {
    return '';
  }

  const postalMatch =
    address.match(
      /\b\d{5}\s+([^,]+)/i
    );

  if (
    postalMatch?.[1]
  ) {
    return postalMatch[1].trim();
  }

  const parts =
    address
      .split(',')
      .map((part: string) =>
        part.trim()
      )
      .filter(Boolean)
      .filter(
        (part: string) =>
          !/^france$/i.test(part)
      );

  if (parts.length === 1) {
    return parts[0];
  }

  return (
    parts[parts.length - 1] ||
    ''
  );
}

function explicitSpecialties(
  creator: any
): string[] {
  const source =
    creator.specialties ??
    creator.specialites ??
    creator.specialite ??
    creator.activities;

  if (Array.isArray(source)) {
    return source
      .map(item =>
        text(item)
      )
      .filter(Boolean);
  }

  const raw =
    text(source);

  if (!raw) {
    return [];
  }

  return raw
    .split(/[,;|]/)
    .map(item =>
      item.trim()
    )
    .filter(Boolean);
}

function inferCreatorType(
  creator: any
): string {
  const explicit =
    text(
      creator.creatorType,
      creator.activite
    );

  if (explicit) {
    return explicit;
  }

  const corpus =
    text(
      creator.category,
      creator.info,
      creator.description,
      creator.bio
    ).toLowerCase();

  const hasPhoto =
    /photo|photograph/.test(corpus);

  const hasVideo =
    /vid[ée]o|videograph|film/.test(corpus);

  const hasEvent =
    /event|événement|evenement/.test(
      corpus
    );

  let profession =
    'Créateur moto';

  if (
    hasPhoto &&
    hasVideo
  ) {
    profession =
      'Photographe & vidéaste moto';
  }
  else if (hasPhoto) {
    profession =
      'Photographe moto';
  }
  else if (hasVideo) {
    profession =
      'Vidéaste moto';
  }
  else if (
    /cr[ée]ateur de contenu|content|influence|r[ée]seaux sociaux/.test(
      corpus
    )
  ) {
    profession =
      'Créateur de contenu moto';
  }

  if (
    hasEvent &&
    !/événementiel/i.test(
      profession
    )
  ) {
    profession +=
      ' • Événementiel';
  }

  return profession;
}

function inferredSpecialties(
  creator: any
): string[] {
  const explicit =
    explicitSpecialties(
      creator
    );

  if (explicit.length > 0) {
    return Array.from(
      new Set(explicit)
    ).slice(0, 8);
  }

  const corpus =
    text(
      creator.category,
      creator.info,
      creator.description,
      creator.bio
    ).toLowerCase();

  const result: string[] = [];

  if (
    /photo|photograph/.test(corpus)
  ) {
    result.push('Photographie');
  }

  if (
    /vid[ée]o|videograph|film/.test(corpus)
  ) {
    result.push('Vidéo');
  }

  if (
    /reel|instagram|r[ée]seaux sociaux|social media/.test(
      corpus
    )
  ) {
    result.push(
      'Contenu réseaux sociaux'
    );
  }

  if (
    /[ée]v[ée]nement|event/.test(corpus)
  ) {
    result.push('Événementiel');
  }

  if (
    /shooting|shoot/.test(corpus)
  ) {
    result.push('Shooting');
  }

  if (
    /drone|a[ée]rien/.test(corpus)
  ) {
    result.push('Drone');
  }

  return Array.from(
    new Set(result)
  ).slice(0, 8);
}

function creatorImage(
  creator: any
): string {
  return text(
    creator.photoUrl,
    creator.imageUrl,
    creator.imgUrl,
    creator.img_url,
    creator.image_url
  );
}

function initials(
  name: string
): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part =>
      part[0]?.toUpperCase() || ''
    )
    .join('');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } =
    await params;

  const creator =
    await getCreator(id);

  if (!creator) {
    return {
      title:
        'Créateur non trouvé | LabelMoto',
    };
  }

  const name =
    text(
      creator.displayName,
      creator.title,
      creator.name
    ) ||
    'Créateur moto';

  const activity =
    inferCreatorType(
      creator
    );

  const description =
    text(
      creator.description,
      creator.info,
      creator.bio
    );

  return {
    title:
      `${name} - ${activity} | LabelMoto`,

    description:
      description ||
      `Découvrez ${name}, ${activity.toLowerCase()} référencé sur LabelMoto.`,
  };
}

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } =
    await params;

  const creator =
    await getCreator(id);

  if (!creator) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#f4f1ec] px-6 text-center">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Créateur non trouvé
        </h1>

        <Link
          href="/map"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la carte
        </Link>
      </div>
    );
  }

  const name =
    text(
      creator.displayName,
      creator.title,
      creator.name
    ) ||
    'Créateur LabelMoto';

  const activity =
    inferCreatorType(
      creator
    );

  const bio =
    text(
      creator.description,
      creator.info,
      creator.bio
    );

  const baseLocation =
    extractBaseLocation(
      creator
    );

  const serviceArea =
    text(
      creator.serviceArea,
      creator.zone,
      creator.zoneIntervention,
      creator.interventionArea
    );

  const specialties =
    inferredSpecialties(
      creator
    );

  const instagram =
    instagramUrl(
      creator
    );

  const instagramName =
    instagramLabel(
      instagram
    );

  const website =
    cleanExternalUrl(
      creator.website
    );

  const facebook =
    cleanExternalUrl(
      creator.facebookUrl
    );

  const email =
    text(
      creator.email
    );

  const phone =
    text(
      creator.phoneNumber
    );

  const image =
    creatorImage(
      creator
    );

  const isVerified =
    creator.verificationStatus ===
      'verified' ||
    creator.verified === true ||
    creator.isVerified === true;

  const hasPublicLocation =
    creator.hasPublicLocation ===
      true;

  const publicAddress =
    hasPublicLocation
      ? text(creator.address)
      : '';

  return (
    <div className="min-h-screen bg-[#f4f1ec]">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="shrink-0"
          >
            <Image
              src="/images/logo-moto.webp"
              alt="LabelMoto"
              width={120}
              height={32}
              priority
            />
          </Link>

          <Link
            href="/map"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground transition hover:text-brand sm:text-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">
              Retour à la carte
            </span>
            <span className="sm:hidden">
              Carte
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <section className="relative overflow-hidden rounded-[2rem] border border-brand/15 bg-[#fff1e5] shadow-[0_18px_50px_rgba(111,66,35,0.10)] sm:rounded-[2.5rem]">
          <div className="absolute right-[-80px] top-[-100px] h-64 w-64 rounded-full bg-brand/10 blur-3xl" />

          <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
            <div className="mx-auto lg:mx-0">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="h-32 w-32 rounded-[2rem] border-4 border-brand bg-white object-cover shadow-xl sm:h-40 sm:w-40"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] border-4 border-brand bg-white/75 text-4xl font-black text-foreground shadow-xl sm:h-40 sm:w-40 sm:text-5xl">
                  {initials(name)}
                </div>
              )}
            </div>

            <div className="min-w-0 text-center lg:text-left">
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className="rounded-full border border-brand/15 bg-white/65 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-foreground/60 shadow-sm">
                  Profil créateur
                </span>

                {isVerified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Vérifié
                  </span>
                )}
              </div>

              <h1 className="break-words text-3xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-6xl">
                {name}
              </h1>

              <p className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-brand sm:text-base">
                {activity}
              </p>

              {baseLocation && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-foreground/60 lg:justify-start">
                  <MapPin className="h-4 w-4 text-brand" />
                  Basé à {baseLocation}
                </div>
              )}

              <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5 hover:opacity-90"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </a>
                )}

                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-brand/15 bg-white/75 px-6 py-3 text-xs font-black uppercase tracking-widest text-foreground shadow-sm transition hover:border-brand/35 hover:bg-white"
                  >
                    <Globe className="h-4 w-4" />
                    Portfolio
                    <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                  </a>
                )}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-brand/15 bg-white/40 px-6 py-3 text-xs font-black uppercase tracking-widest text-foreground transition hover:border-brand hover:bg-white hover:text-brand"
                  >
                    <Mail className="h-4 w-4" />
                    Contacter
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
          <div className="space-y-6">
            {bio && (
              <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Camera className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                      Le profil
                    </p>

                    <h2 className="text-xl font-black uppercase tracking-tight">
                      À propos
                    </h2>
                  </div>
                </div>

                <p className="whitespace-pre-line text-[15px] font-medium leading-7 text-foreground/75">
                  {bio}
                </p>
              </section>
            )}

            {specialties.length > 0 && (
              <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Video className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                      Savoir-faire
                    </p>

                    <h2 className="text-xl font-black uppercase tracking-tight">
                      Spécialités
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {specialties.map(
                    specialty => (
                      <span
                        key={specialty}
                        className="rounded-full border border-brand/15 bg-brand/5 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-foreground"
                      >
                        {specialty}
                      </span>
                    )
                  )}
                </div>
              </section>
            )}

            {!bio &&
              specialties.length === 0 && (
                <section className="rounded-[2rem] border border-dashed border-black/10 bg-white/60 p-8 text-center">
                  <p className="text-sm font-bold text-muted-foreground">
                    Ce créateur n’a pas encore ajouté de présentation détaillée.
                  </p>
                </section>
              )}
          </div>

          <aside className="space-y-6">
            {(baseLocation ||
              instagram ||
              website ||
              facebook ||
              email ||
              phone) && (
              <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
                <p className="mb-5 text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                  Liens & contact
                </p>

                <div className="space-y-2">
                  {baseLocation && (
                    <div className="flex items-center gap-3 rounded-2xl border border-black/5 p-4">
                      <MapPin className="h-5 w-5 shrink-0 text-brand" />

                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          Localisation
                        </p>

                        <p className="truncate text-sm font-black">
                          {baseLocation}
                        </p>
                      </div>
                    </div>
                  )}

                  {instagram && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-2xl border border-black/5 p-4 transition hover:border-brand/30 hover:bg-brand/5"
                    >
                      <Instagram className="h-5 w-5 shrink-0 text-brand" />

                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          Instagram
                        </p>

                        <p className="truncate text-sm font-black">
                          {instagramName}
                        </p>
                      </div>
                    </a>
                  )}

                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-2xl border border-black/5 p-4 transition hover:border-brand/30 hover:bg-brand/5"
                    >
                      <Globe className="h-5 w-5 shrink-0 text-brand" />

                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          Portfolio / site
                        </p>

                        <p className="truncate text-sm font-black">
                          Visiter le site
                        </p>
                      </div>
                    </a>
                  )}

                  {facebook && (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-2xl border border-black/5 p-4 transition hover:border-brand/30 hover:bg-brand/5"
                    >
                      <Globe className="h-5 w-5 shrink-0 text-brand" />

                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          Facebook
                        </p>

                        <p className="truncate text-sm font-black">
                          Voir le profil
                        </p>
                      </div>
                    </a>
                  )}

                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-3 rounded-2xl border border-black/5 p-4 transition hover:border-brand/30 hover:bg-brand/5"
                    >
                      <Mail className="h-5 w-5 shrink-0 text-brand" />

                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          Email
                        </p>

                        <p className="truncate text-sm font-black">
                          {email}
                        </p>
                      </div>
                    </a>
                  )}

                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="flex items-center gap-3 rounded-2xl border border-black/5 p-4 transition hover:border-brand/30 hover:bg-brand/5"
                    >
                      <Phone className="h-5 w-5 shrink-0 text-brand" />

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          Téléphone
                        </p>

                        <p className="text-sm font-black">
                          {phone}
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              </section>
            )}

          </aside>
        </div>
      </main>
    </div>
  );
}
