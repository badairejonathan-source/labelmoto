
import { Brand, DealershipType, Service, type Dealership, type AdvicePost } from './types';

export const MOCK_DEALERSHIPS: Dealership[] = [
  { id: '1', name: 'Yamaha Center Elite', brand: Brand.YAMAHA, types: [DealershipType.OFFICIAL], services: [Service.SALES, Service.REPAIR], address: '12 Avenue de la Grande Armée, Paris', phone: '+33 1 40 00 00 01', position: [48.8744, 2.2930], openNow: true, stockCount: 45, rating: 4.9 },
  { id: '2', name: 'Ducati Store Performance', brand: Brand.DUCATI, types: [DealershipType.OFFICIAL], services: [Service.SALES, Service.RENTAL], address: '8 Boulevard Richard Lenoir, Paris', phone: '+33 1 40 00 00 02', position: [48.8566, 2.3722], openNow: true, stockCount: 12, rating: 4.5 },
  { id: '3', name: 'Honda Red Power', brand: Brand.HONDA, types: [DealershipType.PARTNER], services: [Service.REPAIR, Service.SALES], address: '45 Rue de Tolbiac, Paris', phone: '+33 1 40 00 00 03', position: [48.8263, 2.3670], openNow: false, stockCount: 30, rating: 3.8 },
  { id: '4', name: 'BMW Motorrad Horizon', brand: Brand.BMW, types: [DealershipType.OFFICIAL], services: [Service.SALES, Service.REPAIR, Service.RENTAL], address: '22 Avenue de Versailles, Paris', phone: '+33 1 40 00 00 04', position: [48.8480, 2.2740], openNow: true, stockCount: 55, rating: 4.8 },
  { id: '5', name: 'Kawasaki Green City', brand: Brand.KAWASAKI, types: [DealershipType.INDEPENDENT], services: [Service.REPAIR], address: '108 Rue de la Chapelle, Paris', phone: '+33 1 40 00 00 05', position: [48.8980, 2.3600], openNow: true, stockCount: 8, rating: 4.2 }
];

export const MOCK_ADVICE_POSTS: AdvicePost[] = [
  { id: '1', title: 'Comment bien choisir sa première moto A2 ?', category: 'Achat', summary: 'Roadster, Trail ou Sportive ? Nos conseils pour ne pas se tromper.', readTime: '5 min', date: '12 Oct 2023' },
  { id: '2', title: "L'entretien hivernal : les 5 points clés", category: 'Mécanique', summary: 'Batterie, pneus, graissage... Préparez votre machine.', readTime: '3 min', date: '05 Nov 2023' },
  { id: '3', title: 'Assurance moto : Tout comprendre', category: 'Administratif', summary: 'Tiers, Vol, Tous risques ? On décrypte pour vous.', readTime: '7 min', date: '20 Nov 2023' }
];

export const BRANDS = Object.values(Brand);
export const SERVICES = Object.values(Service);
