'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ImageUploadRequest from '@/components/app/image-upload-request';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, Loader2, MapPin, RefreshCw, Save, Send, X } from 'lucide-react';

export type ProfessionalAppSection =
  | 'shopping'
  | 'service'
  | 'both'
  | 'association'
  | 'relais'
  | 'creator';

type DayKey =
  | 'lundi'
  | 'mardi'
  | 'mercredi'
  | 'jeudi'
  | 'vendredi'
  | 'samedi'
  | 'dimanche';

export interface ProfessionalListingFormValues {
  name: string;
  appSection: ProfessionalAppSection;
  category: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  facebook: string;
  instagram: string;
  description: string;
  horaires: Record<DayKey, string>;
  imageUrl: string;
  googleMapsUrl: string;
  latitude: number | null;
  longitude: number | null;
}

interface HoursParts {
  om: string;
  fm: string;
  oa: string;
  fa: string;
  ferme: boolean;
}

interface ProfessionalListingFormProps {
  initialValues?: Partial<ProfessionalListingFormValues>;
  accountEmail?: string;
  emailReadOnly?: boolean;
  adminMode?: boolean;
  listingId?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  allowedSections?: ProfessionalAppSection[];
  onCreatorSelected?: () => void;
  onSubmit: (values: ProfessionalListingFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

const DAYS: DayKey[] = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
];

const HOURS = [
  '',
  '07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30',
  '17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00',
];

const SECTION_LABELS: Record<ProfessionalAppSection, string> = {
  shopping: 'Concessionnaire (Vente)',
  service: 'Atelier / Garage (Réparation)',
  both: 'Mixte (Vente & Service)',
  association: 'Association / Club',
  relais: 'Relais Motard (Hôtel/Resto)',
  creator: 'Photographe / Vidéaste',
};

function emptyHours(): Record<DayKey, HoursParts> {
  return {
    lundi:    { om: '', fm: '', oa: '', fa: '', ferme: false },
    mardi:    { om: '', fm: '', oa: '', fa: '', ferme: false },
    mercredi: { om: '', fm: '', oa: '', fa: '', ferme: false },
    jeudi:    { om: '', fm: '', oa: '', fa: '', ferme: false },
    vendredi: { om: '', fm: '', oa: '', fa: '', ferme: false },
    samedi:   { om: '', fm: '', oa: '', fa: '', ferme: false },
    dimanche: { om: '', fm: '', oa: '', fa: '', ferme: true },
  };
}

function normalizeTime(value: string): string {
  const raw = value.trim().toLowerCase().replace(/\s+/g, '');
  if (!raw) return '';

  const colon = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (colon) {
    return `${colon[1].padStart(2, '0')}:${colon[2]}`;
  }

  const h = raw.match(/^(\d{1,2})h(?:(\d{2}))?$/);
  if (h) {
    return `${h[1].padStart(2, '0')}:${h[2] || '00'}`;
  }

  return '';
}

function parseHours(rawValue: string): HoursParts {
  const raw = String(rawValue || '').trim();
  if (!raw) return { om: '', fm: '', oa: '', fa: '', ferme: false };
  if (/ferm[eé]/i.test(raw)) return { om: '', fm: '', oa: '', fa: '', ferme: true };

  const ranges = raw
    .split(/[,;|]/)
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => {
      const [start, end] = part.split(/\s*[-–—]\s*/);
      return [normalizeTime(start || ''), normalizeTime(end || '')] as const;
    })
    .filter(([start, end]) => Boolean(start && end));

  return {
    om: ranges[0]?.[0] || '',
    fm: ranges[0]?.[1] || '',
    oa: ranges[1]?.[0] || '',
    fa: ranges[1]?.[1] || '',
    ferme: false,
  };
}

function toHoursState(values?: Partial<Record<DayKey, string>>): Record<DayKey, HoursParts> {
  const fallback = emptyHours();
  const result = { ...fallback } as Record<DayKey, HoursParts>;

  for (const day of DAYS) {
    if (values && Object.prototype.hasOwnProperty.call(values, day)) {
      result[day] = parseHours(values[day] || '');
    }
  }

  return result;
}

