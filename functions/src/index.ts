
import {onCall, HttpsError} from "firebase-functions/v2/https";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {setGlobalOptions} from "firebase-functions";
import {defineSecret} from "firebase-functions/params";
import {getAuth} from "firebase-admin/auth";
import {initializeApp} from "firebase-admin/app";
import {Resend} from "resend";
import {
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
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
