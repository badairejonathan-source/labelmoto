'use strict';

const fs = require('fs');
const path = require('path');

const root = process.cwd();

const sheetsDir = path.join(
  root,
  'src/lib/motorcycle-sheets-v2'
);

const rendererPath = path.join(
  root,
  'src/components/app/motorcycle-sheet-v2-tabbed-universal.tsx'
);

const LEGACY_ALLOWED = ["cfmoto-125nk.ts","cfmoto-300nk.ts","cfmoto-450mt.ts","cfmoto-450nk.ts","cfmoto-450sr.ts","cfmoto-675sr-r.ts","cfmoto-700cl-x.ts","cfmoto-800mt-sport-explore.ts","cfmoto-800mt-touring.ts","cfmoto-800mt-x.ts","cfmoto-800nk.ts","kove-350rr.ts","kove-450-rally.ts","kove-450rr.ts","kove-510x.ts","kove-625x-pro.ts","kove-800x-pro.ts","kove-nk-125r.ts","voge-525dsx.ts","voge-900dsx.ts","voge-ds625x.ts","voge-ds800x-rally.ts","voge-r125.ts","voge-r625.ts","zontes-703-rr.ts"];

const STRICT_ALWAYS = new Set([
  'zontes-703-t.ts'
]);

let errors = 0;

function fail(message) {
  errors++;
  console.error(
    'V2_COMPLETENESS_ERROR=' + message
  );
}

function occurrences(source, value) {
  return source.split(value).length - 1;
}

function extractBalanced(
  source,
  marker,
  openChar,
  closeChar
) {
  const markerIndex = source.indexOf(marker);

  if (markerIndex < 0) return null;

  const start = source.indexOf(
    openChar,
    markerIndex + marker.length
  );

  if (start < 0) return null;

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let i = start; i < source.length; i++) {
    const ch = source[i];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (ch === '\\') {
        escaped = true;
        continue;
      }

      if (ch === quote) {
        quote = null;
      }

      continue;
    }

    if (
      ch === "'" ||
      ch === '"' ||
      ch === '`'
    ) {
      quote = ch;
      continue;
    }

    if (ch === openChar) {
      depth++;
    }

    if (ch === closeChar) {
      depth--;

      if (depth === 0) {
        return source.slice(start, i + 1);
      }
    }
  }

  return null;
}

function euroRange(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value
    .replace(/\u00a0/g, ' ')
    .replace(/\u2248/g, '')
    .trim();

  const range = normalized.match(
    /([0-9][0-9 ]*)\s*[\u2013-]\s*([0-9][0-9 ]*)\s*\u20ac/
  );

  if (range) {
    return {
      min: Number(
        range[1].replace(/\s/g, '')
      ),
      max: Number(
        range[2].replace(/\s/g, '')
      )
    };
  }

  const single = normalized.match(
    /([0-9][0-9 ]*)\s*\u20ac/
  );

  if (!single) {
    return null;
  }

  const amount = Number(
    single[1].replace(/\s/g, '')
  );

  return {
    min: amount,
    max: amount
  };
}

function kmRange(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value
    .replace(/\u2248/g, '')
    .replace(/,/g, '.')
    .trim();

  const range = normalized.match(
    /([0-9]+(?:\.[0-9]+)?)\s*[\u2013-]\s*([0-9]+(?:\.[0-9]+)?)\s*\u20ac\/km/
  );

  if (!range) {
    return null;
  }

  return {
    min: Number(range[1]),
    max: Number(range[2])
  };
}

function auditRenderer() {
  const source = fs.readFileSync(
    rendererPath,
    'utf8'
  );

  const compactRule =
    "const budgetCards = " +
    "(v2.budget?.cards || []).filter(() => false);";

  if (!source.includes(compactRule)) {
    fail(
      'RENDERER_BUDGET_COMPACT_RULE_MISSING'
    );
  }

  if (
    occurrences(
      source,
      'budgetSummary || budgetCards.length > 0'
    ) !== 1
  ) {
    fail(
      'BUDGET_RENDER_LOCATION_MUST_BE_UNIQUE'
    );
  }
}

