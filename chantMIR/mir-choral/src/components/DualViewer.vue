<script setup lang="ts">
import { computed } from 'vue';
import type { ChantDoc, Occurrence } from '@/models';

defineProps<{
  hit : Occurrence;          // selected occurrence (from ResultTable)
  chantA : ChantDoc;         // msFrom
  chantB : ChantDoc|null;    // counterpart (null → “not found”)
  ctx   : number;            // ± context syllables
}>();

function snippet(doc: ChantDoc, h: Occurrence, ctx: number) {
  const s = doc.syllables;
  const L = Math.max(0, h.start - ctx);
  const R = Math.min(s.length, h.end + ctx);
  return {
    volp: s.slice(L, R).map((sy,i) =>
        (i+L>=h.start && i+L<h.end)
            ? `<span class='hit'>${sy.volpiano}</span>` : sy.volpiano).join(' '),
    txt : s.slice(L, R).map((sy,i) =>
        (i+L>=h.start && i+L<h.end)
            ? `<span class='hit'>${sy.text}</span>` : sy.text).join(' ')
  };
}

const left  = computed(() => snippet(chantA, hit, ctx));
const right = computed(() => chantB ? snippet(chantB, hit, ctx) : null);
</script>

<template>
  <div class="border rounded p-4 grid md:grid-cols-2 gap-4">
    <!-- LEFT -->
    <div>
      <h3 class="font-semibold text-sm mb-1">{{ chantA.ms }} – {{ chantA.incipit }}</h3>
      <p class="volpiano text-lg leading-snug" v-html="left.volp"></p>
      <p v-html="left.txt"></p>
    </div>

    <!-- RIGHT -->
    <div v-if="right">
      <h3 class="font-semibold text-sm mb-1">{{ chantB?.ms }} – {{ chantB?.incipit }}</h3>
      <p class="volpiano text-lg leading-snug" v-html="right!.volp"></p>
      <p v-html="right!.txt"></p>
    </div>
    <div v-else class="italic text-gray-500 flex items-center">no counterpart</div>
  </div>
</template>

<style scoped>
.volpiano { font-family: "Volpiano", serif; white-space: nowrap; }
.hit      { color: #dc2626; font-weight: 600; }
</style>
