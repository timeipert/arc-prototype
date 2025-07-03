<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  volp: string[];                 // neumes
  text: string[];                 // syllables
  hitMap: boolean[];              // true → full-syllable red in TEXT
  charMap: (null | [number, number])[]; // start/end char for partial highlight in VOLP
}>();

/* pad arrays equally (no mutation) */
const len = Math.max(props.volp.length, props.text.length);
const vArr = computed(() => [...props.volp, ...Array(len - props.volp.length).fill('----')]);
const tArr = computed(() => [...props.text, ...Array(len - props.text.length).fill('')]);
const hArr = computed(() => [...props.hitMap, ...Array(len - props.hitMap.length).fill(false)]);
const cArr = computed(() => [...props.charMap, ...Array(len - props.charMap.length).fill(null)]);

/* build safe HTML for volpiano cell */
const renderVolp = (v: string, span: null | [number, number]) => {
  if (!span) return v;
  const [a, b] = span;
  return `${v.slice(0, a)}<span class="hit">${v.slice(a, b + 1)}</span>${v.slice(b + 1)}`;
};
</script>

<template>
  <table class="snippet">
    <tbody>
    <!-- volpiano row -->
    <tr class="volpiano text-lg leading-snug">
      <td v-for="(v, i) in vArr" :key="'v'+i" class="px-1" v-html="renderVolp(v, cArr[i])" />
    </tr>
    <!-- text row -->
    <tr class="text-sm leading-tight">
      <td v-for="(t, i) in tArr" :key="'t'+i" class="px-1">
        <span :class="{ hit: hArr[i] }">{{ t }}</span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.snippet  { border-collapse: collapse; table-layout: fixed; }
.volpiano { font-family:'Volpiano',serif; white-space:nowrap; }
.hit      { color:#dc2626; font-weight:600; }
</style>
