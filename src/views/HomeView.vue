<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()
const profile = computed(() => tm('resume.profile'))
const skills = computed(() => tm('resume.skills'))
</script>

<template>
  <section class="hero fade-up">
    <p class="hero__tag">{{ t('home.tag') }}</p>
    <h1>{{ profile.name }}</h1>
    <h2>{{ profile.title }}</h2>
    <p class="hero__summary">{{ profile.summary }}</p>
    <div class="hero__meta">
      <span>{{ profile.location }}</span>
      <span>{{ profile.email }}</span>
    </div>
  </section>

  <section class="card-grid">
    <article class="card fade-up" v-for="skill in skills" :key="skill">
      <h3>{{ skill }}</h3>
      <p>{{ t('home.skillDesc') }}</p>
    </article>
  </section>
</template>
