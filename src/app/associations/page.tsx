import type {
  Metadata,
} from 'next';

import CommunityDirectoryPage from '@/components/app/community-directory-page';

export const metadata: Metadata = {
  title:
    'Associations moto et moto-clubs en France | LabelMoto',

  description:
    'Trouvez les associations moto, moto-clubs et collectifs de motards référencés en France sur LabelMoto.',

  alternates: {
    canonical:
      'https://labelmoto.fr/associations',
  },

  openGraph: {
    title:
      'Associations moto et moto-clubs en France | LabelMoto',

    description:
      'Découvrez les associations, clubs et collectifs moto référencés sur LabelMoto.',

    url:
      'https://labelmoto.fr/associations',

    siteName:
      'LabelMoto',

    locale:
      'fr_FR',

    type:
      'website',
  },
};

interface PageProps {
  searchParams:
    Promise<{
      departement?:
        | string
        | string[];
    }>;
}

export default async function AssociationsPage({
  searchParams,
}: PageProps) {
  const query =
    await searchParams;

  return (
    <CommunityDirectoryPage
      collection="associations"
      basePath="/associations"
      eyebrow="Communauté moto"
      h1="Associations, clubs et collectifs moto en France"
      label="Associations moto"
      intro="Retrouvez les associations, moto-clubs et collectifs de motards référencés sur LabelMoto. Sélectionnez un département pour découvrir les structures présentes près de chez vous."
      entitySingular="association"
      entityPlural="associations"
      mapFilter="association"
      requestedDepartment={
        query.departement
      }
      otherHref="/relais-motards"
      otherLabel="Relais motards"
    />
  );
}