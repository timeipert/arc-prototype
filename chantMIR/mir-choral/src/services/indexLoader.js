// ---------- config -------------------------------------------------
const CHANTS_URL = '/data/chants.json'; // or '/data/chants.json.zst'
const IS_ZSTD = false;
let cache = null;
let inflight = null;
export function loadChants() {
    if (cache)
        return Promise.resolve(cache);
    if (inflight)
        return inflight;
    inflight = fetch(CHANTS_URL)
        .then(res => res.arrayBuffer())
        .then(buf => (IS_ZSTD ? decompressZstd(buf) : new Uint8Array(buf)))
        .then(u8 => JSON.parse(new TextDecoder().decode(u8)))
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
async function decompressZstd(buf) {
    const { ZstdCodec } = await import('zstd-codec');
    const codec = await new Promise(res => ZstdCodec.run(res));
    const simple = new codec.Simple();
    return simple.decompress(new Uint8Array(buf));
}
