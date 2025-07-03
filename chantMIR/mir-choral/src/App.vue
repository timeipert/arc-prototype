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

    <ControlPanel />

    <ResultTable @select="onSelect" />

    <!--<DualViewer v-if="selected && byUuid[selected.uuid]"
                :hit="selected"
                :chantA="byUuid[selected.uuid]"
                :chantB="chantB"
                :ctx="store.context" />-->
  </main>
</template>
