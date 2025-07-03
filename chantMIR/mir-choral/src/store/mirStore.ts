import { defineStore } from 'pinia';
import SearchWorker from '@/workers/search.worker?worker';
import type { Occurrence, QueryPayload, QueryResponse } from '@/models';

export const useMirStore = defineStore('mir', {
    state: () => ({
        /* user inputs */
        pattern : '',
        context : 1,
        msFrom  : '',
        msTo    : '',
        mode    : 'cmp' as  'cmp' | 'occ',

        /* result data */
        hits    : [] as Occurrence[],
        running : false,
        elapsed : 0
    }),

    getters: {
        isCompare: (s) => s.mode === 'cmp'
    },

    actions: {
        search() {
            /* basic validation */
            if (!this.pattern.trim() || !this.msFrom.trim()) return;

            this.running = true;
            const w = new SearchWorker();
            const payload: QueryPayload = {
                pattern: this.pattern,
                msFrom : this.msFrom.trim()
            };

            w.postMessage(payload);
            w.onmessage = (e: MessageEvent<QueryResponse>) => {
                this.hits    = e.data.hits;
                this.elapsed = e.data.elapsedMs;
                this.running = false;
                w.terminate();
            };
        }
    }
});
