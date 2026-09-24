import {
  getBrandLogoPath,
} from '@/data/brand-logo-assets';

interface BrandLogoProps {
  brand: string | null | undefined;
  className?: string;
}

export default function BrandLogo({
  brand,
  className = 'h-6 w-6 object-contain',
}: BrandLogoProps) {
  const src = getBrandLogoPath(brand);

  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={className}
    />
  );
}
