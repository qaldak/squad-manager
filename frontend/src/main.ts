import './assets/main.css'

import { createApp } from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { de, en } from 'vuetify/locale'
import { createPinia } from 'pinia'
import * as components from 'vuetify/components'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faPencil, faTrash)

import App from './App.vue'
import router from './router'
import { VDateInput } from 'vuetify/labs/components'
import { initLoglevel } from '@/utils/logger'
import { createI18n } from 'vue-i18n'
import { deTranslations } from '@/i18n/de.locales'
import { enTranslations } from '@/i18n/en.locales'

initLoglevel()

const i18n = createI18n({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'en',
  messages: {
    de: deTranslations,
    en: enTranslations
  }
})

const vuetifyMessages = {
  de: {
    ...de,
    ...deTranslations
  },
  en: {
    ...en,
    ...enTranslations
  }
}

const vuetify = createVuetify({
  components: { ...components, VDateInput }, // imports vuetify components for app
  locale: {
    locale: 'de',
    fallback: 'en',
    messages: vuetifyMessages
  },
  theme: {
    defaultTheme: 'dark' // set dark theme as default
  }
})

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(i18n)
app.use(vuetify)
app.use(createPinia())
app.use(router)

app.mount('#app')
