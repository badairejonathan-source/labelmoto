
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {onDocumentCreated, onDocumentUpdated} from "firebase-functions/v2/firestore";
import {getFirestore} from "firebase-admin/firestore";
import {setGlobalOptions} from "firebase-functions";
import {defineSecret} from "firebase-functions/params";
import {getAuth} from "firebase-admin/auth";
import {initializeApp} from "firebase-admin/app";
import {Resend} from "resend";
import {
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
  getFicheValideeEmailTemplate,
} from "./emails/templates";

initializeApp();
setGlobalOptions({maxInstances: 10});

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const FROM_EMAIL = "Label Moto <noreply@labelmoto.fr>";

export const sendWelcomeEmail = onDocumentCreated(
  {document: "users/{userId}", secrets: [RESEND_API_KEY]},
  async (event) => {
    const data = event.data?.data();
    if (!data) return;
    const email = data.email ?? "";
    
    if (!email) return;
    const resend = new Resend(RESEND_API_KEY.value());
    const verificationLink = await getAuth().generateEmailVerificationLink(email);
    const html = getVerificationEmailTemplate(verificationLink);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Bienvenue sur Label Moto - Valide ton email",
      html,
    });
  }
);

export const sendPasswordResetEmail = onCall(
  {secrets: [RESEND_API_KEY]},
  async (request) => {
    console.log("sendPasswordResetEmail called with:", JSON.stringify(request.data));
    const resend = new Resend(RESEND_API_KEY.value());
    const email = request.data.email as string;
    console.log("Email received:", email);
    if (!email) throw new HttpsError("invalid-argument", "Email requis");

    const resetLink = await getAuth().generatePasswordResetLink(email, {
      url: "https://labelmoto.fr/login",
    });
    console.log("Reset link OK:", resetLink.substring(0, 50));
    const html = getPasswordResetEmailTemplate(resetLink);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Label Moto - Reinitialisation de ton mot de passe",
      html,
    });
    console.log("Email sent successfully");
    return {success: true};
  }
);

const COLLECTION_URL_MAP: Record<string, string> = {
  associations: "concessions",
  concessions: "concessions",
  relais: "concessions",
  creators: "creators",
};

export const sendFicheValideeEmail = onDocumentUpdated(
  {document: "listing_submissions/{submissionId}", secrets: [RESEND_API_KEY]},
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;
    if (before.status === "published") return;
    if (after.status !== "published") return;

    const email = after.email;
    if (!email) {
      console.warn("sendFicheValideeEmail: pas d'email dans la submission");
      return;
    }

    const publishedCollection = after.publishedCollection;
    const publishedDocId = after.publishedDocId;
    const businessName = after.displayName || after.businessName || after.slugCandidate || "votre établissement";
    const urlSegment = COLLECTION_URL_MAP[publishedCollection as string];
    let ficheUrl = "https://labelmoto.fr";
    if (urlSegment && publishedDocId) {
      try {
        const db = getFirestore();
        const docSnap = await db.collection(publishedCollection).doc(publishedDocId).get();
        const slug = docSnap.exists ? (docSnap.data()?.slug || publishedDocId) : publishedDocId;
        const baseUrl = publishedCollection === 'creators' ? 'creators' : 'concessions';
        ficheUrl = `https://labelmoto.fr/${baseUrl}/${slug}`;
      } catch(e) {
        const baseUrl = publishedCollection === 'creators' ? 'creators' : 'concessions';
        ficheUrl = `https://labelmoto.fr/${baseUrl}/${publishedDocId}`;
      }
    }

    const resend = new Resend(RESEND_API_KEY.value());
    const html = getFicheValideeEmailTemplate(businessName, ficheUrl);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Label Moto - Ta fiche est en ligne ! 🏍️",
      html,
    });
    console.log(`Email envoyé à ${email} pour ${ficheUrl}`);
  }
);

export const sendPasswordChangedEmail = onCall(
  {secrets: [RESEND_API_KEY]},
  async (request) => {
    const resend = new Resend(RESEND_API_KEY.value());
    const email = request.auth?.token.email ?? "";
    const html = getPasswordResetEmailTemplate("https://labelmoto.fr/login");
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Label Moto - Ton mot de passe a ete modifie",
      html,
    });
    return {success: true};
  }
);

export const sendFicheEtablissementEmail = onCall(
  {secrets: [RESEND_API_KEY]},
  async (request) => {
    const resend = new Resend(RESEND_API_KEY.value());
    const email = request.auth?.token.email ?? "";
    const {nomEtablissement, validationLink} = request.data;
    if (!nomEtablissement) throw new HttpsError("invalid-argument", "Nom etablissement requis");
    if (!validationLink) throw new HttpsError("invalid-argument", "Lien de validation requis");
    const html = getVerificationEmailTemplate(validationLink);
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Label Moto - Ta fiche etablissement a ete creee",
      html,
    });
    return {success: true};
  }
);
