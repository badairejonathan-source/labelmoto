import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Politique de confidentialité | Label Moto' },
  alternates: {
    canonical: 'https://labelmoto.fr/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
