<script setup lang="ts">
import { computed } from 'vue';
import type { ChantDoc, Occurrence } from '@/models';

/* props ---------------------------------------------------- */
const props = defineProps<{
  hit   : Occurrence;
  chantA: ChantDoc;        // From-MS chant
  chantB: ChantDoc | null; // To-MS chant (or null)
  ctx   : number;
}>();

/* helpers -------------------------------------------------- */
function snippet(doc: ChantDoc, h: Occurrence, ctx: number) {
  const s = doc.syllables;
  const L = Math.max(0, h.start - ctx);
  const R = Math.min(s.length, h.end + ctx);
  const hitF = h.start - L;
  const hitL = h.end   - 1 - L;

  const volp = s.slice(L, R).map((sy, i) =>
      i >= hitF && i <= hitL ? `<span class="hit">${sy.volpiano}</span>` : sy.volpiano
  ).join('--');
  const text = s.slice(L, R).map((sy, i) =>
      i >= hitF && i <= hitL ? `<span class="hit">${sy.text}</span>`     : sy.text
  ).join(' ');
  return { volp, text };
}

const left  = computed(() => snippet(props.chantA, props.hit, props.ctx));
const right = computed(() =>
    props.chantB ? snippet(props.chantB, props.hit, props.ctx) : null);
</script>

<template>
  <div class="border rounded p-4 grid md:grid-cols-2 gap-4">
    <!-- LEFT (From MS) -->
    <div>
      <h3 class="font-semibold text-sm mb-1">{{ chantA.ms }} – {{ chantA.incipit }}</h3>
      <p class="volpiano text-lg leading-snug" v-html="left.volp"></p>
      <p v-html="left.text"></p>
    </div>

    <!-- RIGHT (To MS) -->
    <div v-if="right">
      <h3 class="font-semibold text-sm mb-1">{{ chantB!.ms }} – {{ chantB!.incipit }}</h3>
      <p class="volpiano text-lg leading-snug" v-html="right!.volp"></p>
      <p v-html="right!.text"></p>
    </div>
    <div v-else class="italic text-gray-500 flex items-center">no counterpart</div>
  </div>
</template>

<style scoped>
.volpiano { font-family: 'Volpiano', serif; white-space: nowrap; }
.hit      { color:#dc2626; font-weight:600; }
</style>
