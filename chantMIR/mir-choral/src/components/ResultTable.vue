<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useMirStore } from '@/store/mirStore';
import { loadChants } from '@/services/indexLoader';
import type { ChantDoc } from '@/models';

const store  = useMirStore();
const chants = reactive<Record<string, ChantDoc>>({});

onMounted(async () => (await loadChants()).forEach(c => (chants[c.uuid] = c)));

/* build HTML with exact char-level highlight */
function build(htmlArr: string[], hitFrom: number, hitTo: number) {
  return htmlArr
    .map((seg, i) => (i >= hitFrom && i <= hitTo ? `<span class="hit">${seg}</span>` : seg))
    .join('');
}
function makeRow(h: any, ctx: number) {
  const doc = chants[h.uuid]; if (!doc) return { volp: '', text: '' };
  const syls = doc.syllables;
  const L = Math.max(0, h.start - ctx);
  const R = Math.min(syls.length, h.end + ctx);
  const volpCells = syls.slice(L, R).map(s => s.volpiano);
  const textCells = syls.slice(L, R).map(s => s.text);

  // relative hit indices
  const first = h.start - L;
  const last  = h.end - 1 - L;

  // highlight inside first & last syllable
  if (first === last) {
    const v = volpCells[first];
    volpCells[first] =
      v.slice(0, h.startChar) +
      `<span class="hit">${v.slice(h.startChar, h.endChar + 1)}</span>` +
      v.slice(h.endChar + 1);
  } else {
    // first syllable
    const vFirst = volpCells[first];
    volpCells[first] =
      vFirst.slice(0, h.startChar) +
      `<span class="hit">${vFirst.slice(h.startChar)}</span>`;
    // middle syllables: whole cell
    for (let i = first + 1; i < last; i++)
      volpCells[i] = `<span class="hit">${volpCells[i]}</span>`;
    // last syllable
    const vLast = volpCells[last];
    volpCells[last] =
      `<span class="hit">${vLast.slice(0, h.endChar + 1)}</span>` +
      vLast.slice(h.endChar + 1);
  }

  // same highlighting logic for syllable text
  // (simpler—highlight whole syllables)
  for (let i = first; i <= last; i++) textCells[i] = `<span class="hit">${textCells[i]}</span>`;

  return {
    volp: volpCells.join(' '),
    text: textCells.join(' ')
  };
}
</script>

<template>
  <section>
    <p class="text-sm mb-4">
      <span v-if="store.running">Working…</span>
      <span v-else>{{ store.hits.length }} hits in {{ store.elapsed }} ms</span>
    </p>

    <table v-if="!store.running" class="w-full text-sm border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="p-2 border">Source</th>
          <th class="p-2 border">Incipit</th>
          <th class="p-2 border">Pos.</th>
          <th class="p-2 border ">Volpiano (±{{ store.context }})</th>
          <th class="p-2 border">Text (±{{ store.context }})</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="h in store.ctxHits" :key="h.ms + h.uuid + h.start">
          <td class="border p-1">{{ h.ms }}</td>
          <td class="border p-1">{{ chants[h.uuid]?.incipit }}</td>
          <td class="border p-1 text-right">{{ h.start }}–{{ h.end - 1 }}</td>

          <td class="border p-1 volpiano" v-html="makeRow(h, store.context).volp"></td>
          <td class="border p-1" v-html="makeRow(h, store.context).text"></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>

</style>
