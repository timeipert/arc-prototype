/* -----------------------------------------------------------
   src/workers/search.worker.ts  (pattern may cross syllables)
 ----------------------------------------------------------- */

import type {
  ChantDoc, QueryPayload, QueryResponse, Occurrence
} from '@/models';

/*── in-worker cache ────────────────────────────────*/
let chants: ChantDoc[] | null = null;
const loadChants = async () => {
  if (chants) return chants;
  const res = await fetch('/data/chants.json');
  chants = (await res.json()) as ChantDoc[];
  return chants;
};

/*── helpers ────────────────────────────────────────*/
const cleanPattern = (p: string) => p.replace(/\s+/g, '').toLowerCase();
const findAll = (hay: string, needle: string) => {
  const idxs: number[] = []; let pos = hay.indexOf(needle);
  while (pos !== -1) { idxs.push(pos); pos = hay.indexOf(needle, pos + 1); }
  return idxs;
};

/* offset→syllable + syllable→startOffset */
function buildMaps(doc: ChantDoc) {
  const ofs2Syl: number[] = [];
  const syl2Start: number[] = [];
  let ofs = 0;
  doc.syllables.forEach((s, i) => {
    syl2Start[i] = ofs;
    for (let k = 0; k < s.volpiano.length; k++) ofs2Syl[ofs + k] = i;
    ofs += s.volpiano.length + 2;       // +2 for “--”
  });
  return { ofs2Syl, syl2Start };
}

/* remove “--” but keep back-map */
function deDelimit(doc: ChantDoc) {
  const raw = doc.syllables.map(s => s.volpiano).join('--').toLowerCase();
  const map: number[] = []; let clean = '';
  for (let i = 0, j = 0; i < raw.length; i++) {
    if (raw[i] === '-' && raw[i + 1] === '-') { i++; continue; }
    map[j++] = i; clean += raw[i];
  }
  return { clean, map };
}

/*── message handler ────────────────────────────────*/
self.onmessage = async (e: MessageEvent<QueryPayload>) => {
  const { pattern, ms } = e.data;
  if (!pattern?.trim()) return postMessage(<QueryResponse>{ hits: [], elapsedMs: 0 });

  const patt = cleanPattern(pattern);
  const docs = await loadChants();
  const hits: Occurrence[] = [];
  const t0 = performance.now();

  for (const doc of docs) {
    if (ms && doc.ms !== ms) continue;
    const { clean: flat, map } = deDelimit(doc);
    const posList = findAll(flat, patt);
    if (!posList.length) continue;

    const { ofs2Syl, syl2Start } = buildMaps(doc);

    for (const p0 of posList) {
      const p1 = p0 + patt.length - 1;          // inclusive
      const byteStart = map[p0];
      const byteEnd   = map[p1];

      const sSyl = ofs2Syl[byteStart];
      const eSyl = ofs2Syl[byteEnd];

      hits.push({
        ms: doc.ms,
        uuid: doc.uuid,
        start: sSyl,
        end: eSyl + 1,
        startChar: byteStart - syl2Start[sSyl],
        endChar:   byteEnd   - syl2Start[eSyl]
      });
    }
  }

  postMessage(<QueryResponse>{
    hits,
    elapsedMs: Math.round(performance.now() - t0)
  });
};
