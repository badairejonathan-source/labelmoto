'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import data from '@/data/my-data.json';

export default function DataPage() 
  return (
    <div className="flex flex-col h-[100svh] w-full overflow-hidden bg-background">
      {/* 1. HEADER : Priorité absolue avec z-[2000] */}
      <Header>
        {renderFilters()}
      </Header>

      {/* 2. CONTENEUR PRINCIPAL : Divise l'espace restant sous le header */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        
        {/* COLONNE GAUCHE (35%) : La "prison" des fiches */}
        <aside className="w-[35%] flex-shrink-0 h-full flex flex-col bg-background border-r border-border z-10 shadow-md">
          {/* listContent contient déjà son propre ScrollArea, il va donc remplir l'espace */}
          {listContent}
        </aside>

        {/* COLONNE DROITE (65%) : La zone de la carte */}
        {/* FIX: On ajoute "relative" et "z-0" pour que la carte reste en dessous du header */}
        <main className="w-[65%] h-full relative z-0 bg-gray-100">
          {/* FIX: Ce conteneur absolute inset-0 force la carte à ne JAMAIS disparaître au dézoom */}
          <div className="absolute inset-0">
            <MapComponent 
              dealerships={hasActiveFilters ? filteredDealerships : allDealerships}
              center={mapCenter} 
              zoom={mapZoom} 
              hoveredDealershipId={hoveredDealershipId}
              selectedDealershipId={selectedDealershipId}
              onMarkerClick={handleMarkerClick}
              onMarkerMouseOver={handleMarkerMouseOver}
              onMarkerMouseOut={handleMouseOut}
              isMobile={false}
              onNearbyChange={handleNearbyChange}
              onMapZoom={handleMapZoom}
            />
          </div>
        </main>

      </div>
    </div>
  );
