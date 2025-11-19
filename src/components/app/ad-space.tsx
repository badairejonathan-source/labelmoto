import { cn } from '@/lib/utils';
import { Megaphone } from 'lucide-react';

type AdSpaceProps = {
  type: 'banner' | 'in-list';
};

export function AdSpace({ type }: AdSpaceProps) {
  if (type === 'in-list') {
    return (
      <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-yellow-500 bg-yellow-100/50 p-6 text-center text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
        <Megaphone className="h-8 w-8" />
        <p className="font-semibold">Espace Sponsorisé</p>
        <p>Votre concession ici ? Contactez-nous.</p>
      </div>
    );
  }

  if (type === 'banner') {
    return (
      <div className="m-4 flex items-center justify-center rounded-lg bg-gray-200 p-8 text-center text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        <p className="font-bold">Bannière Publicitaire (Placeholder)</p>
      </div>
    );
  }

  return null;
}
