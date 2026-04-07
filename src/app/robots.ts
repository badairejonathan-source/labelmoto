// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // S'applique à tous les moteurs de recherche (Google, Bing, etc.)
      allow: '/',     // Autorise l'exploration de tout le site
      disallow: [
        '/admin',     // Cache tes pages de gestion
        '/login',     // Cache la page de connexion
        '/private/',  // Cache tes dossiers de test ou privés
      ],
    },
    // Indique l'adresse de ton plan de site pour un indexage plus rapide
    sitemap: 'https://labelmoto.fr/sitemap.xml', 
  }
}