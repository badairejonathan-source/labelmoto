import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Revendiquer ma fiche | Label Moto' },
  alternates: {
    canonical: 'https://labelmoto.fr/pro/revendiquer',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ClaimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
