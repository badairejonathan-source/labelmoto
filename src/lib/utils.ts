import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalise un texte pour la recherche :
 * - Minuscules
 * - Suppression des accents
 * - Remplacement des tirets/underscores par des espaces
 * - Suppression des espaces multiples
 */
export function normalizeText(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extrait de manière fiable le département d'un établissement.
 * Priorité : Champ department/departement > Extraction du code postal.
 */
export function getItemDepartment(item: any): string | null {
  const dept = item.department || item.departement;
  if (dept) return dept.toString().padStart(2, '0').slice(0, 3);

  const postalCode = item.postalCode || item.codePostal || item.zipCode || item.address?.match(/\b\d{5}\b/)?.[0];
  if (!postalCode) return null;

  const pc = postalCode.toString().trim();
  if (pc.startsWith("97")) return pc.slice(0, 3); // DOM-TOM
  if (pc.startsWith("20")) {
    // La Corse est un cas spécial, souvent traitée comme 2A/2B mais commence par 20
    return pc.slice(0, 2); 
  }
  return pc.slice(0, 2);
}

/**
 * Calcule la distance de Levenshtein entre deux chaînes.
 * Utilisé pour la tolérance aux erreurs de frappe dans la recherche.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Génère un slug propre et SEO-friendly à partir d'un texte.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Génère un slug unique pour un établissement moto.
 * Structure: nom-etablissement-ville-cp
 */
export function generateDealershipSlug(data: { title?: string; name?: string; address?: string }): string {
  const name = slugify(data.title || data.name || "etablissement");
  const address = data.address || "";
  
  // Extraction simplifiée de la ville et du CP depuis l'adresse
  const cpMatch = address.match(/\b\d{5}\b/);
  const cp = cpMatch ? cpMatch[0] : "";
  
  // On essaye d'extraire la ville (souvent après le CP ou en fin d'adresse)
  let city = "";
  if (cp) {
    const parts = address.split(cp);
    if (parts.length > 1) {
      city = slugify(parts[1].trim());
    }
  }

  const finalSlug = [name, city, cp].filter(Boolean).join("-");
  return finalSlug;
}
