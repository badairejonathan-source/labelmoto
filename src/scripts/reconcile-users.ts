/**
 * @fileOverview Script CLI de réconciliation rétroactive des comptes utilisateurs.
 * Utilise le Firebase Admin SDK pour une migration fiable et idempotente.
 */

import * as admin from 'firebase-admin';
import 'dotenv/config';

// Initialisation de Firebase Admin
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-4801889514-40ebd";

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: projectId,
  });
}

const db = admin.firestore();

async function runReconciliation() {
  const isApply = process.argv.includes('--apply');
  const startedAt = new Date();

  console.log(`\n🚀 [RECONCILE] Démarrage du script (${isApply ? 'MODE APPLY' : 'DRY RUN'})\n`);

  try {
    // 1. Audit complet
    console.log("📊 Collecte des données...");
    const [usersSnap, stdSnap, proSnap] = await Promise.all([
      db.collection('users').get(),
      db.collection('standardProfiles').get(),
      db.collection('professionalProfiles').get()
    ]);

    const existingUserIds = new Set(usersSnap.docs.map(d => d.id));
    const allProfiles = [
      ...stdSnap.docs.map(d => ({ snap: d, type: 'user' as const })),
      ...proSnap.docs.map(d => ({ snap: d, type: 'pro' as const }))
    ];

    const report = {
      totalAnalyzed: allProfiles.length,
      missingInNoyau: 0,
      created: 0,
      skipped: 0,
      errors: 0,
      details: [] as any[]
    };

    console.log(`🔍 Analyse de ${allProfiles.length} profils existants...`);

    // 2. Traitement
    for (const item of allProfiles) {
      const uid = item.snap.id;
      const data = item.snap.data();

      // On skip si le document noyau existe déjà
      if (existingUserIds.has(uid)) {
        report.skipped++;
        continue;
      }

      report.missingInNoyau++;
      const displayName = data.companyName || data.pseudo || data.displayName || (item.type === 'pro' ? 'Professionnel' : 'Motard');
      const email = data.email || '';

      if (isApply) {
        try {
          console.log(`🛠️ Création users/${uid} (${displayName})`);

          // Préparation de la date de création
          let creationDate: any = admin.firestore.FieldValue.serverTimestamp();
          if (data.createdAt) {
             if (data.createdAt.toDate) {
               creationDate = data.createdAt.toDate();
             } else if (data.createdAt.seconds) {
               creationDate = new Date(data.createdAt.seconds * 1000);
             }
          }

          await db.collection('users').doc(uid).set({
            uid: uid,
            email: email,
            displayName: displayName,
            role: item.type,
            status: 'active',
            emailVerifiedSync: false,
            onboardingComplete: true,
            legacyMigrated: true,
            createdAt: creationDate,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            sourceProvider: 'cli_reconciliation_v1'
          }, { merge: true });

          report.created++;
          report.details.push({ uid, status: 'created', name: displayName });
        } catch (err: any) {
          console.error(`❌ Erreur sur UID ${uid}:`, err.message);
          report.errors++;
          report.details.push({ uid, status: 'error', name: displayName, error: err.message });
        }
      } else {
        console.log(`[DRY] À créer : ${uid} | ${displayName} (${email})`);
        report.details.push({ uid, status: 'to_create', name: displayName });
      }
    }

    // 3. Résumé final
    console.log("\n" + "=".repeat(50));
    console.log(`🏁 RÉSUMÉ DU SCRIPT (${isApply ? 'APPLY' : 'DRY RUN'})`);
    console.log("=".repeat(50));
    console.log(`Total analysés      : ${report.totalAnalyzed}`);
    console.log(`Absents du noyau    : ${report.missingInNoyau}`);
    console.log(`Créés réellement    : ${report.created}`);
    console.log(`Déjà présents       : ${report.skipped}`);
    console.log(`Erreurs             : ${report.errors}`);
    console.log("=".repeat(50) + "\n");

    if (isApply) {
      // Persistence du rapport
      await db.collection('migration_runs').add({
        startedAt: admin.firestore.Timestamp.fromDate(startedAt),
        finishedAt: admin.firestore.Timestamp.now(),
        startedBy: 'cli_admin',
        status: report.errors > 0 ? 'completed_with_errors' : 'success',
        analyzedCount: report.totalAnalyzed,
        createdCount: report.created,
        skippedCount: report.skipped,
        errorCount: report.errors,
        command: 'npm run reconcile:apply'
      });
    }

  } catch (err) {
    console.error("\n❌ Erreur critique lors de l'exécution du script:", err);
    process.exit(1);
  }
}

runReconciliation();
