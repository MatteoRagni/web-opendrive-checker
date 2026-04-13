import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import * as bootstrap from 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import "./style.css"

import { Icon } from '@iconify/vue'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.component('icon', Icon)
app.mount('#app')
