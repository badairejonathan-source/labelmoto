import type { Metadata } from 'next';
import ArticleEntretien from './article-shell';
import './article.css';
import './site-da-overrides.css';
import './desktop-ux-controles.css';
import './mobile-reference-exacte.css';
import './materiel-cartes-carrees.css';
import './fond-halo-article.css';
import './intro-site.css';
import './publication-scope.css';

const slug = 'entretien-moto-10-verifications';
const title = 'Entretien moto : 10 vérifications à faire soi-même';
const description = 'Chaîne, pneus, freins, huile, batterie… Apprends à vérifier ta moto grâce à 10 contrôles illustrés, avec les signes d’usure et les précautions à connaître.';
const url = `https://labelmoto.fr/info/${slug}`;
const image = 'https://labelmoto.fr/images/entretien-moto-guide/controle-1082d06954213ab5.webp';

export const metadata: Metadata = {
  title: { absolute: `${title} | Label Moto` },
  description,
  alternates: { canonical: url },
  openGraph: {
    title: `${title} | Label Moto`,
    description,
    url,
    siteName: 'Label Moto',
    type: 'article',
    locale: 'fr_FR',
    images: [{ url: image, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} | Label Moto`,
    description,
    images: [image],
  },
};

export default function Page() {
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'Label Moto', url: 'https://labelmoto.fr' },
    publisher: { '@type': 'Organization', name: 'Label Moto', url: 'https://labelmoto.fr' },
    inLanguage: 'fr-FR',
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://labelmoto.fr' },
      { '@type': 'ListItem', position: 2, name: 'Guides & Conseils', item: 'https://labelmoto.fr/info' },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ArticleEntretien />
    </>
  );
}
