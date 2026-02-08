import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import MotoTrustLogo from '@/components/app/logo';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop"
        alt="Motorcycle on a road"
        fill
        className="object-cover z-0 opacity-40"
        priority
        data-ai-hint="motorcycle road"
      />
      <div className="absolute top-8 left-8 z-20">
        <MotoTrustLogo className="w-40" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.5)' }}>
          Le meilleur de la moto, près de chez vous.
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-200" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          Découvrez les meilleures concessions et ateliers pour l'achat, la vente et l'entretien de votre moto.
        </p>
        <Link href="/map">
          <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg transition-transform transform hover:scale-105">
            Trouver ma concession
          </Button>
        </Link>
      </div>
    </div>
  );
}
