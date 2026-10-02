import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Inscrire mon établissement | Label Moto' },
  alternates: {
    canonical: 'https://labelmoto.fr/pro/register',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
