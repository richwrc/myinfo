<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DemoAuthPanel from '../components/project-demos/DemoAuthPanel.vue'
import DemoDataTable from '../components/project-demos/DemoDataTable.vue'
import DemoDashboardCard from '../components/project-demos/DemoDashboardCard.vue'
import DemoList from '../components/project-demos/DemoList.vue'
import DemoElementPlus from '../components/project-demos/DemoElementPlus.vue'
import DemoWebSocket from '../components/project-demos/DemoWebSocket.vue'
import DemoOnePage from '../components/project-demos/DemoOnePage.vue'
import DemoVideoChat from '../components/project-demos/DemoVideoChat.vue'
import DemoDiceGame from '../components/project-demos/DemoDiceGame.vue'
import DemoCrashGame from '../components/project-demos/DemoCrashGame.vue'
import DemoSlideGame from '../components/project-demos/DemoSlideGame.vue'

const route = useRoute()
const { t, tm } = useI18n()

const projects = computed(() => tm('resume.projects'))
const project = computed(() => projects.value.find((item) => item.id === route.params.id))

const demoComponentMap = {
  auth: DemoAuthPanel,
  table: DemoDataTable,
  dashboard: DemoDashboardCard,
  list: DemoList,
  element: DemoElementPlus,
  websocket: DemoWebSocket,
  onepage: DemoOnePage,
  videoChat: DemoVideoChat,
  diceGame: DemoDiceGame,
  crashGame: DemoCrashGame,
  slideGame: DemoSlideGame,
}

const resolveFeatureComponent = (featureKey) => demoComponentMap[featureKey] || DemoDashboardCard
</script>

<template>
  <section v-if="project" class="project-detail fade-up">
    <RouterLink class="project-detail__back" to="/portfolio">
      {{ t('portfolio.backToList') }}
    </RouterLink>
    <h2>{{ project.name }}</h2>
    <p class="project-detail__intro">{{ project.intro }}</p>
    <p class="project-detail__tech">{{ project.tech }}</p>

    <section class="section-title">
      <h3>{{ t('portfolio.featureTitle') }}</h3>
      <p>{{ t('portfolio.featureSubtitle') }}</p>
    </section>

    <article class="feature-card" v-for="feature in project.features" :key="feature.name">
      <div class="feature-card__header">
        <h4>{{ feature.name }}</h4>
        <span>{{ t('portfolio.demoLabel') }}</span>
      </div>
      <p>{{ feature.description }}</p>
      <component :is="resolveFeatureComponent(feature.componentKey)" />
    </article>
  </section>

  <section v-else class="project-detail fade-up">
    <h2>{{ t('portfolio.notFoundTitle') }}</h2>
    <p>{{ t('portfolio.notFoundSubtitle') }}</p>
    <RouterLink class="project-detail__back" to="/portfolio">
      {{ t('portfolio.backToList') }}
    </RouterLink>
  </section>
</template>
