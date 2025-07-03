/* -----------------------------------------------------------
   src/services/indexLoader.ts
   Loads chants.json (optionally .zst-compressed) once
   and hands back the cached array on every subsequent call.
   – Uses native fetch; no UI imports here
 ----------------------------------------------------------- */

import type { ChantDoc } from '@/models';

// ---------- config -------------------------------------------------

/** Adjust to match whatever you generated in build-data.ts */
const CHANTS_URL = '/data/chants.json';        // or '/data/chants.json.zst'

/**
 * If you kept the Zstandard compression:
 *   1. add `zstd-codec` to package.json dependencies
 *   2. set this flag to true
 *   3. keep the .zst extension in CHANTS_URL
 */
const IS_ZSTD = false;

// ---------- internal cache ----------------------------------------

let cache: ChantDoc[] | null = null;
let inflight: Promise<ChantDoc[]> | null = null;

// ---------- public API -------------------------------------------

/**
 * Returns the full chant list, loading it once on first call.
 */
export function loadChants(): Promise<ChantDoc[]> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;

  inflight = fetch(CHANTS_URL)
    .then(res => res.arrayBuffer())
    .then(buf => (IS_ZSTD ? decompressZstd(buf) : new Uint8Array(buf)))
    .then(u8  => JSON.parse(new TextDecoder().decode(u8)) as ChantDoc[])
    .then(arr => {
      cache = arr;
      inflight = null;
      return arr;
    });

  return inflight;
}

/**
 * Clears the in-memory cache (rarely needed – e.g. when hot-reloading).
 */
export function clearChantsCache() {
  cache = null;
  inflight = null;
}

// ---------- helpers ----------------------------------------------

async function decompressZstd(buf: ArrayBuffer): Promise<Uint8Array> {
  // Dynamic import keeps zstd-codec (≈150 kB WASM) out of main bundle
  const { ZstdCodec } = await import('zstd-codec');
  const codec = await new Promise<typeof ZstdCodec>(res => ZstdCodec.run(res));
  const simple = new codec.Simple();
  return simple.decompress(new Uint8Array(buf));
}
