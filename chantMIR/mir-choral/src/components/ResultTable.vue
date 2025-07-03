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
function buildArrays(doc: ChantDoc | undefined, h: Occurrence) {
  if (!doc) return { volp: [], text: [], hitMap: [] };

  const ctx = store.context;
  const s   = doc.syllables;
  const L   = Math.max(0, h.start - ctx);
  const R   = Math.min(s.length, h.end + ctx);
  const hitF = h.start - L;
  const hitL = h.end   - 1 - L;

  const volp   : string[]  = [];
  const text   : string[]  = [];
  const hitMap : boolean[] = [];

  for (let i = L; i < R; i++) {
    volp.push(s[i].volpiano);
    text.push(s[i].text);
    hitMap.push(i >= h.start && i < h.end);
  }
  return { volp, text, hitMap };
}


/* emit select */
const emit = defineEmits<{ select:[h:Occurrence] }>();
</script>

<template>
  <!-- meta paragraph unchanged -->
  <table v-if="!store.running" class="w-full text-sm border-collapse table-fixed">
    <!-- thead unchanged -->
    <tbody>
    <tr v-for="h in store.hits"
        :key="h.ms + h.uuid + h.start"
        class="hover:bg-blue-50 cursor-pointer"
        @click="emit('select', h)">

      <!-- meta columns -->
      <td class="border p-1 truncate">{{ h.ms }}</td>
      <td class="border p-1 truncate">{{ chants[h.uuid]?.incipit }}</td>
      <td class="border p-1 text-right">{{ h.start }}–{{ h.end-1 }}</td>

      <!-- FROM snippet -->
      <td class="border p-0">
        <div class="clip">
          <VolpianoSnippet v-bind="buildArrays(chants[h.uuid], h)" />
        </div>
      </td>

      <!-- TO snippet -->
      <td class="border p-0" v-if="store.isCompare">
        <div class="clip">
          <template v-if="counterpart(h.uuid)">
            <VolpianoSnippet v-bind="buildArrays(counterpart(h.uuid)!, h)" />
          </template>
          <span v-else class="italic text-gray-500">—</span>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
</template>