function formatHours(value: HoursParts): string {
  if (value.ferme) return 'Fermé';
  const morning = value.om && value.fm ? `${value.om}-${value.fm}` : '';
  const afternoon = value.oa && value.fa ? `${value.oa}-${value.fa}` : '';
  return [morning, afternoon].filter(Boolean).join(', ');
}

function buildInitialValues(
  initialValues: Partial<ProfessionalListingFormValues> | undefined,
  accountEmail: string | undefined,
): ProfessionalListingFormValues {
  return {
    name: initialValues?.name || '',
    appSection: initialValues?.appSection || 'shopping',
    category: initialValues?.category || '',
    address: initialValues?.address || '',
    phone: initialValues?.phone || '',
    email: initialValues?.email || accountEmail || '',
    website: initialValues?.website || '',
    facebook: initialValues?.facebook || '',
    instagram: initialValues?.instagram || '',
    description: initialValues?.description || '',
    horaires: {
      lundi: initialValues?.horaires?.lundi || '',
      mardi: initialValues?.horaires?.mardi || '',
      mercredi: initialValues?.horaires?.mercredi || '',
      jeudi: initialValues?.horaires?.jeudi || '',
      vendredi: initialValues?.horaires?.vendredi || '',
      samedi: initialValues?.horaires?.samedi || '',
      dimanche: initialValues?.horaires?.dimanche || 'Fermé',
    },
    imageUrl: initialValues?.imageUrl || '',
    googleMapsUrl: initialValues?.googleMapsUrl || '',
    latitude: initialValues?.latitude ?? null,
    longitude: initialValues?.longitude ?? null,
  };
}

