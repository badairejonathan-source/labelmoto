'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import data from '@/data/my-data.json';

export default function DataPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold">Adresse:</p>
              <p>{item.address}</p>
              <p className="mt-2 font-bold">Téléphone:</p>
              <p>{item.phone}</p>
              <p className="mt-2 font-bold">Horaires:</p>
              <p className="whitespace-pre-wrap">{item.hours}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
