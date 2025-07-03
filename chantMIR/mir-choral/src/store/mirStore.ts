import {defineStore} from 'pinia';
import SearchWorker from '@/workers/search.worker?worker';
import type {QueryPayload, QueryResponse, Occurrence} from '@/models';

export const useMirStore = defineStore('mir', {
    state: () => ({
        pattern: '' as string,
        context: 3,
        hits: [] as Occurrence[],
        running: false,
        elapsed: 0
    }),
    getters: {
        ctxHits: (s) => s.hits.map(h => ({...h, ctx: s.context}))
    },

    actions: {
        search() {
            if (!this.pattern.trim()) return;
            this.running = true;
            const w = new SearchWorker();
            const payload: QueryPayload = {pattern: this.pattern};
            const t0 = performance.now();

            w.onmessage = (e: MessageEvent<QueryResponse>) => {
                this.hits = e.data.hits;
                this.elapsed = e.data.elapsedMs ?? Math.round(performance.now() - t0);
                this.running = false;
                w.terminate();
            };

            w.postMessage(payload);
        }
    }
});
