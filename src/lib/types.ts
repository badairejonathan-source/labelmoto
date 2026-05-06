
export interface Dealership {
  id: string;
  placeUrl: string;
  title: string;
  address: string;
  website: string;
  phoneNumber: string;
  pnoneNumber?: string; // Support for typo in some data
  email: string;
  imgUrl: string;
  img_url?: string;
  image_url?: string;
  imageUrl?: string;
  mardi: string;
  mercredi: string;
  jeudi: string;
  vendredi: string;
  samedi: string;
  dimanche: string;
  lundi: string;
  latitude?: number;
  longitude?: number;
  position?: [number, number];
  rating?: string;
  category?: string;
  appSection?: 'shopping' | 'service' | 'both' | 'association' | 'relais';
  brands?: string[];
  // Association specific fields
  emails?: string[];
  facebookUrl?: string;
  instagramUrl?: string;
  allPhoneNumbers?: string[];
  associationType?: string;
  activities?: string[];
  targetAudience?: string[];
  sourceUrl?: string;
  verificationStatus?: string;
  info?: string;
  // Relais specific
  reviewCount?: number;
  plusCode?: string;
  [key: string]: any;
}
