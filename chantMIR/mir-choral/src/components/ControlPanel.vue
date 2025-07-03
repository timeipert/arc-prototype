<script setup lang="ts">
import { ref } from 'vue';
import { useMirStore } from '@/store/mirStore';

const store = useMirStore();
const input   = ref(store.pattern);
const context = ref(3);              // default ±3 syllables

function submit() {
  store.pattern = input.value;
  store.context = context.value;     // new state field
  store.search();
}
</script>

<template>
  <form @submit.prevent="submit" class="flex flex-wrap gap-3 items-center">
    <input v-model="input"
           placeholder="Volpiano pattern"
           class="flex-1 border rounded px-3 py-2" />
    <label class="flex items-center gap-1 text-sm">
      ±
      <input type="number" v-model.number="context" min="0" class="w-16 border rounded px-1 py-0.5" />
      syl
    </label>
    <button type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded">
      {{ store.running ? 'Searching…' : 'Search' }}
    </button>
  </form>
</template>
