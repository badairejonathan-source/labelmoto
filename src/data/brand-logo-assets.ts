const BRAND_LOGOS: Record<string, string> = {
  honda: '/images/brand-logos/honda.svg',
  yamaha: '/images/brand-logos/yamaha.png',
  bmw: '/images/brand-logos/bmw.png',
  bmwmotorrad: '/images/brand-logos/bmw.png',
  kawasaki: '/images/brand-logos/kawasaki.svg',
  cfmoto: '/images/brand-logos/cf-moto.png',
  voge: '/images/brand-logos/voge.png',
  qjmotor: '/images/brand-logos/qj-motor.png',
  kove: '/images/brand-logos/kove.png',
  suzuki: '/images/brand-logos/suzuki.png',
  harleydavidson: '/images/brand-logos/harley-davidson.png',
  triumph: '/images/brand-logos/triumph.png',
  kymco: '/images/brand-logos/kymco.png',
  ducati: '/images/brand-logos/ducati.png',
  royalenfield: '/images/brand-logos/royal-enfield.svg',
  piaggio: '/images/brand-logos/piaggio.png',
  ktm: '/images/brand-logos/ktm.png',
  aprilia: '/images/brand-logos/aprilia.png',
  vespa: '/images/brand-logos/vespa.svg',
  motoguzzi: '/images/brand-logos/moto-guzzi.png',
  indian: '/images/brand-logos/indian.png',
  indianmotorcycle: '/images/brand-logos/indian.png',
  zontes: '/images/brand-logos/zontes.png',
  mash: '/images/brand-logos/mash.png',
  husqvarna: '/images/brand-logos/husqvarna.png',
  husqvarnamotorcycles: '/images/brand-logos/husqvarna.png',
  benelli: '/images/brand-logos/benelli.png',
  rieju: '/images/brand-logos/rieju.png',
  sherco: '/images/brand-logos/sherco.png',
  fantic: '/images/brand-logos/fantic.png',
  beta: '/images/brand-logos/beta.svg',
  maxxess: '/images/brand-logos/maxxess.png',
  cardy: '/images/brand-logos/cardy.png',
  speedway: '/images/brand-logos/speedway.png',
  dafy: '/images/brand-logos/dafy.png',
  dafymoto: '/images/brand-logos/dafy.png',
  docbiker: '/images/brand-logos/docbiker.png',
  teamaxe: '/images/brand-logos/teamaxe.png',
  motoaxxe: '/images/brand-logos/moto-axxe.png',
};

function normalizeBrandKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'et')
    .replace(/[^a-z0-9]/g, '');
}

export function getBrandLogoPath(
  brand: string | null | undefined
): string | null {
  if (!brand) return null;

  return (
    BRAND_LOGOS[normalizeBrandKey(brand)] ??
    null
  );
}
