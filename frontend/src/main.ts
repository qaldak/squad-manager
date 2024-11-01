import './assets/main.css'

import { createApp } from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia'
import * as components from 'vuetify/components'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faPencil } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faPencil)

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
const vuetify = createVuetify({
  components: components, // imports vuetify components for app
  theme: {
    defaultTheme: 'dark' // set dark theme as default
  }
})

app.use(vuetify)
app.use(createPinia())
app.use(router)

app.mount('#app')