export default function ProfessionalListingForm({
  initialValues,
  accountEmail,
  emailReadOnly = false,
  adminMode = false,
  listingId,
  title = 'Soumettre votre fiche',
  description = 'Données vérifiées par nos modérateurs avant mise en ligne.',
  submitLabel = 'Envoyer ma demande de référencement',
  allowedSections = ['shopping', 'service', 'both', 'association', 'relais', 'creator'],
  onCreatorSelected,
  onSubmit,
  onCancel,
}: ProfessionalListingFormProps) {
  const initial = useMemo(
    () => buildInitialValues(initialValues, accountEmail),
    [initialValues, accountEmail],
  );

  const [values, setValues] = useState<ProfessionalListingFormValues>(initial);
  const [hours, setHours] = useState<Record<DayKey, HoursParts>>(() => toHoursState(initial.horaires));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImportingMaps, setIsImportingMaps] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [adminToolError, setAdminToolError] = useState('');

  useEffect(() => {
    setValues(initial);
    setHours(toHoursState(initial.horaires));
  }, [initial]);

  const update = <K extends keyof ProfessionalListingFormValues>(key: K, value: ProfessionalListingFormValues[K]) => {
    setValues(previous => ({ ...previous, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const formatted = DAYS.reduce<Record<DayKey, string>>((acc, day) => {
        acc[day] = formatHours(hours[day]);
        return acc;
      }, {} as Record<DayKey, string>);

      await onSubmit({
        ...values,
        email: emailReadOnly ? (accountEmail || values.email) : values.email,
        horaires: formatted,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportGoogleMaps = async () => {
    if (!values.googleMapsUrl.trim()) return;
    setIsImportingMaps(true);
    setAdminToolError('');
    try {
      const response = await fetch('/api/places-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: values.googleMapsUrl.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Import Google Maps impossible.');

      const importedHours: Partial<Record<DayKey, string>> = {};
      for (const day of DAYS) {
        if (typeof data[day] === 'string' && data[day].trim()) importedHours[day] = data[day];
      }

      const next: ProfessionalListingFormValues = {
        ...values,
        name: data.title || values.name,
        address: data.address || values.address,
        phone: data.phoneNumber || values.phone,
        website: data.website || values.website,
        latitude: Number.isFinite(Number(data.latitude)) ? Number(data.latitude) : values.latitude,
        longitude: Number.isFinite(Number(data.longitude)) ? Number(data.longitude) : values.longitude,
        horaires: { ...values.horaires, ...importedHours },
      };

      setValues(next);
      setHours(toHoursState(next.horaires));
    } catch (error: any) {
      setAdminToolError(error?.message || 'Import Google Maps impossible.');
    } finally {
      setIsImportingMaps(false);
    }
  };

  const handleGeocode = async () => {
    if (!values.address.trim() && !values.googleMapsUrl.trim()) return;
    setIsGeocoding(true);
    setAdminToolError('');
    try {
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: values.address,
          googleMapsUrl: values.googleMapsUrl,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success || !Number.isFinite(Number(data.lat)) || !Number.isFinite(Number(data.lng))) {
        throw new Error('Géocodage impossible. Vérifiez l’adresse ou le lien Google Maps.');
      }
      setValues(previous => ({
        ...previous,
        latitude: Number(data.lat),
        longitude: Number(data.lng),
      }));
    } catch (error: any) {
      setAdminToolError(error?.message || 'Géocodage impossible.');
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <Card className="border-2 border-brand shadow-xl rounded-[2.5rem] overflow-hidden">
      <CardHeader className="bg-brand text-white p-8">
        <CardTitle className="text-2xl font-black uppercase tracking-tighter">{title}</CardTitle>
        <CardDescription className="text-white/80 font-bold">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Nom commercial</label>
              <Input
                value={values.name}
                onChange={event => update('name', event.target.value)}
                required
                placeholder="Ex: Moto Passion 75"
                className="font-bold h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Type de structure</label>
              <Select
                value={values.appSection}
                onValueChange={(next) => {
                  const section = next as ProfessionalAppSection;
                  if (section === 'creator' && !adminMode && onCreatorSelected) {
                    onCreatorSelected();
                    return;
                  }
                  update('appSection', section);
                }}
              >
                <SelectTrigger className="font-bold h-12 rounded-xl">
                  <SelectValue placeholder="Choisir un type" />
                </SelectTrigger>
                <SelectContent>
                  {allowedSections.map(section => (
                    <SelectItem key={section} value={section}>{SECTION_LABELS[section]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Spécialité / Catégorie</label>
            <Input
              value={values.category}
              onChange={event => update('category', event.target.value)}
              required
              placeholder="Ex: Spécialiste Ducati, Préparateur, Revendeur multimarque..."
              className="font-bold h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Adresse complète</label>
            <Textarea
              value={values.address}
              onChange={event => update('address', event.target.value)}
              required
              placeholder="Numéro, rue, code postal et ville"
              className="font-bold min-h-[80px] rounded-xl"
            />
          </div>

          {adminMode && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-800">Google Maps · admin uniquement</p>
                  <p className="text-[10px] text-blue-700 mt-1">Ce bloc n’apparaît jamais dans le formulaire professionnel.</p>
                </div>
              </div>
              <Input
                value={values.googleMapsUrl}
                onChange={event => update('googleMapsUrl', event.target.value)}
                type="url"
                placeholder="https://maps.google.com/..."
                className="font-bold h-12 rounded-xl bg-white"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleImportGoogleMaps}
                  disabled={isImportingMaps || !values.googleMapsUrl.trim()}
                  className="rounded-xl font-black uppercase text-[10px] tracking-widest"
                >
                  {isImportingMaps ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Importer depuis Google Maps
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGeocode}
                  disabled={isGeocoding}
                  className="rounded-xl font-black uppercase text-[10px] tracking-widest"
                >
                  {isGeocoding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                  Géocoder
                </Button>
              </div>
              {values.latitude !== null && values.longitude !== null && (
                <p className="text-[10px] font-black text-green-700">Coordonnées : {values.latitude.toFixed(5)}, {values.longitude.toFixed(5)}</p>
              )}
              {adminToolError && <p className="text-[10px] font-bold text-red-600">{adminToolError}</p>}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Téléphone public</label>
              <Input
                value={values.phone}
                onChange={event => update('phone', event.target.value)}
                type="tel"
                required
                placeholder="01 23 45 67 89"
                className="font-bold h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">E-mail de contact</label>
              {emailReadOnly ? (
                <div className="flex items-center h-12 px-4 rounded-xl border border-input bg-muted/50">
                  <span className="font-bold text-sm text-muted-foreground">{accountEmail || values.email}</span>
                  <span className="text-[10px] text-brand font-black uppercase ml-auto">Compte Label Moto</span>
                </div>
              ) : (
                <Input
                  value={values.email}
                  onChange={event => update('email', event.target.value)}
                  type="email"
                  placeholder="contact@entreprise.fr"
                  className="font-bold h-12 rounded-xl"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Site Web (optionnel)</label>
            <Input
              value={values.website}
              onChange={event => update('website', event.target.value)}
              type="url"
              placeholder="https://www.votre-site.fr"
              className="font-bold h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Photo de l'établissement (optionnel)</label>
            <p className="text-[10px] text-muted-foreground px-1 mb-2">Ajoutez une photo de votre façade ou devanture.</p>
            <ImageUploadRequest
              concessionSlug={listingId}
              concessionTitle={values.name || 'Nouvelle fiche'}
              onSuccess={url => update('imageUrl', url)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Facebook</label>
              <Input
                value={values.facebook}
                onChange={event => update('facebook', event.target.value)}
                type="url"
                placeholder="Lien page FB"
                className="font-bold h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Instagram</label>
              <Input
                value={values.instagram}
                onChange={event => update('instagram', event.target.value)}
                type="url"
                placeholder="Lien profil Insta"
                className="font-bold h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Horaires d'ouverture</label>
            <div className="grid gap-3">
              {DAYS.map(day => (
                <div key={day} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground capitalize">{day}</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hours[day].ferme}
                        onChange={event => setHours(previous => ({
                          ...previous,
                          [day]: { ...previous[day], ferme: event.target.checked },
                        }))}
                        className="rounded"
                      />
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Fermé</span>
                    </label>
                  </div>
                  {!hours[day].ferme && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['om', 'fm', 'oa', 'fa'] as const).map((part, index) => (
                        <select
                          key={part}
                          value={hours[day][part]}
                          onChange={event => setHours(previous => ({
                            ...previous,
                            [day]: { ...previous[day], [part]: event.target.value },
                          }))}
                          className="h-10 rounded-xl border border-input bg-background px-2 text-sm font-bold"
                        >
                          <option value="">{index % 2 === 0 ? 'Ouv.' : 'Ferm.'}</option>
                          {HOURS.filter(Boolean).map(hour => <option key={hour} value={hour}>{hour}</option>)}
                        </select>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground px-1">Matin : ouverture → fermeture &nbsp;|&nbsp; Après-midi : ouverture → fermeture</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Informations complémentaires</label>
            <Textarea
              value={values.description}
              onChange={event => update('description', event.target.value)}
              placeholder="Marques représentées, services spécifiques, informations utiles..."
              className="font-bold min-h-[120px] rounded-xl"
            />
          </div>

          <div className="bg-muted/30 p-4 rounded-2xl flex items-start gap-3">
            <Info className="h-4 w-4 text-brand shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-muted-foreground italic leading-relaxed">
              {adminMode
                ? 'Vous utilisez exactement le même formulaire que celui de création. Les champs Google Maps et géocodage sont ajoutés uniquement pour l’administration.'
                : "L'inscription est gratuite et réservée aux professionnels et structures motardes en activité. Notre équipe se réserve le droit de refuser toute demande incomplète ou non conforme à notre charte de qualité."}
            </p>
          </div>

          <div className="pt-6 border-t border-dashed flex flex-col-reverse sm:flex-row gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="sm:w-1/3 font-black uppercase tracking-widest text-xs h-14 rounded-full"
              >
                <X className="mr-2 h-5 w-5" />
                Annuler
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-brand hover:bg-brand/90 font-black uppercase tracking-widest text-xs h-14 shadow-xl rounded-full"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : adminMode ? (
                <Save className="mr-2 h-5 w-5" />
              ) : (
                <Send className="mr-2 h-5 w-5" />
              )}
              {submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
