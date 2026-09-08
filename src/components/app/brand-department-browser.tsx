'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Pro {
  id: string;
  title: string;
  address: string;
  category: string;
  phoneNumber?: string;
  website?: string;
  rating: number | null;
  reviewCount: number | null;
  slug: string;
  docId: string;
  departement?: string;
}

interface DepartmentGroup {
  code: string;
  name: string;
  pros: Pro[];
}

interface BrandDepartmentBrowserProps {
  departmentGroups: DepartmentGroup[];
}

function ProCard({ pro }: { pro: Pro }) {
  const href = `/concessions/${pro.slug || pro.docId}`;

  return (
    <div className="bg-white rounded-2xl border border-border/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-3 p-4 md:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link
            href={href}
            className="font-black text-foreground hover:text-brand transition-colors line-clamp-1 text-sm uppercase tracking-tight"
          >
            {pro.title}
          </Link>

          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {pro.address}
          </p>
        </div>

        {pro.rating && (
          <div className="shrink-0 flex items-center gap-1 bg-brand/10 px-2 py-1 rounded-full">
            <span className="text-xs font-black text-brand">
              {pro.rating.toFixed(1)}
            </span>
            <span className="text-brand text-xs">★</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {pro.phoneNumber && (
          <a
            href={`tel:${pro.phoneNumber}`}
            className="text-[9px] font-black uppercase tracking-widest text-brand bg-brand/10 px-2 py-1 rounded-full hover:bg-brand/20 transition-colors"
          >
            📞 Appeler
          </a>
        )}

        {pro.website && (
          <a
            href={pro.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-black uppercase tracking-widest text-brand bg-brand/10 px-2 py-1 rounded-full hover:bg-brand/20 transition-colors"
          >
            🌐 Site web
          </a>
        )}

        <Link
          href={href}
          className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-brand bg-muted/30 px-2 py-1 rounded-full transition-colors"
        >
          Voir la fiche →
        </Link>
      </div>
    </div>
  );
}

export default function BrandDepartmentBrowser({
  departmentGroups,
}: BrandDepartmentBrowserProps) {
  const [selectedCode, setSelectedCode] =
    useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div
        id="sommaire-departements"
        className="scroll-mt-24 bg-white rounded-3xl border shadow-sm p-5 md:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-1">
              Accès rapide
            </p>

            <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">
              Trouver par département
            </h2>

            <p className="mt-1.5 text-xs font-medium text-muted-foreground">
              Sélectionnez un département pour afficher les fiches correspondantes.
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-brand/10 px-3 py-1 text-xs font-black text-brand">
            {departmentGroups.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-5">
          {departmentGroups.map(group => {
            const isSelected =
              group.code === selectedCode;

            return (
              <div
                key={group.code}
                className="contents"
              >
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCode(current =>
                      current === group.code
                        ? null
                        : group.code
                    )
                  }
                  aria-pressed={isSelected}
                  className={
                    isSelected
                      ? 'group rounded-xl border border-brand bg-brand/10 px-3 py-2.5 text-left shadow-sm transition-colors'
                      : 'group rounded-xl border border-border/70 bg-muted/20 px-3 py-2.5 text-left hover:border-brand hover:bg-brand/5 transition-colors'
                  }
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 text-xs font-black text-brand">
                      {group.code === 'NC'
                        ? '—'
                        : group.code}
                    </span>

                    <span className="truncate text-[11px] font-bold text-foreground group-hover:text-brand">
                      {group.name}
                    </span>
                  </div>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                    {group.pros.length}{' '}
                    pro{group.pros.length > 1 ? 's' : ''}
                  </p>
                </button>

                {isSelected && (
                  <section
                    aria-live="polite"
                    className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 py-3 md:py-4"
                  >
                    <div className="mb-4 flex items-center gap-3 border-b border-border/70 pb-3">
                      <div className="inline-flex min-w-12 items-center justify-center rounded-xl bg-brand px-3 py-2 text-xs font-black text-white shadow-sm">
                        {group.code === 'NC'
                          ? '—'
                          : group.code}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-foreground">
                          {group.name}
                        </h3>

                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          {group.pros.length}{' '}
                          professionnel
                          {group.pros.length > 1
                            ? 's'
                            : ''}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.pros.map(pro => (
                        <ProCard
                          key={pro.id}
                          pro={pro}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}