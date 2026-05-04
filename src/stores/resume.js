import { defineStore } from 'pinia'

export const useResumeStore = defineStore('resume', {
  state: () => ({
    locale: 'zh-TW',
  }),
  actions: {
    setLocale(locale) {
      this.locale = locale
    },
  },
})
