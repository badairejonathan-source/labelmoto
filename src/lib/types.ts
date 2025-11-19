export enum Brand {
  YAMAHA = 'YAMAHA',
  DUCATI = 'DUCATI',
  HONDA = 'HONDA',
  BMW = 'BMW',
  KAWASAKI = 'KAWASAKI',
}

export enum DealershipType {
  OFFICIAL = 'OFFICIAL',
  INDEPENDENT = 'INDEPENDENT',
  PARTNER = 'PARTNER',
}

export enum Service {
  SALES = 'SALES',
  REPAIR = 'REPAIR',
  RENTAL = 'RENTAL',
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
  readTime: number; // in minutes
  date: string; // ISO string
};
