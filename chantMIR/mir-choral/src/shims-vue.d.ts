declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const comp: DefineComponent<{}, {}, any>;
    export default comp;
}

declare module 'zstd-codec';   // bare stub is enough
