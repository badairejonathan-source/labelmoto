const fs = require('fs');
const path = require('path');

// ─── 1. MapComponent : ajouter prop onLocateError ─────────────────────────────
const compPath = path.join(process.cwd(), 'src/components/app/map-component.tsx');
let comp = fs.readFileSync(compPath, 'utf8');

// Ajouter la prop onLocateError dans l'interface
const oldInterface = `  onLocateEnd?: () => void;`;
const newInterface = `  onLocateEnd?: () => void;
  onLocateError?: () => void;`;
if (!comp.includes('onLocateError')) {
  comp = comp.replace(oldInterface, newInterface);
  console.log('✅ Prop onLocateError ajoutée dans l\'interface MapComponent');
}

// Ajouter onLocateError dans les paramètres de la fonction
const oldParams = `  isLocating = false, onLocateEnd = () => {}, onLocationFound = () => {},`;
const newParams = `  isLocating = false, onLocateEnd = () => {}, onLocateError = () => {}, onLocationFound = () => {},`;
if (!comp.includes('onLocateError = () => {}')) {
  comp = comp.replace(oldParams, newParams);
  console.log('✅ Paramètre onLocateError ajouté dans MapComponent');
}

// Appeler onLocateError dans handleLocationError
const oldErrorHandler = `    const handleLocationError = () => {
      console.warn('Géolocalisation refusée ou indisponible');
      onLocateEnd();
    };`;
const newErrorHandler = `    const handleLocationError = () => {
      console.warn('Géolocalisation refusée ou indisponible');
      onLocateEnd();
      onLocateError();
    };`;
if (!comp.includes('onLocateError()')) {
  comp = comp.replace(oldErrorHandler, newErrorHandler);
  console.log('✅ onLocateError() appelé dans handleLocationError');
}

fs.writeFileSync(compPath, comp, 'utf8');

// ─── 2. page.tsx : ajouter état d'erreur + feedback visible ──────────────────
const pagePath = path.join(process.cwd(), 'src/app/map/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// Ajouter l'état isLocatingError
const oldState = `  const [isLocating, setIsLocating] = useState(false);`;
const newState = `  const [isLocating, setIsLocating] = useState(false);
  const [isLocatingError, setIsLocatingError] = useState(false);`;
if (!page.includes('isLocatingError')) {
  page = page.replace(oldState, newState);
  console.log('✅ État isLocatingError ajouté');
}

// Ajouter la prop onLocateError sur MapComponent
const oldLocateEnd = `          onLocateEnd={() => setIsLocating(false)}`;
const newLocateEnd = `          onLocateEnd={() => setIsLocating(false)}
          onLocateError={() => { setIsLocating(false); setIsLocatingError(true); setTimeout(() => setIsLocatingError(false), 3000); }}`;
if (!page.includes('onLocateError')) {
  page = page.replace(oldLocateEnd, newLocateEnd);
  console.log('✅ onLocateError connecté dans page.tsx');
}

// Améliorer le bouton avec feedback visuel d'erreur
const oldButton = `        onClick={() => setIsLocating(true)}
      >
        <Compass className={cn("h-8 w-8", isLocating && "animate-spin")} />
      </button>`;

const newButton = `        onClick={() => { setIsLocatingError(false); setIsLocating(true); }}
        title={isLocatingError ? "Géolocalisation bloquée — autorisez-la dans votre navigateur" : "Me localiser"}
      >
        {isLocatingError ? (
          <span className="text-red-500 font-black text-lg">✕</span>
        ) : (
          <Compass className={cn("h-8 w-8", isLocating && "animate-spin")} />
        )}
      </button>
      {isLocatingError && (
        <div className="fixed right-4 z-[1400] bg-white border-2 border-red-200 rounded-2xl px-4 py-3 shadow-xl text-[11px] font-bold text-red-600 max-w-[220px] text-center"
          style={{ bottom: width === undefined ? '280px' : isMobile ? 'calc(50vh + 100px)' : '110px' }}>
          📍 Géolocalisation bloquée.<br/>
          <span className="text-muted-foreground font-medium">Autorisez-la dans les réglages de votre navigateur.</span>
        </div>
      )}`;

if (!page.includes('isLocatingError ? (')) {
  page = page.replace(oldButton, newButton);
  console.log('✅ Feedback visuel d\'erreur ajouté sur le bouton');
}

fs.writeFileSync(pagePath, page, 'utf8');
console.log('\n✅ Corrections géolocalisation terminées');
