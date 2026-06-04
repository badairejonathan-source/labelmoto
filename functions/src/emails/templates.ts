/**
 * @fileOverview Templates HTML premium pour les emails Label Moto.
 * Design responsive, épuré et brandé.
 */

const BRAND_COLOR = "#EA580C";
const BG_COLOR = "#F8FAFC";
const TEXT_COLOR = "#1E293B";

const layout = (content: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: ${BG_COLOR}; color: ${TEXT_COLOR}; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #E2E8F0; }
    .logo { margin-bottom: 32px; text-align: center; }
    .logo img { height: 40px; max-width: 180px; width: auto; }
    h1 { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; margin-bottom: 24px; text-align: center; }
    p { font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #475569; }
    .button-container { text-align: center; margin: 32px 0; }
    .button { background-color: ${BRAND_COLOR}; color: white !important; padding: 16px 32px; border-radius: 9999px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; box-shadow: 0 10px 15px -3px rgba(234, 88, 12, 0.3); }
    .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #94A3B8; }
    .secondary-link { font-size: 11px; word-break: break-all; color: #94A3B8; margin-top: 24px; display: block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <img src="https://labelmoto.fr/images/logo-moto.webp" alt="Label Moto">
      </div>
      ${content}
      <div class="footer">
        &copy; ${new Date().getFullYear()} Label Moto. Plateforme nationale motarde.<br>
        Besoin d'aide ? <a href="mailto:contact@labelmoto.fr" style="color: ${BRAND_COLOR}">Contactez-nous</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const getVerificationEmailTemplate = (link: string) => layout(`
  <h1>Validez votre compte</h1>
  <p>Bonjour,</p>
  <p>Merci de rejoindre la communauté <strong>Label Moto</strong> ! On a hâte de vous compter parmi nous.</p>
  <p>Pour finaliser votre inscription et accéder à votre espace, cliquez simplement sur le bouton ci-dessous :</p>
  <div class="button-container">
    <a href="${link}" class="button">Activer mon compte</a>
  </div>
  <p style="font-size: 13px; italic: true;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.</p>
  <span class="secondary-link">Lien alternatif : ${link}</span>
`);

export const getPasswordResetEmailTemplate = (link: string) => layout(`
  <h1>Nouveau mot de passe</h1>
  <p>Bonjour,</p>
  <p>Vous avez demandé à réinitialiser le mot de passe de votre compte <strong>Label Moto</strong>.</p>
  <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
  <div class="button-container">
    <a href="${link}" class="button">Réinitialiser mon mot de passe</a>
  </div>
  <p style="font-size: 13px; color: #EF4444;"><strong>Sécurité :</strong> Si vous n'avez pas fait cette demande, quelqu'un a peut-être saisi votre adresse e-mail par erreur. Votre compte reste protégé tant que vous ne cliquez pas sur ce lien.</p>
  <span class="secondary-link">Lien alternatif : ${link}</span>
`);

export const getFicheValideeEmailTemplate = (businessName: string, ficheUrl: string) => layout(`
  <h1>Ta fiche est en ligne !</h1>
  <p>Bonjour,</p>
  <p>Bonne nouvelle ! La fiche de <strong>${businessName}</strong> vient d'être validée et publiée sur <strong>Label Moto</strong>.</p>
  <p>Elle est désormais visible par toute la communauté motarde. Clique ci-dessous pour la consulter :</p>
  <div class="button-container">
    <a href="${ficheUrl}" class="button">Voir ma fiche</a>
  </div>
  <div style="background:#FFF7ED;border:1px solid #FDBA74;border-radius:12px;padding:16px 20px;margin:24px 0;">
    <p style="margin:0;color:#9A3412;font-size:14px;">💡 <strong>Astuce :</strong> Partage le lien de ta fiche sur tes réseaux pour maximiser ta visibilité auprès des motards !</p>
  </div>
  <p style="font-size:13px;color:#94A3B8;">Une erreur sur ta fiche ? Écris-nous à <a href="mailto:contact@labelmoto.fr" style="color:${BRAND_COLOR}">contact@labelmoto.fr</a></p>
  <span class="secondary-link">Lien direct : ${ficheUrl}</span>
`);
