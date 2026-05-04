<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()
const experiences = computed(() => tm('resume.experiences'))
</script>

<template>
  <section class="section-title fade-up">
    <h2>{{ t('about.title') }}</h2>
    <p>{{ t('about.subtitle') }}</p>
  </section>

  <section class="timeline">
    <article class="timeline__item fade-up" v-for="exp in experiences" :key="exp.company">
      <div class="timeline__dot"></div>
      <div class="timeline__content">
        <h3>{{ exp.role }}｜{{ exp.company }}</h3>
        <small>{{ exp.period }}</small>
        <p>{{ exp.description }}</p>
      </div>
    </article>
  </section>
</template>
