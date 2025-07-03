import { ref, computed, onMounted } from 'vue';
import ControlPanel from '@/components/ControlPanel.vue';
import ResultTable from '@/components/ResultTable.vue';
import DualViewer from '@/components/DualViewer.vue';
import { useMirStore } from '@/store/mirStore';
import { loadChants } from '@/services/indexLoader';
const store = useMirStore();
const byUuid = ref({});
onMounted(async () => {
    const chants = await loadChants();
    byUuid.value = Object.fromEntries(chants.map(c => [c.uuid, c]));
});
const selected = ref(null); // Occurrence | null
function onSelect(hit) { selected.value = hit; }
/* computed Getter für Target-Chant */
const chantB = computed(() => {
    if (!store.isCompare || !selected.value)
        return null;
    const src = byUuid.value[selected.value.uuid];
    return Object.values(byUuid.value).find(c => c.ms === store.msTo && c.incipit === src?.incipit) ?? null;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "max-w-6xl mx-auto p-4 space-y-6" },
});
/** @type {[typeof ControlPanel, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ControlPanel, new ControlPanel({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof ResultTable, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(ResultTable, new ResultTable({
    ...{ 'onSelect': {} },
}));
const __VLS_4 = __VLS_3({
    ...{ 'onSelect': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
let __VLS_6;
let __VLS_7;
let __VLS_8;
const __VLS_9 = {
    onSelect: (__VLS_ctx.onSelect)
};
var __VLS_5;
if (__VLS_ctx.selected && __VLS_ctx.byUuid[__VLS_ctx.selected.uuid]) {
    /** @type {[typeof DualViewer, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(DualViewer, new DualViewer({
        hit: (__VLS_ctx.selected),
        chantA: (__VLS_ctx.byUuid[__VLS_ctx.selected.uuid]),
        chantB: (__VLS_ctx.chantB),
        ctx: (__VLS_ctx.store.context),
    }));
    const __VLS_11 = __VLS_10({
        hit: (__VLS_ctx.selected),
        chantA: (__VLS_ctx.byUuid[__VLS_ctx.selected.uuid]),
        chantB: (__VLS_ctx.chantB),
        ctx: (__VLS_ctx.store.context),
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
}
/** @type {__VLS_StyleScopedClasses['max-w-6xl']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ControlPanel: ControlPanel,
            ResultTable: ResultTable,
            DualViewer: DualViewer,
            store: store,
            byUuid: byUuid,
            selected: selected,
            onSelect: onSelect,
            chantB: chantB,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
