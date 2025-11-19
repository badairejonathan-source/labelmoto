
import React from 'react';
import type { AdvicePost } from '@/lib/types';
import { Clock, ChevronRight } from 'lucide-react';
import { AdSpace } from './ad-space';

interface AdviceListProps { articles: AdvicePost[]; }
export const AdviceList: React.FC<AdviceListProps> = ({ articles }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 w-full overflow-y-auto h-full pb-24">
      <div className="mb-8 text-center"><h2 className="text-2xl font-bold text-gray-900 mb-2">Conseils & Guides Moto</h2><p className="text-gray-500">L'expertise de nos partenaires pour mieux rouler.</p></div>
      <div className="grid gap-6">
        <AdSpace format="rectangle" className="mb-4 rounded-lg" label="Sponsor A la une" />
        {articles.map((article, index) => (
          <React.Fragment key={article.id}>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex justify-between items-start mb-2"><span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{article.category}</span><span className="text-gray-400 text-xs flex items-center gap-1"><Clock size={12} /> {article.readTime}</span></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{article.summary}</p>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100"><span className="text-xs text-gray-400">{article.date}</span><span className="flex items-center text-red-600 text-sm font-bold">Lire l'article <ChevronRight size={16} /></span></div>
            </div>
            {index === 1 && (<AdSpace format="banner" className="rounded-lg" label="Publicité Native" />)}
          </React.Fragment>
        ))}
        <AdSpace format="rectangle" className="mt-4 rounded-lg" label="Offres Partenaires" />
      </div>
    </div>
  );
};
