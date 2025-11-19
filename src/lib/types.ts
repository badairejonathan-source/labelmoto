
export enum Brand {
  YAMAHA = 'YAMAHA',
  DUCATI = 'DUCATI',
  HONDA = 'HONDA',
  BMW = 'BMW',
  KAWASAKI = 'KAWASAKI',
}

export enum DealershipType {
  OFFICIAL = 'Officiel',
  INDEPENDENT = 'Indépendant',
  PARTNER = 'Partenaire',
}

export enum Service {
  SALES = 'Vente',
  REPAIR = 'Atelier',
  RENTAL = 'Location',
}

export type Dealership = {
  id: string;
  name: string;
  brand: Brand;
  types: DealershipType[];
  services: Service[];
  address: string;
  phone: string;
  position: [number, number];
  openNow: boolean;
  stockCount: number;
  rating: number;
};

export type AdvicePost = {
  id: string;
  title: string;
  category: string;
  summary: string;
  readTime: string;
  date: string;
};
