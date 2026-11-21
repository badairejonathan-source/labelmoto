/** Autorisation serveur identique a celle du provider Firebase client.
 * Un UID connu seul ne suffit pas : email Firebase verifie obligatoire.
 */
import type {DecodedIdToken} from 'firebase-admin/auth';
import type {Firestore} from 'firebase-admin/firestore';

const MASTER_UIDS=new Set([
  'A36FqeWBHjQBLKQMaMSiFVBzGV22',
  'A366V1X8Hqf1pA63nU3N8B7l8fD3',
  'f7xVfH8R8mS5v8H7N3nU3N8B7l8f',
]);
const MASTER_EMAILS=new Set(['badjoe950@hotmail.com']);

export async function isServerAdmin(db:Firestore,caller:DecodedIdToken):Promise<boolean>{
  const email=typeof caller.email==='string'?caller.email.trim().toLowerCase():'';
  if(caller.email_verified===true &&
    (MASTER_UIDS.has(caller.uid) || (email!=='' && MASTER_EMAILS.has(email)))) {
    return true;
  }
  const profile=await db.collection('users').doc(caller.uid).get();
  return profile.exists && profile.get('role')==='admin';
}
