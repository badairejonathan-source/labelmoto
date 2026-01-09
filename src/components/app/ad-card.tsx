
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AdCard: React.FC = () => {
  return (
    <Card className="w-full h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-dashed">
      <CardContent className="p-3 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Publicité</p>
      </CardContent>
    </Card>
  );
};

export default AdCard;
