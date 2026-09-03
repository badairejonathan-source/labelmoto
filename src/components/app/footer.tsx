// src/components/app/footer.tsx
// Ajout d'une section "Garages moto par ville" avec les 30 villes

'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube, Shield } from 'lucide-react';
import LabelMotoLogo from './logo';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const VILLES_FOOTER = [
  { slug: 'paris',            name: 'Paris' },
  { slug: 'marseille',        name: 'Marseille' },
  { slug: 'lyon',             name: 'Lyon' },
  { slug: 'toulouse',         name: 'Toulouse' },
  { slug: 'nice',             name: 'Nice' },
  { slug: 'nantes',           name: 'Nantes' },
  { slug: 'montpellier',      name: 'Montpellier' },
  { slug: 'strasbourg',       name: 'Strasbourg' },
  { slug: 'bordeaux',         name: 'Bordeaux' },
  { slug: 'lille',            name: 'Lille' },
  { slug: 'rennes',           name: 'Rennes' },
  { slug: 'reims',            name: 'Reims' },
  { slug: 'toulon',           name: 'Toulon' },
  { slug: 'grenoble',         name: 'Grenoble' },
  { slug: 'dijon',            name: 'Dijon' },
  { slug: 'angers',           name: 'Angers' },
  { slug: 'nimes',            name: 'Nîmes' },
  { slug: 'aix-en-provence',  name: 'Aix-en-Provence' },
  { slug: 'clermont-ferrand', name: 'Clermont-Ferrand' },
  { slug: 'rouen',            name: 'Rouen' },
  { slug: 'amiens',           name: 'Amiens' },
  { slug: 'metz',             name: 'Metz' },
  { slug: 'brest',            name: 'Brest' },
  { slug: 'tours',            name: 'Tours' },
  { slug: 'limoges',          name: 'Limoges' },
  { slug: 'perpignan',        name: 'Perpignan' },
  { slug: 'caen',             name: 'Caen' },
  { slug: 'nancy',            name: 'Nancy' },
  { slug: 'saint-etienne',    name: 'Saint-Étienne' },
  { slug: 'pau',              name: 'Pau' },
];

