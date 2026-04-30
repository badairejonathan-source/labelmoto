
export interface Dealership {
  id: string;
  placeUrl: string;
  title: string;
  address: string;
  website: string;
  phoneNumber: string;
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
  appSection?: 'shopping' | 'service' | 'both' | 'association';
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
  [key: string]: any;
}
