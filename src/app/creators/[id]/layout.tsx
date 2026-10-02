import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    alternates: {
      canonical: `https://labelmoto.fr/creators/${id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
