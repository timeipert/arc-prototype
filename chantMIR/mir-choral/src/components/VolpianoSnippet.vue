<script setup lang="ts">
import {computed} from 'vue';

/**  Props delivered by ResultTable / DualViewer
 *    ---------------------------------------------------------
 *    volp   – plain neume strings, one per syllable
 *    text   – lyric syllables, one per syllable
 *    hitMap – boolean[]  true → syllable is part of the hit (for TEXT)
 *    charMap– null | [start,end]  indexes to highlight in VOLP for FROM-MS
 */
const props = defineProps<{
  volp: string[];
  text: string[];
  hitMap: boolean[];
  charMap: (null | [number, number])[];
}>();

/* equalise array lengths (no prop mutation) */
const len = Math.max(props.volp.length, props.text.length);
const vArr = computed(() => [...props.volp, ...Array(len - props.volp.length).fill('---')]);
const tArr = computed(() => [...props.text, ...Array(len - props.text.length).fill('')]);
const hArr = computed(() => [...props.hitMap, ...Array(len - props.hitMap.length).fill(false)]);
const cArr = computed(() => [...props.charMap, ...Array(len - props.charMap.length).fill(null)]);

/* build HTML string for a single syllable of VOLP */
function renderVolp(v: string, span: null | [number, number]): string {
  let out = '';
  for (let i = 0; i < v.length; i++) {
    const ch = v[i];
    const mark = span && i >= span[0] && i <= span[1];
    out += mark ? `<span class="hit">${ch}</span>` : ch;
    if (i < v.length - 1) out += '.';   // dash between notes
  }
  return out + '---';                   // three dashes after syllable
}
</script>

<template>
  <table class="snippet">
    <tbody>
    <!-- VOLPIANO row -->
    <tr class="volpiano text-lg leading-snug">
      <td v-for="(v, i) in vArr" :key="'v'+i" class="px-1" v-html="renderVolp(v, cArr[i])"/>
    </tr>

    <!-- TEXT row -->
    <tr class="text-sm leading-tight">
      <td v-for="(t, i) in tArr" :key="'t'+i" class="px-1">
        <span :class="{ hit: hArr[i] }">{{ t }}</span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.snippet {
  border-collapse: collapse;
  table-layout: fixed;
}

.volpiano {
  font-family: 'Volpiano', serif;
  white-space: nowrap;
}

.hit {
  color: #dc2626;
  font-weight: 600;
}
</style>
