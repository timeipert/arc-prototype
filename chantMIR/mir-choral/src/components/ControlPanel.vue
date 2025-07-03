<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useMirStore } from '@/store/mirStore';
import { loadChants } from '@/services/indexLoader';

const s = useMirStore();
const manuscripts = ref<string[]>([]);

onMounted(async () => {
  const unique = new Set((await loadChants()).map(c => c.ms));
  manuscripts.value = [...unique].sort();
});

const showToSelector = computed(() => s.mode === 'cmp');
</script>

<template>
  <form
      @submit.prevent="s.search"
      class="flex flex-wrap gap-3 items-end bg-white/60 border border-gray-300/80 rounded-lg p-3 shadow-sm backdrop-blur"
  >
    <!-- MODE --><div class="firstinputs">
    <div class="flex flex-col">
      <label class="label">Mode</label>
      <select v-model="s.mode" class="select">
        <option value="cmp">Compare</option>
        <option value="occ">Occurrences</option>
      </select>
    </div>

    <!-- FROM -->
    <div class="flex flex-col">
      <label class="label">Manuscript #1</label>
      <select v-model="s.msFrom" class="select w-44">
        <option disabled value="">Select…</option>
        <option v-for="m in manuscripts" :key="m">{{ m }}</option>
      </select>
    </div>

    <!-- TO (conditional) -->
    <div v-if="showToSelector" class="flex flex-col">
      <label class="label">Manuscript #2</label>
      <select v-model="s.msTo" class="select w-44">
        <option disabled value="">Select…</option>
        <option v-for="m in manuscripts" :key="m">{{ m }}</option>
      </select>
    </div></div>

    <!-- PATTERN -->
    <div class="flex-1 flex flex-col min-w-[10rem]">
      <label class="label">Pattern (Volpiano)</label>
      <input
          v-model="s.pattern"
          placeholder="efg--fed"
          class="input volpiano"
      />
    </div>
    <!-- BUTTON -->
    <button
        type="submit"
        class="h-10 px-6 rounded-md bg-gray-800 text-gray-100 hover:bg-gray-700 disabled:opacity-50"
        :disabled="s.running || !s.msFrom || !s.pattern"
    >
      {{ s.running ? 'Searching…' : 'Search' }}
    </button>
  </form>
</template>

<style scoped>

form {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.select, .input {
  border: 1px #ccc;
background: white;
  font-size: 1em;
  margin: 0.6em 0.3em;
color: black;}

.label {
  font-size: 0.8em;
  margin-right: 0.5em;
}
input.volpiano {
  width: 200px;
  font-size: 3em;
}
button {
  height: 3em;
}

.firstinputs {
  display: flex;
  flex-direction: column;
  margin: 0 2em;
}
</style>
