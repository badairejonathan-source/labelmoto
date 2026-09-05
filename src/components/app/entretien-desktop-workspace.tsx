'use client';

import React, {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
  X,
} from 'lucide-react';

import LabelMotoLogo from '@/components/app/logo';
import UserMenu from '@/components/app/user-menu';
import EntretienRoadBackdrop from '@/components/app/entretien-road-backdrop';
import { useUser } from '@/firebase/client';
import Footer from '@/components/app/footer';

type SheetModel = {
  id: string;
  label: string;
};

type BrandGroup = {
  name: string;
  models: SheetModel[];
};

type Props = {
  catalog: BrandGroup[];
  article: ReactNode;
};

function normalizeSearch(
  value: string
) {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase();
}

export default function EntretienDesktopWorkspace({
  catalog,
  article,
}: Props) {
  const { user } =
    useUser();

  const [
    query,
    setQuery,
  ] =
    useState('');

  const [
    openedBrand,
    setOpenedBrand,
  ] =
    useState<string | null>(
      null
    );

  const [
    selectedSheet,
    setSelectedSheet,
  ] =
    useState<{
      id: string;
      label: string;
      brand: string;
    } | null>(
      null
    );

  const [
    frameHeight,
    setFrameHeight,
  ] =
    useState(1200);

  const [
    frameReady,
    setFrameReady,
  ] =
    useState(false);

  const resizeObserverRef =
    useRef<ResizeObserver | null>(
      null
    );

  useEffect(
    () => {
      return () => {
        resizeObserverRef.current
          ?.disconnect();
      };
    },
    []
  );

  const filteredCatalog =
    useMemo(
      () => {
        const normalizedQuery =
          normalizeSearch(
            query.trim()
          );

        if (!normalizedQuery) {
          return catalog;
        }

        return catalog
          .map(
            group => {
              const brandMatches =
                normalizeSearch(
                  group.name
                ).includes(
                  normalizedQuery
                );

              const models =
                brandMatches
                  ? group.models
                  : group.models.filter(
                      model =>
                        normalizeSearch(
                          model.label
                        ).includes(
                          normalizedQuery
                        )
                    );

              return {
                ...group,
                models,
              };
            }
          )
          .filter(
            group =>
              group.models.length >
              0
          );
      },
      [
        catalog,
        query,
      ]
    );

  useEffect(
    () => {
      if (
        query.trim() &&
        filteredCatalog.length ===
          1
      ) {
        setOpenedBrand(
          filteredCatalog[0].name
        );
      }
    },
    [
      query,
      filteredCatalog,
    ]
  );

  const totalModels =
    catalog.reduce(
      (
        total,
        group
      ) =>
        total +
        group.models.length,
      0
    );

  const openSheet =
    (
      brand: string,
      model: SheetModel
    ) => {
      resizeObserverRef.current
        ?.disconnect();

      setFrameReady(
        false
      );

      setFrameHeight(
        1200
      );

      setSelectedSheet({
        id: model.id,
        label: model.label,
        brand,
      });
    };

  const closeSheet =
    () => {
      resizeObserverRef.current
        ?.disconnect();

      setSelectedSheet(
        null
      );

      setFrameReady(
        false
      );
    };

  const handleSheetLoad =
    (
      frame:
        HTMLIFrameElement
    ) => {
      resizeObserverRef.current
        ?.disconnect();

      const doc =
        frame.contentDocument;

      const win =
        frame.contentWindow;

      if (
        !doc ||
        !win ||
        !doc.body
      ) {
        setFrameReady(true);
        return;
      }

      /*
       * -------------------------------------------------------
       * AFFICHAGE EMBED
       * -------------------------------------------------------
       *
       * On conserve la vraie fiche.
       * Mais dans /entretien desktop :
       *
       * - aucun header
       * - aucune recherche
       * - aucun breadcrumb
       * - aucun "Retour au catalogue"
       * - aucune navigation basse
       *
       * La fenêtre commence directement au HERO de la moto.
       */

      const oldEmbedStyle =
        doc.head.querySelector(
          '[data-labelmoto-entretien-embed]'
        );

      oldEmbedStyle
        ?.remove();

      const style =
        doc.createElement(
          'style'
        );

      style.setAttribute(
        'data-labelmoto-entretien-embed',
        'true'
      );

      style.textContent = `
        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          min-height: 0 !important;
          background: transparent !important;
          overflow: hidden !important;
        }

        header,
        footer,
        nav.fixed,
        nav[class*="fixed"],
        [data-mobile-bottom-nav] {
          display: none !important;
        }

        body {
          position: relative !important;
        }
      `;

      doc.head.appendChild(
        style
      );

      /*
       * Retire aussi les éléments positionnés
       * fixed/sticky appartenant au chrome du site.
       */

      Array.from(
        doc.body.querySelectorAll<HTMLElement>(
          '*'
        )
      ).forEach(
        element => {
          const computed =
            win.getComputedStyle(
              element
            );

          const rect =
            element.getBoundingClientRect();

          if (
            (
              computed.position ===
                'fixed' ||
              computed.position ===
                'sticky'
            ) &&
            rect.top < 180
          ) {
            element.style.setProperty(
              'display',
              'none',
              'important'
            );
          }
        }
      );

      /*
       * Trouver le hero grâce au badge
       * "FICHE TECHNIQUE OFFICIELLE".
       */

      const allElements =
        Array.from(
          doc.body.querySelectorAll<HTMLElement>(
            '*'
          )
        );

      const badge =
        allElements.find(
          element => {
            const text =
              (
                element.textContent ||
                ''
              )
                .replace(
                  /\s+/g,
                  ' '
                )
                .trim()
                .toUpperCase();

            return (
              text ===
                'FICHE TECHNIQUE OFFICIELLE' ||
              text ===
                'FICHE TECHNIQUE'
            );
          }
        );

      let hero:
        HTMLElement | null =
          badge || null;

      /*
       * Remonter jusqu'au premier conteneur
       * suffisamment grand qui contient une image.
       */

      if (hero) {
        let candidate:
          HTMLElement | null =
            hero;

        while (
          candidate &&
          candidate !== doc.body
        ) {
          const rect =
            candidate
              .getBoundingClientRect();

          const hasImage =
            Boolean(
              candidate.querySelector(
                'img'
              )
            );

          if (
            hasImage &&
            rect.width > 400 &&
            rect.height > 260
          ) {
            hero =
              candidate;

            break;
          }

          candidate =
            candidate.parentElement;
        }
      }

      /*
       * Fallback :
       * première grande image de la fiche.
       */

      if (!hero) {
        const images =
          Array.from(
            doc.body.querySelectorAll<HTMLImageElement>(
              'img'
            )
          );

        const largeImage =
          images.find(
            image => {
              const rect =
                image.getBoundingClientRect();

              return (
                rect.width > 500 &&
                rect.height > 260
              );
            }
          );

        hero =
          largeImage
            ?.parentElement ||
          null;
      }

      let cropTop = 0;

      if (hero) {
        cropTop =
          Math.max(
            0,
            hero.getBoundingClientRect()
              .top +
              win.scrollY
          );
      }

      /*
       * On déplace réellement le document vers le haut.
       * Ainsi l'iframe commence exactement sur l'image,
       * sans deuxième scrollbar et sans espace vide.
       */

      if (
        cropTop > 0
      ) {
        doc.body.style.transform =
          `translateY(-${cropTop}px)`;

        doc.body.style.transformOrigin =
          'top left';
      }

      const syncHeight =
        () => {
          const fullHeight =
            Math.max(
              doc.documentElement
                .scrollHeight ||
                0,
              doc.body
                .scrollHeight ||
                0
            );

          setFrameHeight(
            Math.max(
              800,
              fullHeight -
                cropTop +
                32
            )
          );
        };

      syncHeight();

      const observer =
        new ResizeObserver(
          syncHeight
        );

      observer.observe(
        doc.documentElement
      );

      observer.observe(
        doc.body
      );

      resizeObserverRef.current =
        observer;

      requestAnimationFrame(
        () => {
          syncHeight();

          setFrameReady(
            true
          );
        }
      );
    };

  return (
    <div
      className="
        fixed
        inset-0
        z-[1900]
        hidden
        overflow-hidden
        bg-[#fbfcfc]
        lg:block
      "
    >
      {/* ==================================================
          COURBE
      =================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          overflow-hidden
          opacity-[0.22]
        "
      >
        <EntretienRoadBackdrop />
      </div>

      {/* ==================================================
          HEADER IDENTIQUE A LA DA DESKTOP
      =================================================== */}

      <header
        className="
          absolute
          inset-x-0
          top-0
          z-[1600]
          h-[80px]
          border-b
          border-black/[0.06]
          bg-white/95
          backdrop-blur-xl
        "
      >
        <div
          className="
            flex
            h-full
            items-center
            px-8
          "
        >
          <div
            className="
              flex
              w-[410px]
              shrink-0
              items-center
            "
          >
            <LabelMotoLogo
              noBubble
              className="
                w-[150px]
                border-none
                bg-transparent
                px-0
                shadow-none
              "
            />
          </div>

          <nav
            className="
              flex
              h-full
              items-center
              gap-9
              text-[14px]
              font-bold
              text-foreground
            "
          >
            <a
              href="/map"
              className="
                flex
                h-full
                items-center
                border-b-[3px]
                border-transparent
                transition-colors
                hover:text-brand
              "
            >
              Carte
            </a>

            <a
              href="/entretien"
              className="
                flex
                h-full
                items-center
                border-b-[3px]
                border-brand
                text-brand
              "
            >
              Entretien
            </a>

            <a
              href="/info"
              className="
                flex
                h-full
                items-center
                border-b-[3px]
                border-transparent
                transition-colors
                hover:text-brand
              "
            >
              Guides &amp; conseils
            </a>

            <a
              href="/"
              className="
                flex
                h-full
                items-center
                border-b-[3px]
                border-transparent
                transition-colors
                hover:text-brand
              "
            >
              Fiches moto
            </a>
          </nav>

          <div
            className="
              ml-auto
              flex
              items-center
            "
          >
            <UserMenu />
          </div>
        </div>
      </header>

      {/* ==================================================
          COLONNE GAUCHE
      =================================================== */}

      <aside
        className="
          absolute
          bottom-0
          left-6
          top-[104px]
          z-30
          flex
          w-[394px]
          flex-col
          overflow-hidden
          bg-[#fbfcfc]
          pr-5
        "
      >
        <div
          className="
            shrink-0
            pb-5
          "
        >
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-brand
            "
          >
            Entretien moto
          </p>

          <h1
            className="
              mt-1
              text-[28px]
              font-bold
              tracking-[-0.035em]
              text-[#151515]
            "
          >
            Fiches techniques
          </h1>

          <p
            className="
              mt-1
              text-[12px]
              text-muted-foreground
            "
          >
            {totalModels} modèles disponibles
          </p>

          <label
            className="
              mt-5
              flex
              min-h-[52px]
              items-center
              gap-3
              rounded-[16px]
              border
              border-black/[0.07]
              bg-white
              px-4
              shadow-[0_4px_16px_rgba(0,0,0,0.035)]
              focus-within:border-brand/40
            "
          >
            <Search
              className="
                h-[17px]
                w-[17px]
                shrink-0
                text-brand
              "
            />

            <input
              value={query}
              onChange={
                event =>
                  setQuery(
                    event.target.value
                  )
              }
              placeholder="Rechercher une marque ou un modèle"
              className="
                min-w-0
                flex-1
                bg-transparent
                text-[13px]
                font-medium
                outline-none
                placeholder:text-muted-foreground
              "
            />

            {query && (
              <button
                type="button"
                onClick={() =>
                  setQuery('')
                }
                aria-label="Effacer"
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  hover:bg-black/[0.05]
                "
              >
                <X
                  className="
                    h-3.5
                    w-3.5
                  "
                />
              </button>
            )}
          </label>
        </div>

        {/* =================================================
            ACCORDEONS MARQUES
        ================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            pb-10
            pr-2
            [scrollbar-width:thin]
          "
        >
          <div
            className="
              space-y-2
            "
          >
            {filteredCatalog.map(
              group => {
                const isOpen =
                  openedBrand ===
                  group.name;

                return (
                  <div
                    key={
                      group.name
                    }
                    className="
                      overflow-hidden
                      rounded-[18px]
                      border
                      border-black/[0.065]
                      bg-white
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenedBrand(
                          current =>
                            current ===
                            group.name
                              ? null
                              : group.name
                        )
                      }
                      className="
                        flex
                        min-h-[64px]
                        w-full
                        items-center
                        gap-3
                        px-4
                        text-left
                        hover:bg-black/[0.018]
                      "
                    >
                      <span
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#f5f5f5]
                          text-[12px]
                          font-bold
                          text-brand
                        "
                      >
                        {group.name
                          .charAt(0)
                          .toUpperCase()}
                      </span>

                      <span
                        className="
                          min-w-0
                          flex-1
                          truncate
                          text-[14px]
                          font-semibold
                          text-[#161616]
                        "
                      >
                        {group.name}
                      </span>

                      <span
                        className="
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.04em]
                          text-muted-foreground
                        "
                      >
                        {group.models.length}{' '}
                        {group.models.length >
                        1
                          ? 'modèles'
                          : 'modèle'}
                      </span>

                      <ChevronDown
                        className={`
                          h-4
                          w-4
                          shrink-0
                          text-muted-foreground
                          transition-transform
                          ${
                            isOpen
                              ? 'rotate-180'
                              : ''
                          }
                        `}
                      />
                    </button>

                    {isOpen && (
                      <div
                        className="
                          border-t
                          border-black/[0.05]
                          bg-[#fafafa]
                          px-2
                          py-2
                        "
                      >
                        {group.models.map(
                          model => {
                            const active =
                              selectedSheet
                                ?.id ===
                              model.id;

                            return (
                              <button
                                key={
                                  model.id
                                }
                                type="button"
                                onClick={() =>
                                  openSheet(
                                    group.name,
                                    model
                                  )
                                }
                                className={`
                                  flex
                                  min-h-[47px]
                                  w-full
                                  items-center
                                  gap-3
                                  rounded-[12px]
                                  px-3
                                  text-left
                                  transition-colors
                                  ${
                                    active
                                      ? 'bg-brand text-white'
                                      : 'hover:bg-white'
                                  }
                                `}
                              >
                                <span
                                  className="
                                    min-w-0
                                    flex-1
                                    truncate
                                    text-[13px]
                                    font-semibold
                                  "
                                >
                                  {model.label}
                                </span>

                                <ChevronRight
                                  className="
                                    h-3.5
                                    w-3.5
                                    shrink-0
                                  "
                                />
                              </button>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </aside>

      {/* ==================================================
          CONTENU PRINCIPAL
      =================================================== */}

      <main
        className="
          absolute
          bottom-0
          left-[442px]
          right-8
          top-[104px]
          z-20
          overflow-y-auto
          overscroll-contain
          bg-transparent
          pb-16
          [scrollbar-width:thin]
        "
      >
        {selectedSheet ? (
          <div
            className="
              relative
              min-h-full
              w-full
            "
          >
            {/*
              Fermer est superposé au contenu.
              Il n'occupe aucune hauteur :
              RIEN au-dessus de l'image.
            */}

            <button
              type="button"
              onClick={
                closeSheet
              }
              className="
                fixed
                right-12
                top-[166px]
                z-[2100]
                flex
                min-h-[44px]
                items-center
                gap-2
                rounded-full
                border
                border-black/[0.08]
                bg-white/95
                px-4
                text-[12px]
                font-semibold
                shadow-[0_5px_18px_rgba(0,0,0,0.09)]
                backdrop-blur-md
              "
            >
              <X
                className="
                  h-4
                  w-4
                "
              />

              Fermer
            </button>

            <iframe
              key={
                selectedSheet.id
              }
              src={`/fiches/${encodeURIComponent(
                selectedSheet.id
              )}?embed=entretien`}
              title={`Fiche ${selectedSheet.label}`}
              onLoad={
                event =>
                  handleSheetLoad(
                    event.currentTarget
                  )
              }
              scrolling="no"
              style={{
                height:
                  `${frameHeight}px`,

                opacity:
                  frameReady
                    ? 1
                    : 0,
              }}
              className="
                block
                w-full
                border-0
                bg-transparent
                transition-opacity
                duration-150
              "
            />

            {!frameReady && (
              <div
                className="
                  flex
                  min-h-[400px]
                  items-center
                  justify-center
                  text-[12px]
                  text-muted-foreground
                "
              >
                Chargement de la fiche…
              </div>
            )}
          </div>
        ) : (
          <div
            className="
              relative
              w-full
            "
          >
            <>
              <style>{`
                .entretien-desktop-article h1 {
                  font-family: inherit !important;
                  font-size: clamp(36px, 2.7vw, 46px) !important;
                  font-weight: 700 !important;
                  line-height: 1.03 !important;
                  letter-spacing: -0.035em !important;
                  text-transform: none !important;
                }

                .entretien-desktop-article h2 {
                  font-family: inherit !important;
                  font-size: 30px !important;
                  font-weight: 700 !important;
                  line-height: 1.08 !important;
                  letter-spacing: -0.03em !important;
                  text-transform: none !important;
                }

                .entretien-desktop-article h3 {
                  font-family: inherit !important;
                  font-size: 22px !important;
                  font-weight: 600 !important;
                  line-height: 1.15 !important;
                  letter-spacing: -0.02em !important;
                  text-transform: none !important;
                }

                .entretien-desktop-article h4 {
                  font-family: inherit !important;
                  font-weight: 600 !important;
                  line-height: 1.2 !important;
                  letter-spacing: -0.015em !important;
                  text-transform: none !important;
                }

                .entretien-desktop-article p {
                  font-family: inherit !important;
                  font-size: 16px !important;
                  font-weight: 400 !important;
                  line-height: 1.62 !important;
                }

                .entretien-desktop-article li {
                  font-family: inherit !important;
                  font-size: 16px !important;
                  font-weight: 400 !important;
                  line-height: 1.55 !important;
                }

                .entretien-desktop-article strong {
                  font-weight: 600 !important;
                }

                .entretien-desktop-article a {
                  font-weight: 600;
                }

                .entretien-desktop-article table {
                  font-family: inherit !important;
                }

                .entretien-desktop-article th {
                  font-weight: 600 !important;
                }

                .entretien-desktop-article td {
                  font-weight: 400 !important;
                }
              `}</style>

              <div className="entretien-desktop-article">
                {article}
              </div>
            </>
          </div>
        )}


          {/* ===============================================
              FOOTER DESKTOP
          ================================================ */}

          <div
            className="
              mt-20
              border-t
              border-black/[0.06]
              bg-white
            "
          >
            <Footer />
          </div>
        </main>
    </div>
  );
}
