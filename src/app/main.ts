import '../assets/global.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '../app/App.vue'
import router from '../app/router'
import vue3GoogleLogin from 'vue3-google-login'
import { AUTH_CLIENT_ID } from '@/shared/config/config'

createApp(App)
  .use(vue3GoogleLogin, {
    clientId: AUTH_CLIENT_ID
  })
  .use(createPinia())
  .use(router)
  .mount('#app')