const Footer = () => {
  const pathname = usePathname();
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  if (pathname === '/map') return null;

  const proRegisterLink = "/login?callbackUrl=/pro/register";

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div
        className="
          container
          mx-auto
          px-4
          pt-1
          pb-[72px]
          text-sm
          sm:px-6
          md:py-12
          lg:px-8
        "
      >
        {/* ===================================================
            GARAGES MOTO PAR VILLE
            =================================================== */}
        <div
          className="
            mb-6
            border-b
            border-border/50
            pb-6
            md:mb-10
            md:pb-10
          "
        >
          <h3
            className="
              mb-3
              flex
              items-center
              gap-2
              text-[9px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-foreground
              md:mb-5
              md:text-[10px]
              md:font-black
              md:tracking-[0.2em]
            "
          >
            <span
              className="
                text-brand
              "
              aria-hidden="true"
            >
              🏍
            </span>

            Garages moto par ville
          </h3>

          <div
            className="
              flex
              flex-wrap
              gap-x-3
              gap-y-1.5
              md:gap-x-4
              md:gap-y-2
            "
          >
            {VILLES_FOOTER.map(({ slug, name }) => (
              <Link
                key={slug}
                href={`/garages-moto/${slug}`}
                className="
                  whitespace-nowrap
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-muted-foreground
                  transition-colors
                  hover:text-brand
                  md:text-[9px]
                  md:font-bold
                  md:tracking-widest
                "
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        {/* ===================================================
            IDENTITE LABELMOTO
            =================================================== */}
        <div
          className="
            mb-5
            text-center
            md:hidden
          "
        >
          <div
            className="
              mx-auto
              w-36
            "
          >
            <LabelMotoLogo noBubble />
          </div>

          <p
            className="
              mx-auto
              mt-4
              max-w-[330px]
              text-center
              text-[10px]
              font-medium
              leading-[1.55]
              text-muted-foreground
            "
          >
            Label Moto est l&apos;annuaire national indépendant des
            motards en France. Nous référençons concessions, ateliers
            et relais pour simplifier votre passion.
          </p>

          <div
            className="
              mt-3
              flex
              items-center
              justify-center
              gap-1.5
              text-[8px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-brand
            "
          >
            <Shield
              className="
                h-3
                w-3
              "
            />

            <span>
              Plateforme de confiance
            </span>
          </div>
        </div>

        {/* ===================================================
            ACCORDEONS MOBILE
            =================================================== */}
        <div
          className="
            mb-6
            border-y
            border-border/50
            md:hidden
          "
        >
          {/* A PROPOS */}
          <details
            className="
              group
              border-b
              border-border/50
            "
          >
            <summary
              className="
                relative
                flex
                cursor-pointer
                list-none
                items-center
                justify-center
                py-3.5
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-foreground
                [&::-webkit-details-marker]:hidden
              "
            >
              <span>
                À propos
              </span>

              <span
                className="
                  absolute
                  right-0
                  text-lg
                  font-light
                  leading-none
                  text-brand
                  transition-transform
                  duration-200
                  group-open:rotate-45
                "
                aria-hidden="true"
              >
                +
              </span>
            </summary>

            <ul
              className="
                space-y-3
                pb-4
                text-center
              "
            >
              <li>
                <Link
                  href="/about"
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  Notre mission
                </Link>
              </li>

              <li>
                <Link
                  href="/selection"
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  La Méthode
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  Contactez-nous
                </Link>
              </li>
            </ul>
          </details>

          {/* RESSOURCES */}
          <details
            className="
              group
              border-b
              border-border/50
            "
          >
            <summary
              className="
                relative
                flex
                cursor-pointer
                list-none
                items-center
                justify-center
                py-3.5
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-foreground
                [&::-webkit-details-marker]:hidden
              "
            >
              <span>
                Ressources
              </span>

              <span
                className="
                  absolute
                  right-0
                  text-lg
                  font-light
                  leading-none
                  text-brand
                  transition-transform
                  duration-200
                  group-open:rotate-45
                "
                aria-hidden="true"
              >
                +
              </span>
            </summary>

            <ul
              className="
                space-y-3
                pb-4
                text-center
              "
            >
              <li>
                <Link
                  href="/info"
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  Guides &amp; Conseils
                </Link>
              </li>

              <li>
                <Link
                  href="/map"
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  Trouver un pro
                </Link>
              </li>

              <li>
                <Link
                  href="/entretien"
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  Catalogues Entretien
                </Link>
              </li>
            </ul>
          </details>

          {/* ESPACE PRO */}
          <details
            className="
              group
            "
          >
            <summary
              className="
                relative
                flex
                cursor-pointer
                list-none
                items-center
                justify-center
                py-3.5
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-foreground
                [&::-webkit-details-marker]:hidden
              "
            >
              <span>
                Espace pro
              </span>

              <span
                className="
                  absolute
                  right-0
                  text-lg
                  font-light
                  leading-none
                  text-brand
                  transition-transform
                  duration-200
                  group-open:rotate-45
                "
                aria-hidden="true"
              >
                +
              </span>
            </summary>

            <ul
              className="
                space-y-3
                pb-4
                text-center
              "
            >
              <li>
                <Link
                  href={proRegisterLink}
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  Inscrire mon établissement
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  Partenariats
                </Link>
              </li>
            </ul>
          </details>
        </div>

        {/* ===================================================
            VERSION DESKTOP
            =================================================== */}
        <div
          className="
            mb-12
            hidden
            grid-cols-4
            gap-8
            md:grid
          "
        >
          <div
            className="
              space-y-4
              md:col-span-1
            "
          >
            <div
              className="
                w-48
                shrink-0
                sm:w-56
              "
            >
              <LabelMotoLogo noBubble />
            </div>

            <p
              className="
                text-[11px]
                font-bold
                leading-relaxed
                text-muted-foreground
              "
            >
              Label Moto est l&apos;annuaire national indépendant des
              motards en France. Nous référençons concessions, ateliers
              et relais pour simplifier votre passion.
            </p>

            <div
              className="
                flex
                items-center
                gap-2
                text-[9px]
                font-black
                uppercase
                tracking-widest
                text-brand
              "
            >
              <Shield
                className="
                  h-3
                  w-3
                "
              />

              <span>
                Plateforme de confiance
              </span>
            </div>
          </div>

          <div>
            <h3
              className="
                mb-4
                text-[10px]
                font-black
                uppercase
                tracking-[0.2em]
                text-foreground
              "
            >
              À propos
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  Notre mission
                </Link>
              </li>

              <li>
                <Link
                  href="/selection"
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  La Méthode
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  Contactez-nous
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="
                mb-4
                text-[10px]
                font-black
                uppercase
                tracking-[0.2em]
                text-foreground
              "
            >
              Ressources
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/info"
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  Guides &amp; Conseils
                </Link>
              </li>

              <li>
                <Link
                  href="/map"
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  Trouver un pro
                </Link>
              </li>

              <li>
                <Link
                  href="/entretien"
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  Catalogues Entretien
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="
                mb-4
                text-[10px]
                font-black
                uppercase
                tracking-[0.2em]
                text-foreground
              "
            >
              Espace Pro
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href={proRegisterLink}
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  Inscrire mon établissement
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-muted-foreground
                    transition-colors
                    hover:text-brand
                  "
                >
                  Partenariats
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ===================================================
            BAS DU FOOTER
            =================================================== */}
        <div
          className="
            border-t
            border-border/50
            pt-5
            md:pt-8
          "
        >
          <div
            className="
              flex
              flex-col
              items-center
              gap-4
              md:flex-row
              md:justify-between
              md:gap-8
            "
          >
            <div
              className="
                text-center
                md:text-left
              "
            >
              {currentYear && (
                <p
                  className="
                    text-[9px]
                    font-semibold
                    text-muted-foreground
                    sm:text-xs
                    md:text-[11px]
                    md:font-bold
                  "
                >
                  &copy; {currentYear} Label Moto.
                  <span className="hidden sm:inline">
                    {' '}Plateforme nationale indépendante.
                  </span>
                </p>
              )}
            </div>

            <div
              className="
                flex
                items-center
                gap-5
                md:space-x-1
              "
            >
              <span className="sr-only">
                Réseaux sociaux
              </span>

              <Link
                href="https://www.instagram.com/labelmoto.fr/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Suivez Label Moto sur Instagram"
                className="
                  text-muted-foreground
                  transition-colors
                  hover:text-brand
                "
              >
                <Instagram
                  className="
                    h-4
                    w-4
                    md:h-5
                    md:w-5
                  "
                />
              </Link>

              <button
                disabled
                aria-label="Facebook (bientôt disponible)"
                className="
                  cursor-not-allowed
                  text-muted-foreground
                  opacity-30
                "
              >
                <Facebook
                  className="
                    h-4
                    w-4
                    md:h-5
                    md:w-5
                  "
                />
              </button>

              <button
                disabled
                aria-label="Youtube (bientôt disponible)"
                className="
                  cursor-not-allowed
                  text-muted-foreground
                  opacity-30
                "
              >
                <Youtube
                  className="
                    h-4
                    w-4
                    md:h-5
                    md:w-5
                  "
                />
              </button>
            </div>
          </div>

          <div
            className="
              mt-5
              flex
              flex-wrap
              items-center
              justify-center
              gap-x-4
              gap-y-2
              border-t
              border-dashed
              border-border/50
              pt-4
              text-[9px]
              font-medium
              md:mt-8
              md:gap-x-6
              md:gap-y-3
              md:pt-6
              md:text-[11px]
              md:font-bold
              sm:text-xs
            "
          >
            <Link
              href="/terms"
              className="
                text-muted-foreground
                transition-colors
                hover:text-brand
              "
            >
              Conditions d&apos;utilisation
            </Link>

            <Link
              href="/privacy"
              className="
                text-muted-foreground
                transition-colors
                hover:text-brand
              "
            >
              Confidentialité &amp; Cookies
            </Link>

            <Link
              href="/legal"
              className="
                text-muted-foreground
                transition-colors
                hover:text-brand
              "
            >
              Mentions Légales
            </Link>

            <Link
              href="/accessibility"
              className="
                text-muted-foreground
                transition-colors
                hover:text-brand
              "
            >
              Accessibilité
            </Link>

            <Link
              href="/contact"
              className="
                text-muted-foreground
                transition-colors
                hover:text-brand
              "
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
