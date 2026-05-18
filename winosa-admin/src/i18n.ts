import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en/translation.json'
import nl from './locales/nl/translation.json'
import id from './locales/id/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      nl: { translation: nl },
      id: { translation: id }
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'nl', 'id'],
    detection: {
      order: ['navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  })

export default i18n