
export interface MapPoint {
  id: string;
  latitude: number;
  longitude: number;
  category: string;
  appSection: 'shopping' | 'service' | 'both' | 'association' | 'relais';
  title: string;
  slug?: string;
  geohash?: string;
  imgUrl?: string;
  rating?: string | number;
}

export interface Dealership {
  id: string;
  slug?: string;
  placeUrl?: string;
  plusCode?: string;
  title: string;
  address: string;
  addresss?: string; // Compatibilité triple 's'
  website: string;
  phoneNumber: string;
  pnoneNumber?: string;
  email: string;
  imgUrl: string;
  img_url?: string;
  image_url?: string;
  imageUrl?: string;
  geohash?: string;
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
  ratingNumber?: number;
  reviewCount?: number;
  category?: string;
  appSection?: 'shopping' | 'service' | 'both' | 'association' | 'relais';
  brands?: string[];
  isClaimed?: boolean;
  country?: string;
  timestamp?: any;
  publishedAt?: any;
  submissionId?: string;
  currentStatus?: string;
  info?: string;
  emails?: string[];
  facebookUrl?: string;
  instagramUrl?: string;
  allPhoneNumbers?: string[];
  associationType?: string;
  activities?: string[];
  targetAudience?: string[];
  sourceUrl?: string;
  verificationStatus?: string;
  [key: string]: any;
}
