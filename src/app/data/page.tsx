'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import data from '@/app/data/my-data.json';

export default function DataPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{item.shortDescription}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
