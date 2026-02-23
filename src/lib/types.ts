export interface Dealership {
  id: string;
  placeUrl: string;
  title: string;
  address: string;
  website: string;
  phoneNumber: string;
  email: string;
  imgUrl: string;
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
  appSection?: 'shopping' | 'service' | 'both';
  brands?: string[];
  [key: string]: any; // Index signature
}
