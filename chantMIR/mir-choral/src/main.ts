import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia';
import '@/assets/volpiano/volpiano.css';
import App from './App.vue'


createApp(App)
    .use(createPinia())
    .mount('#app')
