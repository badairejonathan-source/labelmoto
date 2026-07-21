const fs = require('fs');
const path = require('path');

// ─── 1. Ajouter getStorageInstance dans config-client.ts ──────────────────────
const configPath = path.join(process.cwd(), 'src/firebase/config-client.ts');
let config = fs.readFileSync(configPath, 'utf8');

const oldImports = `import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;`;

const newImports = `import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;`;

if (!config.includes('FirebaseStorage') && config.includes(oldImports)) {
  config = config.replace(oldImports, newImports);
  console.log('✅ Import FirebaseStorage ajouté');
}

// Ajouter la fonction getStorageInstance à la fin du fichier
if (!config.includes('getStorageInstance')) {
  config = config.trimEnd() + `
/**
 * Récupère l'instance Firebase Storage (Singleton).
 */
export function getStorageInstance(): FirebaseStorage | null {
  if (isServer()) return null;
  if (!storage) {
    const { firebaseApp: app } = initializeFirebaseClient();
    storage = getStorage(app);
  }
  return storage;
}
`;
  fs.writeFileSync(configPath, config, 'utf8');
  console.log('✅ getStorageInstance() ajouté dans config-client.ts');
}

// ─── 2. Mettre à jour image-upload-request.tsx ────────────────────────────────
const uploadPath = path.join(process.cwd(), 'src/components/app/image-upload-request.tsx');
let upload = fs.readFileSync(uploadPath, 'utf8');

// Remplacer l'import getStorage par getStorageInstance
const oldStorageImport = `import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';`;
const newStorageImport = `import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getStorageInstance } from '@/firebase/config-client';`;

if (!upload.includes('getStorageInstance') && upload.includes(oldStorageImport)) {
  upload = upload.replace(oldStorageImport, newStorageImport);
  console.log('✅ Import getStorageInstance ajouté dans image-upload-request.tsx');
}

// Remplacer getStorage() par getStorageInstance()
const oldGetStorage = `      const storage = getStorage();`;
const newGetStorage = `      const storage = getStorageInstance();
      if (!storage) throw new Error('Firebase Storage non disponible');`;

if (!upload.includes('getStorageInstance()') && upload.includes(oldGetStorage)) {
  upload = upload.replace(oldGetStorage, newGetStorage);
  console.log('✅ getStorage() remplacé par getStorageInstance()');
}

fs.writeFileSync(uploadPath, upload, 'utf8');
console.log('\n✅ Firebase Storage correctement initialisé');