function auditStrictSheet(file) {
  const fullPath = path.join(
    sheetsDir,
    file
  );

  const source = fs.readFileSync(
    fullPath,
    'utf8'
  );

  const required = [
    /\blayout_version:\s*2\b/,
    /\blicense_fr\s*:/,
    /\bservice_schedule_v2\s*:\s*\[/,
    /\bmaintenance_details\s*:\s*\[/,
    /\bconsumables_v2\s*:\s*\[/,
    /\bbudget\s*:\s*\{/,
    /\bwarranty\s*:\s*\{/,
    /\bfaq\s*:\s*\[/,
    /\bverdict\s*:\s*\{/,
    /\blongevity_tips\s*:\s*\[/,
    /\bdata_quality\s*:\s*\{/
  ];

  for (const pattern of required) {
    if (!pattern.test(source)) {
      fail(
        file +
        ':MISSING_REQUIRED_SECTION:' +
        pattern
      );
    }
  }

  const schedule = extractBalanced(
    source,
    'service_schedule_v2:',
    '[',
    ']'
  );

  const budget = extractBalanced(
    source,
    'budget:',
    '{',
    '}'
  );

  if (!schedule) {
    fail(
      file +
      ':SCHEDULE_UNREADABLE'
    );

    return;
  }

  if (!budget) {
    fail(
      file +
      ':BUDGET_UNREADABLE'
    );

    return;
  }

  /*
   * Les nouvelles fiches V2 ne doivent plus
   * recopier les revisions dans budget.cards.
   *
   * La 703 T conserve temporairement ces donnees
   * historiques, mais le renderer universel
   * ne les affiche plus.
   */
  if (
    file !== 'zontes-703-t.ts' &&
    /\bcards\s*:\s*\[/.test(budget)
  ) {
    fail(
      file +
      ':BUDGET_DETAIL_CARDS_FORBIDDEN'
    );
  }

  const rows = [];

  const rowRegex =
    /km:\s*(\d+)[\s\S]*?price_estimate:\s*'([^']+)'/g;

  let match;

  while (
    (match = rowRegex.exec(schedule))
  ) {
    const price = euroRange(
      match[2]
    );

    if (!price) {
      fail(
        file +
        ':INVALID_REVISION_PRICE:' +
        match[1] +
        'KM:' +
        match[2]
      );

      continue;
    }

    rows.push({
      km: Number(match[1]),
      min: price.min,
      max: price.max
    });
  }

  if (rows.length < 3) {
    fail(
      file +
      ':INSUFFICIENT_PRICED_REVISIONS'
    );
  }

  const horizonMatch = budget.match(
    /horizon_km:\s*(\d+)/
  );

  const totalMatch = budget.match(
    /total_cost:\s*'([^']+)'/
  );

  const kmCostMatch = budget.match(
    /cost_per_km:\s*'([^']+)'/
  );

  if (
    !horizonMatch ||
    !totalMatch ||
    !kmCostMatch
  ) {
    fail(
      file +
      ':BUDGET_SUMMARY_INCOMPLETE'
    );

    return;
  }

  const horizon = Number(
    horizonMatch[1]
  );

  const total = euroRange(
    totalMatch[1]
  );

  const costKm = kmRange(
    kmCostMatch[1]
  );

  if (!total) {
    fail(
      file +
      ':TOTAL_COST_INVALID'
    );

    return;
  }

  if (!costKm) {
    fail(
      file +
      ':COST_PER_KM_INVALID'
    );

    return;
  }

  const included = rows.filter(
    row => row.km <= horizon
  );

  const sumMin = included.reduce(
    (sum, row) => sum + row.min,
    0
  );

  const sumMax = included.reduce(
    (sum, row) => sum + row.max,
    0
  );

  if (
    total.min !== sumMin ||
    total.max !== sumMax
  ) {
    fail(
      file +
      ':BUDGET_TOTAL_MISMATCH:' +
      total.min +
      '-' +
      total.max +
      '_EXPECTED_' +
      sumMin +
      '-' +
      sumMax
    );
  }

  const expectedKmMin = Number(
    (sumMin / horizon).toFixed(3)
  );

  const expectedKmMax = Number(
    (sumMax / horizon).toFixed(3)
  );

  const tolerance = 0.001;

  if (
    Math.abs(
      costKm.min - expectedKmMin
    ) > tolerance ||
    Math.abs(
      costKm.max - expectedKmMax
    ) > tolerance
  ) {
    fail(
      file +
      ':COST_PER_KM_MISMATCH'
    );
  }

  console.log(
    'STRICT_OK=' +
    file +
    ' REVISIONS=' +
    rows.length +
    ' HORIZON=' +
    horizon +
    ' BUDGET=' +
    sumMin +
    '-' +
    sumMax +
    ' EUR'
  );
}

function main() {
  console.log(
    '========== AUDIT COMPLETUDE V2 =========='
  );

  auditRenderer();

  const files = fs
    .readdirSync(sheetsDir)
    .filter(
      file => file.endsWith('.ts')
    )
    .filter(
      file => file !== 'registry.ts'
    )
    .filter(
      file => !file.endsWith('-shared.ts')
    )
    .sort();

  let strictCount = 0;

  for (const file of files) {
    const strict =
      STRICT_ALWAYS.has(file) ||
      !LEGACY_ALLOWED.includes(file);

    if (!strict) {
      continue;
    }

    strictCount++;

    auditStrictSheet(file);
  }

  if (errors > 0) {
    console.error(
      'V2_COMPLETENESS_ERRORS=' +
      errors
    );

    process.exit(1);
  }

  console.log('');
  console.log(
    'V2_COMPLETENESS=OK'
  );
  console.log(
    'STRICT_SHEETS=' +
    strictCount
  );
  console.log(
    'BUDGET_UI=SUMMARY_ONLY'
  );
  console.log(
    'BUDGET_MATH=OK'
  );
  console.log(
    'FUTURE_NEW_SHEETS=STRICT_BY_DEFAULT'
  );
}

main();