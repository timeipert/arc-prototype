import type { ChantDoc } from '@/models';

// ---------- config -------------------------------------------------

/* -------- helper to build a URL that respects <base> -------- */
const resolve = (p: string) =>
    new URL(p, import.meta.env.BASE_URL).toString();

/* use it for every file you fetch */
const CHANTS_URL   = resolve('data/chants.json');

const IS_ZSTD = false;


let cache: ChantDoc[] | null = null;
let inflight: Promise<ChantDoc[]> | null = null;


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

export function clearChantsCache() {
  cache = null;
  inflight = null;
}


async function decompressZstd(buf: ArrayBuffer): Promise<Uint8Array> {
  const { ZstdCodec } = await import('zstd-codec');
  const codec = await new Promise<typeof ZstdCodec>(res => ZstdCodec.run(res));
  const simple = new codec.Simple();
  return simple.decompress(new Uint8Array(buf));
}
