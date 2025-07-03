/* -----------------------------------------------------------
   src/models/index.ts
   Pure TypeScript domain models – no runtime code here.
 ----------------------------------------------------------- */

/**
 * One syllable in a chant: text + raw Volpiano glyphs.
 * `idx` is 0-based inside its chant.
 */
export interface Syllable {
  idx: number;
  text: string;       // normalised syllable text ("in", "con-")
  volpiano: string;   // raw glyphs for this syllable ("hgf", "g--")
}

/**
 * A chant as an array of syllables.
 * `ms`   – manuscript siglum (e.g. "GeB_74")
 * `uuid` – stable chant identifier from your CSV
 */
export interface ChantDoc {
  ms: string;
  uuid: string;
  incipit: string;
  syllables: Syllable[];
}

/* ------- Search-related types --------------------------------- */

/**
 * Occurrence of a query *substring* inside a chant.
 * `start` / `end` are syllable indices (inclusive-exclusive).
 */
export interface Occurrence {
  ms: string;
  uuid: string;
  start: number;       // first syllable index (inclusive)
  end: number;         // syllable index *after* last (exclusive)
  startChar: number;   // char-offset inside start syllable
  endChar: number;     // char-offset inside (end-1) syllable
}


/**
 * Generic query object sent from UI → Worker.
 * Extend as needed (regex flag, fuzzy tolerance, etc.).
 */
export interface QueryPayload {
  pattern: string;        // raw Volpiano (user input, "--" allowed)
  ms?: string;            // optional filter for one manuscript
}

/**
 * Response sent back Worker → UI.
 */
export interface QueryResponse {
  hits: Occurrence[];
  elapsedMs: number;      // perf diagnostic
}

/* ------- Helper type aliases ---------------------------------- */

export type ManuscriptSiglum = string;
export type ChantUUID = string;
