import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import { Inkline, components } from '@inkline/inkline';
import '@inkline/inkline/inkline.scss';
import './main.scss';

import VueCookieComply from 'vue-cookie-comply'
import 'vue-cookie-comply/dist/style.css'

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

app.use(Inkline, {
    components
});

app.use(VueCookieComply)
    
app.mount('#app');