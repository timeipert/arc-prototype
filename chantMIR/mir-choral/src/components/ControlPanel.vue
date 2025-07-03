<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useMirStore } from '@/store/mirStore';
import { loadChants } from '@/services/indexLoader';

const s = useMirStore();
const mans = ref<string[]>([]);
onMounted(async () =>
    mans.value = [...new Set((await loadChants()).map(c => c.ms))].sort()
);

const showToSelector = computed(() => s.mode === 'cmp');
</script>

<template>
  <form @submit.prevent="s.search" class="flex flex-wrap gap-3 items-center">
    <!-- Mode selector -->
    <select v-model="s.mode" class="border rounded px-2 py-1">
      <option value="occ">Occurrences only</option>
      <option value="cmp">Compare with …</option>
    </select>

    <!-- From MS -->
    <select v-model="s.msFrom" class="border rounded px-2 py-1">
      <option v-for="m in mans" :key="m">{{ m }}</option>
    </select>

    <!-- To MS – visible only in compare mode -->
    <template v-if="showToSelector">
      →
      <select v-model="s.msTo" class="border rounded px-2 py-1">
        <option v-for="m in mans" :key="m">{{ m }}</option>
      </select>
    </template>

    <!-- Pattern -->
    <input v-model="s.pattern"
           placeholder="Volpiano pattern"
           class="flex-1 border rounded px-3 py-2" />

    <!-- Submit -->
    <button class="bg-blue-600 text-white px-4 py-2 rounded">
      {{ s.running ? 'Searching…' : 'Search' }}
    </button>
  </form>
</template>

<style>
input {
  background: white;
  border: 1px solid grey;
  color: black;
}
</style>
