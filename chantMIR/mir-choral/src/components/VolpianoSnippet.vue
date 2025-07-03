<script setup lang="ts">
/**
 * Props
 *   volp   – string[]  plain neume strings, one per syllable
 *   text   – string[]  plain lyric syllables, same length
 *   hitMap – boolean[] true where syllable is part of the hit
 */
const props = defineProps<{
  volp: string[];
  text: string[];
  hitMap: boolean[];
}>();

/* pad volp with '---' if text has more cells */
while (props.volp.length < props.text.length) props.volp.push('-----');
</script>

<template>
  <table class="snippet">
    <tbody>
    <tr class="volpiano text-lg leading-snug">
      <td v-for="(v, i) in props.volp" :key="'v'+i" class="px-1">
        <span :class="{ hit: props.hitMap[i] }">{{ v }}--</span>
        <span v-if="i < props.volp.length - 1">--</span>
      </td>
    </tr>
    <tr class="text-sm leading-tight">
      <td v-for="(t, i) in props.text" :key="'t'+i" class="px-1">
        <span :class="{ hit: props.hitMap[i] }">{{ t }}</span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.snippet   { border-collapse: collapse; table-layout: fixed; }
.volpiano  { font-family: 'Volpiano', serif; white-space: nowrap; }
.hit       { color: #dc2626; font-weight: 600; }
</style>
