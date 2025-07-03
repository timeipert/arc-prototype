import type {
  ChantDoc,
  QueryPayload,
  QueryResponse,
  Occurrence
} from '@/models';

/*────────── in-worker corpus cache ──────────*/
let corpus: ChantDoc[] = [];                 // initialise as empty array
const CHANTS_URL = `${import.meta.env.BASE_URL}data/chants.json`;

const loadCorpus = async (): Promise<ChantDoc[]> => {
  if (corpus.length) return corpus;
  corpus = await fetch(CHANTS_URL).then(r => r.json());
  return corpus;
};

/*────────── helpers ──────────*/
const norm = (s: string) => s.trim().toLowerCase();               // same rule everywhere
const cleanPattern = (p: string) => p.replace(/\s+/g, '').toLowerCase();

const findAll = (hay: string, needle: string) => {
  const out: number[] = [];
  for (let pos = hay.indexOf(needle); pos !== -1; pos = hay.indexOf(needle, pos + 1))
    out.push(pos);
  return out;
};

/* offset ↔ syllable maps */
const buildMaps = (doc: ChantDoc) => {
  const ofs2Syl: number[] = [];
  const syl2Start: number[] = [];
  let ofs = 0;
  doc.syllables.forEach((syl, i) => {
    syl2Start[i] = ofs;
    for (let k = 0; k < syl.volpiano.length; k++) ofs2Syl[ofs + k] = i;
    ofs += syl.volpiano.length + 2;      // “--”
  });
  return { ofs2Syl, syl2Start };
};

/* strip “--” but keep back-map */
const deDelimit = (doc: ChantDoc) => {
  const raw = doc.syllables.map(s => s.volpiano).join('--').toLowerCase();
  const map: number[] = [];   // cleanIdx → rawIdx
  let clean = '';
  for (let i = 0, j = 0; i < raw.length; i++) {
    if (raw[i] === '-' && raw[i + 1] === '-') { i++; continue; }
    map[j++] = i;
    clean += raw[i];
  }
  return { clean, map };
};

/*────────── main message handler ──────────*/
self.onmessage = async (e: MessageEvent<QueryPayload>) => {
  const { pattern, msFrom } = e.data;

  /* guard clauses */
  if (!pattern?.trim() || !msFrom?.trim()) {
    postMessage(<QueryResponse>{ hits: [], elapsedMs: 0 });
    return;
  }

  const msKey   = norm(msFrom);                // normalised filter key
  const patt    = cleanPattern(pattern);
  const docs    = await loadCorpus();
  const hits: Occurrence[] = [];
  const t0      = performance.now();

  for (const doc of docs) {
    if (norm(doc.ms) !== msKey) continue;      // STRICT filter

    const { clean: flat, map } = deDelimit(doc);
    const positions = findAll(flat, patt);
    if (!positions.length) continue;

    const { ofs2Syl, syl2Start } = buildMaps(doc);

    for (const p0 of positions) {
      const p1 = p0 + patt.length - 1;         // inclusive
      const rawStart = map[p0];
      const rawEnd   = map[p1];

      const sSyl = ofs2Syl[rawStart];
      const eSyl = ofs2Syl[rawEnd];

      hits.push({
        ms: doc.ms,
        uuid: doc.uuid,
        start: sSyl,
        end:   eSyl + 1,                       // exclusive
        startChar: rawStart - syl2Start[sSyl],
        endChar:   rawEnd   - syl2Start[eSyl]
      });
    }
  }

  postMessage(<QueryResponse>{
    hits,
    elapsedMs: Math.round(performance.now() - t0)
  });
};
