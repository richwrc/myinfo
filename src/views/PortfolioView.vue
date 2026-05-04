<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()
const projects = computed(() => tm('resume.projects'))
</script>

<template>
  <section class="section-title fade-up">
    <h2>{{ t('portfolio.title') }}</h2>
    <p>{{ t('portfolio.subtitle') }}</p>
  </section>

  <section class="project-list">
    <article class="project-card fade-up" v-for="project in projects" :key="project.id">
      <h3>{{ project.name }}</h3>
      <p>{{ project.intro }}</p>
      <span>{{ project.tech }}</span>
      <RouterLink class="project-card__action" :to="`/portfolio/${project.id}`">
        {{ t('portfolio.viewDetail') }}
      </RouterLink>
    </article>
  </section>
</template>
