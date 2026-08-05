const fs = require('fs');
const content = fs.readFileSync('firestore.rules', 'utf8');
const old = '    match /motorcycle_sheets/{id} { allow read: if true; allow write: if isAdmin(); }';
const replacement = `    match /motorcycle_sheets/{id} {
      allow read: if true;
      allow write: if isAdmin();
      match /comments/{commentId} {
        allow read: if true;
        allow create: if isSignedIn();
        allow write: if isAdmin();
      }
    }`;
const count = content.split(old).length - 1;
console.log('Occurrences trouvees:', count);
if (count === 1) {
  fs.writeFileSync('firestore.rules', content.replace(old, replacement), 'utf8');
  console.log('Fichier modifie avec succes.');
} else {
  console.log('ECHEC - occurrences != 1, rien modifie.');
}
