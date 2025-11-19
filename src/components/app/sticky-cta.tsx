import { Bolt, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-gray-900 text-white p-3 md:hidden">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <ShieldCheck className="h-8 w-8 text-primary-foreground" />
            <Bolt className="absolute -top-1 -right-1 h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
          </div>
          <div>
            <p className="font-bold text-sm">Assurance Moto</p>
            <p className="text-xs text-gray-400">Obtenez un devis en 2 min</p>
          </div>
        </div>
        <Button size="sm" variant="secondary">
          Simuler
        </Button>
      </div>
    </div>
  );
}
