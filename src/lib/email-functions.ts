import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";

function getFunctionsInstance() {
  const app = getApp();
  return getFunctions(app, "us-central1");
}

export async function callSendPasswordResetEmail(email: string): Promise<void> {
  const functions = getFunctionsInstance();
  const fn = httpsCallable(functions, "sendPasswordResetEmail");
  await fn({ email });
}

export async function callSendPasswordChangedEmail(): Promise<void> {
  const functions = getFunctionsInstance();
  const fn = httpsCallable(functions, "sendPasswordChangedEmail");
  await fn({});
}

export async function callSendFicheEtablissementEmail(
  nomEtablissement: string,
  validationLink: string
): Promise<void> {
  const functions = getFunctionsInstance();
  const fn = httpsCallable(functions, "sendFicheEtablissementEmail");
  await fn({ nomEtablissement, validationLink });
}
