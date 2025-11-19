import type { AdvicePost } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

type AdviceListProps = {
  posts: AdvicePost[];
};

export function AdviceList({ posts }: AdviceListProps) {
  return (
    <ScrollArea className="h-full flex-1">
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        <h1 className="text-4xl font-bold font-headline mb-2">Conseils Moto</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Nos experts partagent leurs meilleurs conseils pour les passionnés de deux-roues.
        </p>
        <div className="grid gap-6">
          {posts.map(post => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl font-bold leading-tight">{post.title}</CardTitle>
                  <Badge variant="secondary">{post.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{post.summary}</CardDescription>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground flex justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {post.readTime} min de lecture
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" /> Publié le {format(parseISO(post.date), 'd MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
