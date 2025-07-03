/**
 * loadDataset.ts
 * ------------------------------------------------------------
 * Reads the new 5-column CSV format:
 *   ,textinitium,uuid,volpiano,syllables,source
 * Returns an array of ChantDoc objects.
 *
 * Usage (inside build-data.ts):
 *   import { loadDataset } from './loadDataset';
 *   const chants = loadDataset(csvFile);
 */

import fs from 'fs';
import { parse } from 'csv-parse/sync';

/* ---------- Domain types ---------------------------------- */
export interface Syllable {
  idx: number;        // 0-based position inside chant
  text: string;       // normalised syllable text
  volpiano: string;   // raw Volpiano string for this syllable
}

export interface ChantDoc {
  ms: string;         // e.g. "GeB_74"
  uuid: string;       // uuid column (or row index fallback)
  incipit: string;    // textinitium
  syllables: Syllable[];
}

/* ---------- Helpers --------------------------------------- */

// remove diacritics, make lower-case for matching
const normaliseText = (raw: string): string =>
  raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/**
 * Splits one Volpiano string into syllable-level strings.
 * Delimiter is the double hyphen `--`. (No further parsing.)
 */
const splitVolpiano = (v: string): string[] => v.split('--');

/* ---------- Loader ---------------------------------------- */

export function loadDataset(csvPath: string): ChantDoc[] {
  const csv = fs.readFileSync(csvPath, 'utf8');

  type RawRow = {
    textinitium: string;
    uuid: string;
    volpiano: string;
    syllables: string;
    source: string;
  };

  const rows: RawRow[] = parse(csv, {
    columns: true,
    trim: true,
    skip_empty_lines: true
  });

  const chants: ChantDoc[] = [];

  rows.forEach((row, rowIdx) => {
    const sylTextsRaw = row.syllables.trim().split(/\s+/);
    const sylVolps    = splitVolpiano(row.volpiano.trim());

    const len = Math.min(sylTextsRaw.length, sylVolps.length);
    if (len === 0) return;                        // ignore empty chants

    const syllables: Syllable[] = new Array(len).fill(null).map((_, i) => ({
      idx: i,
      text: normaliseText(sylTextsRaw[i]),
      volpiano: sylVolps[i]
    }));

    chants.push({
      ms: row.source.trim(),                      // treat “source” as MS siglum
      uuid: row.uuid || String(rowIdx),
      incipit: row.textinitium.trim(),
      syllables
    });
  });

  return chants;
}
