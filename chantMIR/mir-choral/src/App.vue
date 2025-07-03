<script setup lang="ts">
import ControlPanel from '@/components/ControlPanel.vue';
import ResultTable  from '@/components/ResultTable.vue';
</script>

<template>
  <main class="min-h-screen p-4 max-w-4xl mx-auto space-y-6">

    <ControlPanel />
    <ResultTable />
  </main>
</template>

<style scoped>
main { font-family: system-ui, sans-serif; }
</style>