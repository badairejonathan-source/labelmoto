
import React from 'react';
import { Dealership, Service } from '@/lib/types';
import { Phone, Wrench, Tag, Navigation, Star } from 'lucide-react';

interface DealershipCardProps { data: Dealership; isSelected?: boolean; onClick: () => void; }
export const DealershipCard: React.FC<DealershipCardProps> = ({ data, isSelected, onClick }) => {
  const getRatingBadge = (rating: number) => {
    if (rating >= 4.7) return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'OR', border: 'border-amber-200' };
    if (rating >= 4.5) return { bg: 'bg-gray-100', text: 'text-gray-600', label: 'ARGENT', border: 'border-gray-200' };
    if (rating >= 4.0) return { bg: 'bg-orange-50', text: 'text-orange-700', label: 'BRONZE', border: 'border-orange-200' };
    return { bg: 'bg-slate-100', text: 'text-slate-600', label: 'STD', border: 'border-slate-200' };
  };
  const badge = getRatingBadge(data.rating);
  return (
    <div onClick={onClick} className={`relative p-4 border-b border-gray-200 cursor-pointer transition-all duration-300 ${isSelected ? 'bg-red-50 border-l-4 border-l-red-600' : 'bg-white hover:bg-gray-50'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="pr-2">
          <div className="flex items-center gap-2 mb-1">
             <h3 className="text-lg font-bold text-gray-900 leading-tight">{data.name}</h3>
             <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}><Star size={8} fill="currentColor" />{badge.label}</div>
          </div>
          <p className="text-sm text-gray-500">{data.address}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {data.openNow ? (<span className="flex items-center text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">OUVERT</span>) : (<span className="flex items-center text-[10px] font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">FERMÉ</span>)}
          <div className="flex items-center gap-1 text-xs font-bold text-gray-700"><span>{data.rating}</span><Star size={10} className="text-yellow-500" fill="#EAB308" /></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded border border-gray-200">{data.brand}</span>
        {data.services.includes(Service.REPAIR) && <span className="flex items-center text-xs text-gray-500 gap-1"><Wrench size={12} /> Atelier</span>}
        {data.services.includes(Service.SALES) && <span className="flex items-center text-xs text-gray-500 gap-1"><Tag size={12} /> Stock: {data.stockCount}</span>}
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <a href={`tel:${data.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 py-2 rounded text-sm font-medium transition-colors"><Phone size={16} />Appeler</a>
        <a href={`https://maps.google.com/?q=${data.position[0]},${data.position[1]}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-bold shadow-md shadow-red-200 transition-colors"><Navigation size={16} />Itinéraire</a>
      </div>
    </div>
  );
};
