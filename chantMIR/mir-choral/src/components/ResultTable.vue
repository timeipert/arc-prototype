<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import VolpianoSnippet from '@/components/VolpianoSnippet.vue';
import { useMirStore } from '@/store/mirStore';
import { loadChants } from '@/services/indexLoader';
import type { ChantDoc, Occurrence } from '@/models';

const store  = useMirStore();
const chants = reactive<Record<string, ChantDoc>>({});
onMounted(async () => (await loadChants()).forEach(c => (chants[c.uuid] = c)));

/* counterpart helper as before */
const counterpart = (uuid: string) => {
  const from = chants[uuid];
  if (!from) return null;
  return Object.values(chants).find(
      d => d.ms === store.msTo && d.incipit === from.incipit
  ) ?? null;
};

/* NEW: build arrays, not HTML strings */
/* ---- helper: build arrays, no HTML ---------------------- */
function buildArrays(
    doc: ChantDoc | undefined,
    h: Occurrence,
    highlightVolp: boolean   // true = mark pattern chars
) {
  if (!doc) return { volp: [], text: [], hitMap: [], charMap: [] };

  const ctx = store.context;
  const s   = doc.syllables;
  const L   = Math.max(0, h.start - ctx);
  const R   = Math.min(s.length, h.end + ctx);

  const volp: string[] = [];
  const text: string[] = [];
  const hitMap: boolean[] = [];
  const charMap: (null | [number, number])[] = [];

  for (let i = L; i < R; i++) {
    const inHit = i >= h.start && i < h.end;
    const syl   = s[i];

    volp.push(syl.volpiano);
    text.push(syl.text);
    hitMap.push(inHit);               // text always red when inHit

    if (!inHit || !highlightVolp) {
      charMap.push(null);
    } else if (h.start === i && h.end - 1 === i) {
      // hit completely inside ONE syllable
      charMap.push([h.startChar, h.endChar]);
    } else if (h.start === i) {
      charMap.push([h.startChar, syl.volpiano.length - 1]);
    } else if (h.end - 1 === i) {
      charMap.push([0, h.endChar]);
    } else {
      charMap.push([0, syl.volpiano.length - 1]);
    }
  }
  return { volp, text, hitMap, charMap };
}

/* emit select */
const emit = defineEmits<{ select:[h:Occurrence] }>();
</script>

<template>
  <!-- meta paragraph unchanged -->
  <div class="line"></div>
  <table v-if="!store.running" class="w-full text-sm border-collapse table-fixed results">
    <thead>
    <tr><th>Initial Text</th>
      <th>Syllable Position</th>
      <th>Manuscript #1</th>
      <th>Manuscript #2</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="h in store.hits"
        :key="h.ms + h.uuid + h.start"
        class="hover:bg-blue-50 cursor-pointer"
        @click="emit('select', h)">

      <!-- meta columns -->

      <td class="border p-1 truncate">{{ chants[h.uuid]?.incipit }}</td>
      <td class="border p-1 text-right">{{ h.start }}–{{ h.end-1 }}</td>

      <!-- FROM snippet -->
      <td class="border p-0">
        <div class="clip">
          <VolpianoSnippet v-bind="buildArrays(chants[h.uuid], h, true)" />


        </div>
      </td>

      <!-- TO snippet -->
      <td class="border p-0" v-if="store.isCompare">
        <div class="clip">
          <template v-if="counterpart(h.uuid)">
            <VolpianoSnippet
                v-if="counterpart(h.uuid)"
                v-bind="buildArrays(counterpart(h.uuid)!, h, false)" />
          </template>
          <span v-else class="italic text-gray-500">—</span>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
</template>
<style scoped>
table.results {
  margin-top: 3em;
}
table.results td {
  padding: 0 3em;
}
table.results th {
  font-size: 0.8em;
  font-weight: bold;
}
.line {
  width: 100%;
  border-top: 1px solid #ccc;
  margin-top: 1em;
}
</style>