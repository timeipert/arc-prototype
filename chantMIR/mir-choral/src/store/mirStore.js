import { defineStore } from 'pinia';
import SearchWorker from '@/workers/search.worker?worker';
export const useMirStore = defineStore('mir', {
    state: () => ({
        /* user inputs */
        pattern: '',
        context: 3,
        msFrom: '', // filled by ControlPanel
        msTo: '',
        mode: 'occ',
        /* result data */
        hits: [],
        running: false,
        elapsed: 0
    }),
    getters: {
        isCompare: (s) => s.mode === 'cmp'
    },
    actions: {
        search() {
            /* basic validation */
            if (!this.pattern.trim() || !this.msFrom.trim())
                return;
            this.running = true;
            const w = new SearchWorker();
            const payload = {
                pattern: this.pattern,
                msFrom: this.msFrom.trim()
            };
            w.postMessage(payload);
            w.onmessage = (e) => {
                this.hits = e.data.hits;
                this.elapsed = e.data.elapsedMs;
                this.running = false;
                w.terminate();
            };
        }
    }
});
