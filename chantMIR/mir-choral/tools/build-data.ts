/**
 * build-data.ts  (Node + TypeScript)
 * ------------------------------------------------------------
 * CLI:
 *   node --loader ts-node/esm tools/build-data.ts dataset.csv public/data --window 7
 *
 * Dependencies (dev or prod):
 *   csv-parse      ^5.5          (used in loadDataset.ts)
 *   zstd-codec     ^1.3
 *   ts-node        ^10.9         (when running via loader)
 *   typescript, @types/node      (usual TS toolchain)
 */

import fs from 'fs';
import path from 'path';
import {createHash} from 'crypto';
import {ZstdCodec} from 'zstd-codec';

import {loadDataset, ChantDoc, Syllable} from './loadDataset';

// ------------------------- CLI ARGS -------------------------
const [, , csvFile, outDir, ...rest] = process.argv;
if (!csvFile || !outDir) {
    console.error('Usage: build-data.ts <csvFile> <outDir> [--window 7]');
    process.exit(1);
}
const winFlag = rest.indexOf('--window');
const windowSize = winFlag !== -1 ? Number(rest[winFlag + 1]) : 7;

// ------------------------- TYPES ----------------------------
interface VolpianoHit {
    ms: string;
    uuid: string;
    start: number;          // start syllable index of the window
}

type VolpianoIndex = Record<string, VolpianoHit[]>;
type TextIndex = Record<string, VolpianoHit[]>;

// ------------------------- UTILS ----------------------------
const sha1 = (syllables: Syllable[]): string => {
    // Join raw volpiano strings with '--' so the hash matches window boundaries
    const joined = syllables.map(s => s.volpiano).join('--');
    return createHash('sha1').update(joined).digest('hex');
};

const add = <T>(idx: Record<string, T[]>, key: string, val: T) => {
    (idx[key] ||= []).push(val);
};

// ------------------------ MAIN ------------------------------
(async () => {
    console.time('build-data');

    // 1) Load & parse CSV via helper
    const chants: ChantDoc[] = loadDataset(csvFile);
    console.log(`loaded ${chants.length} chants`);

    // 2) Build indices
    const volpIdx: VolpianoIndex = {};
    const textIdx: TextIndex = {};

    chants.forEach(doc => {
        const {ms, uuid, syllables} = doc;

        // 2a) Volpiano window → sha1 key
        for (let i = 0; i <= syllables.length - windowSize; i++) {
            const win = syllables.slice(i, i + windowSize);
            const key = sha1(win);
            add(volpIdx, key, {ms, uuid, start: i});
        }

        // 2b) Text 3-grams (normalised already)
        syllables.forEach((syl, i) => {
            const txt = syl.text;
            if (txt.length < 3) return;
            for (let j = 0; j <= txt.length - 3; j++) {
                const gram = txt.slice(j, j + 3);
                add(textIdx, gram, {ms, uuid, start: i});
            }
        });
    });

    // 3) Ensure output dir exists
    fs.mkdirSync(outDir, {recursive: true});

    // 4) Write chants.json (pretty for debugging)
    fs.writeFileSync(
        path.join(outDir, 'chants.json'),
        JSON.stringify(chants, null, 2)
    );

    // 5) Compress & write indices (.zst)
    const codec = await new Promise<typeof ZstdCodec>(res => ZstdCodec.run(res));
    const simple = new codec.Simple();

    fs.writeFileSync(path.join(outDir, 'index_volpiano.json'),
        JSON.stringify(volpIdx));
    fs.writeFileSync(path.join(outDir, 'index_text.json'),
        JSON.stringify(textIdx));

    console.timeEnd('build-data');   // timing
})();
