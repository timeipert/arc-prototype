import { reactive, onMounted } from 'vue';
import VolpianoSnippet from '@/components/VolpianoSnippet.vue';
import { useMirStore } from '@/store/mirStore';
import { loadChants } from '@/services/indexLoader';
const store = useMirStore();
const chants = reactive({});
onMounted(async () => (await loadChants()).forEach(c => (chants[c.uuid] = c)));
/* counterpart helper as before */
const counterpart = (uuid) => {
    const from = chants[uuid];
    if (!from)
        return null;
    return Object.values(chants).find(d => d.ms === store.msTo && d.incipit === from.incipit) ?? null;
};
/* NEW: build arrays, not HTML strings */
function buildArrays(doc, h) {
    if (!doc)
        return { volp: [], text: [], hitMap: [] };
    const ctx = store.context;
    const s = doc.syllables;
    const L = Math.max(0, h.start - ctx);
    const R = Math.min(s.length, h.end + ctx);
    const hitF = h.start - L;
    const hitL = h.end - 1 - L;
    const volp = [];
    const text = [];
    const hitMap = [];
    for (let i = L; i < R; i++) {
        volp.push(s[i].volpiano);
        text.push(s[i].text);
        hitMap.push(i >= h.start && i < h.end);
    }
    return { volp, text, hitMap };
}
const emit = defineEmits();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (!__VLS_ctx.store.running) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
        ...{ class: "w-full text-sm border-collapse table-fixed" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
    for (const [h] of __VLS_getVForSourceType((__VLS_ctx.store.hits))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.store.running))
                        return;
                    __VLS_ctx.emit('select', h);
                } },
            key: (h.ms + h.uuid + h.start),
            ...{ class: "hover:bg-blue-50 cursor-pointer" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "border p-1 truncate" },
        });
        (h.ms);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "border p-1 truncate" },
        });
        (__VLS_ctx.chants[h.uuid]?.incipit);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "border p-1 text-right" },
        });
        (h.start);
        (h.end - 1);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "border p-0" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "clip" },
        });
        /** @type {[typeof VolpianoSnippet, ]} */ ;
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(VolpianoSnippet, new VolpianoSnippet({
            ...(__VLS_ctx.buildArrays(__VLS_ctx.chants[h.uuid], h)),
        }));
        const __VLS_1 = __VLS_0({
            ...(__VLS_ctx.buildArrays(__VLS_ctx.chants[h.uuid], h)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_0));
        if (__VLS_ctx.store.isCompare) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                ...{ class: "border p-0" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "clip" },
            });
            if (__VLS_ctx.counterpart(h.uuid)) {
                /** @type {[typeof VolpianoSnippet, ]} */ ;
                // @ts-ignore
                const __VLS_3 = __VLS_asFunctionalComponent(VolpianoSnippet, new VolpianoSnippet({
                    ...(__VLS_ctx.buildArrays(__VLS_ctx.counterpart(h.uuid), h)),
                }));
                const __VLS_4 = __VLS_3({
                    ...(__VLS_ctx.buildArrays(__VLS_ctx.counterpart(h.uuid), h)),
                }, ...__VLS_functionalComponentArgsRest(__VLS_3));
            }
            else {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                    ...{ class: "italic text-gray-500" },
                });
            }
        }
    }
}
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border-collapse']} */ ;
/** @type {__VLS_StyleScopedClasses['table-fixed']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-blue-50']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['clip']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['p-0']} */ ;
/** @type {__VLS_StyleScopedClasses['clip']} */ ;
/** @type {__VLS_StyleScopedClasses['italic']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VolpianoSnippet: VolpianoSnippet,
            store: store,
            chants: chants,
            counterpart: counterpart,
            buildArrays: buildArrays,
            emit: emit,
        };
    },
    __typeEmits: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
});
; /* PartiallyEnd: #4569/main.vue */
