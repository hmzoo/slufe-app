import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import { Inkline, components } from '@inkline/inkline';
import '@inkline/inkline/inkline.scss';
import './main.scss';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

app.use(Inkline, {
    components
});
    
app.mount('#app');