import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import NextApp from './NextApp.vue'
import ParentComponent from './ParentComponent.vue'

const app = createApp(NextApp)

app.use(router)

app.mount('#app')
