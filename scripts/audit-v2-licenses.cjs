const fs = require("fs");
const path = require("path");

const root = process.cwd();

const directory = path.join(
  root,
  "src",
  "lib",
  "motorcycle-sheets-v2"
);

const renderer = fs.readFileSync(
  path.join(
    root,
    "src",
    "components",
    "app",
    "motorcycle-sheet-v2-tabbed-universal.tsx"
  ),
  "utf8"
);

const validCodes = new Set([
  "A1",
  "A2",
  "A_ET_A2",
  "A_BRIDABLE_A2",
  "A",
  "TO_CONFIRM"
]);

/*
 * Fiches historiques autorisées temporairement avec
 * l'ancien quick_fact PERMIS.
 *
 * Toute nouvelle fiche doit obligatoirement utiliser
 * license_fr + license_fr_source +
 * license_fr_verified_at.
 *
 * Cette liste doit diminuer au fur et à mesure
 * de la vérification des homologations France.
 */

const legacyAllowed = new Set([
  "cfmoto-125nk.ts",
  "cfmoto-300nk.ts",
  "cfmoto-450mt.ts",
  "cfmoto-450nk.ts",
  "cfmoto-450sr.ts",
  "cfmoto-675sr-r.ts",
  "cfmoto-700cl-x.ts",
  "cfmoto-800mt-sport-explore.ts",
  "cfmoto-800mt-touring.ts",
  "cfmoto-800mt-x.ts",
  "cfmoto-800nk.ts",

  "kove-350rr.ts",
  "kove-450rr.ts",
  "kove-510x.ts",
  "kove-800x-pro.ts",

  "voge-525dsx.ts",
  "voge-900dsx.ts",
  "voge-ds625x.ts",
  "voge-ds800x-rally.ts"
]);

let normalizedCount = 0;
let legacyCount = 0;
let missingCount = 0;
let errors = 0;

const files = fs.readdirSync(directory)
  .filter(name =>
    name.endsWith(".ts") &&
    name !== "registry.ts" &&
    name !== "index.ts" &&
    !name.includes("-shared")
  )
  .sort();

console.log("");
console.log("========== AUDIT GLOBAL PERMIS V2 ==========");

for (const name of files) {

  const source = fs.readFileSync(
    path.join(directory, name),
    "utf8"
  );

  /*
   * Lecture des champs normalisés.
   * On n'infère jamais l'homologation de la puissance.
   */

  const codes = [
    ...source.matchAll(
      /["']?license_fr["']?\s*:\s*["']([A-Z0-9_]+)["']/g
    )
  ].map(match => match[1]);

  const hasNormalized = codes.length > 0;

  const hasLegacyPermit =
    /["']?label["']?\s*:\s*["']PERMIS["']/i.test(source);

  const hasSource =
    /["']?license_fr_source["']?\s*:/.test(source);

  const hasDate =
    /["']?license_fr_verified_at["']?\s*:/.test(source);

  const invalid = codes.filter(
    code => !validCodes.has(code)
  );

  if (invalid.length) {
    errors++;

    console.log(
      "INVALID_CODE=" + name + ":" + invalid.join(",")
    );

    continue;
  }

  if (hasNormalized) {

    if (!hasSource || !hasDate) {
      errors++;

      console.log(
        "INCOMPLETE_NORMALIZATION=" + name +
        " SOURCE=" + hasSource +
        " DATE=" + hasDate
      );

      continue;
    }

    normalizedCount++;

    console.log(
      "NORMALIZED=" + name +
      " => " + [...new Set(codes)].join("/")
    );

    if (hasLegacyPermit) {
      console.log(
        "  NOTE=Ancien quick_fact PERMIS présent : " +
        "vérifier sa cohérence éditoriale."
      );
    }

    continue;
  }

  if (hasLegacyPermit && legacyAllowed.has(name)) {

    legacyCount++;

    console.log(
      "LEGACY_TO_MIGRATE=" + name
    );

    continue;
  }

  missingCount++;
  errors++;

  console.log(
    "MISSING_NORMALIZED_LICENSE=" + name
  );
}

/*
 * Contrôle architectural du renderer :
 * variante normalisée > famille normalisée >
 * anciennes valeurs, sans disparition du permis.
 */

const permitBlock = renderer.match(
  /const normalizedPermit\s*=[\s\S]*?;/
);

if (!permitBlock) {
  errors++;
  console.log("RENDERER_PERMIT_BLOCK=MISSING");
} else {

  const body = permitBlock[0];

  const order = [
    "formatMotorcycleLicenseFranceV2(activeVariantLicenseFr)",
    "formatMotorcycleLicenseFranceV2(v2.license_fr)",
    "permitFromFacts(selectedVariantQuickFacts)",
    "permitFromFacts(v2.quick_facts)",
    "usableLegacyPermit"
  ];

  const positions = order.map(
    needle => body.indexOf(needle)
  );

  const validOrder =
    positions.every(position => position >= 0) &&
    positions.every(
      (position, index) =>
        index === 0 || position > positions[index - 1]
    );

  if (!validOrder) {
    errors++;
    console.log("RENDERER_PRIORITY=ERROR");
  } else {
    console.log("RENDERER_PRIORITY=OK");
  }
}

if (
  !renderer.includes("sourceQuickFacts.filter") ||
  !renderer.includes(
    "{ label: 'PERMIS', value: normalizedPermit }"
  ) ||
  !renderer.includes(
    "['Permis', normalizedPermit]"
  )
) {
  errors++;
  console.log("RENDERER_SINGLE_SOURCE=ERROR");
} else {
  console.log("RENDERER_SINGLE_SOURCE=OK");
}

if (files.length < 25) {
  errors++;
  console.log(
    "INVENTORY_TOO_SMALL=" + files.length
  );
}

console.log("");
console.log("========== RESULTATS ==========");
console.log("TOTAL_MODELS=" + files.length);
console.log("NORMALIZED=" + normalizedCount);
console.log("LEGACY_TO_MIGRATE=" + legacyCount);
console.log("MISSING=" + missingCount);
console.log("ERRORS=" + errors);

if (errors > 0) {
  console.error("AUDIT_V2_LICENSES=FAILED");
  process.exitCode = 1;
} else {
  console.log("AUDIT_V2_LICENSES=OK");
}