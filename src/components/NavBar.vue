<script setup>
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '../stores/resume'

const { t, locale } = useI18n()
const resumeStore = useResumeStore()

const switchLocale = (nextLocale) => {
  locale.value = nextLocale
  resumeStore.setLocale(nextLocale)
}
</script>

<template>
  <header class="nav">
    <div class="nav__brand">My Resume</div>
    <nav class="nav__links">
      <RouterLink to="/" class="nav__link">{{ t('nav.home') }}</RouterLink>
      <RouterLink to="/about" class="nav__link">{{ t('nav.about') }}</RouterLink>
      <RouterLink to="/portfolio" class="nav__link">{{ t('nav.portfolio') }}</RouterLink>
      <label class="nav__lang-wrap">
        <select
          class="nav__lang-select"
          :value="resumeStore.locale"
          @change="switchLocale($event.target.value)"
          aria-label="Language switch"
        >
          <option value="zh-TW">{{ t('nav.langZh') }}</option>
          <option value="en">{{ t('nav.langEn') }}</option>
        </select>
      </label>
    </nav>
  </header>
</template>
