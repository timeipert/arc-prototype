<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ControlPanel from '@/components/ControlPanel.vue';
import ResultTable  from '@/components/ResultTable.vue';
import DualViewer   from '@/components/DualViewer.vue';
import { useMirStore } from '@/store/mirStore';
import { loadChants } from '@/services/indexLoader';
import type { ChantDoc } from '@/models';

const store = useMirStore();

const byUuid = ref<Record<string, ChantDoc>>({});
onMounted(async () => {
  const chants = await loadChants();
  byUuid.value = Object.fromEntries(chants.map(c => [c.uuid, c]));
});

const selected = ref(null as any);           // Occurrence | null
function onSelect(hit: any) { selected.value = hit; }

/* computed Getter für Target-Chant */
const chantB = computed(() => {
  if (!store.isCompare || !selected.value) return null;
  const src = byUuid.value[selected.value.uuid];
  return Object.values(byUuid.value).find(
      c => c.ms === store.msTo && c.incipit === src?.incipit
  ) ?? null;
});
</script>

<template>
  <main class="max-w-6xl mx-auto p-4 space-y-6">
<h1>Synoptical Search (Prototype)</h1>
    <h2>Projekt Digitale Edition des „altrömischen“ Messpropriums</h2>
    <h2>Juli 2025</h2>
    <p>You can search for pitch sequences within the two corpora of old-roman chant (Vat 5319) and frankish chant (Gr Triplex). Select the corpus in which you want to search in Manuscript #1 and the corpus you want to compare it with in Manuscript #2, input the pattern with volpiano and then click <i>search</i>.
    </p>
    <ControlPanel />

    <ResultTable @select="onSelect" />

    <!--<DualViewer v-if="selected && byUuid[selected.uuid]"
                :hit="selected"
                :chantA="byUuid[selected.uuid]"
                :chantB="chantB"
                :ctx="store.context" />-->
  </main>
</template>
<style>
h1 {
  font-size: 1.4em;
}
h2 {
  font-size: 1.2em;
  margin: 0;
}
h3
{
  margin: 0;
  font-size: 1em;
}
p {
  font-size: 0.9em;
  width: 50em;
  margin: 1em auto;

}
</style>