<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()
const activeTab = ref('chat')
const draft = ref('')

// 公開示範影片（可替換成實際賽事串流或 VOD）
const demoVideoSrc =
  'https://www.w3schools.com/html/mov_bbb.mp4'

const messages = computed(() => tm('liveRoom.messages'))
const sentMessages = ref([])

const displayMessages = computed(() => [...messages.value, ...sentMessages.value])

const sendMessage = () => {
  const text = draft.value.trim()
  if (!text) return
  sentMessages.value.push({
    level: 8,
    user: t('liveRoom.you'),
    text,
    isSelf: true,
  })
  draft.value = ''
}
</script>

<template>
  <div class="live-room">
    <section class="live-room__video">
      <div class="live-room__video-top">
        <span class="live-room__back" aria-hidden="true">‹</span>
        <p>{{ t('liveRoom.matchTitle') }}</p>
      </div>

      <video
        class="live-room__player"
        :src="demoVideoSrc"
        controls
        playsinline
        muted
        loop
        preload="metadata"
      />
    </section>

    <section class="live-room__panel">
      <div class="live-room__tabs">
        <button
          type="button"
          :class="{ active: activeTab === 'chat' }"
          @click="activeTab = 'chat'"
        >
          {{ t('liveRoom.tabChat') }}
        </button>
        <button
          type="button"
          :class="{ active: activeTab === 'host' }"
          @click="activeTab = 'host'"
        >
          {{ t('liveRoom.tabHost') }}
        </button>
        <button type="button" class="live-room__follow">{{ t('liveRoom.follow') }}</button>
      </div>

      <div v-if="activeTab === 'chat'" class="live-room__chat">
        <ul class="live-room__messages">
          <li v-for="(msg, idx) in displayMessages" :key="idx" :class="{ 'is-self': msg.isSelf }">
            <span class="live-room__level">LV {{ msg.level }}</span>
            <span class="live-room__user">{{ msg.user }}：</span>
            <span class="live-room__text">{{ msg.text }}</span>
          </li>
        </ul>
        <p class="live-room__join">{{ t('liveRoom.joinHint') }}</p>
        <form class="live-room__input" @submit.prevent="sendMessage">
          <input v-model="draft" type="text" :placeholder="t('liveRoom.inputPlaceholder')" />
          <button type="submit" aria-label="send">send</button>
        </form>
      </div>

      <div v-else class="live-room__host">
        <p>{{ t('liveRoom.hostTitle') }}</p>
        <p>{{ t('liveRoom.hostDesc') }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.live-room {
  margin-top: 12px;
  width: 100%;
  max-width: 360px;
  height: 620px;
  border: 1px solid #dbeafe;
  border-radius: 14px;
  overflow: hidden;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

.live-room__video {
  position: relative;
  height: 220px;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.live-room__video-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(15, 23, 42, 0.55);
  font-size: 12px;
}

.live-room__back {
  font-size: 20px;
  line-height: 1;
}

.live-room__video-top p {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.live-room__player {
  width: 100%;
  height: 100%;
  flex: 1;
  object-fit: cover;
  background: #000;
}

.live-room__panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.live-room__tabs {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 12px;
  border-bottom: 1px solid #e2e8f0;
}

.live-room__tabs button {
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
}

.live-room__tabs button.active {
  color: #2563eb;
  font-weight: 700;
  border-bottom: 2px solid #2563eb;
}

.live-room__follow {
  margin-left: auto !important;
  border: 1px solid #93c5fd !important;
  border-radius: 999px !important;
  color: #2563eb !important;
  padding: 4px 10px !important;
  font-size: 12px !important;
}

.live-room__chat {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.live-room__messages {
  list-style: none;
  margin: 0;
  padding: 10px 12px;
  flex: 1;
  overflow-y: auto;
  display: grid;
  gap: 8px;
  align-content: start;
}

.live-room__messages li {
  font-size: 12px;
  line-height: 1.5;
  color: #334155;
}

.live-room__messages li.is-self {
  text-align: right;
}

.live-room__level {
  display: inline-block;
  margin-right: 4px;
  padding: 1px 5px;
  border-radius: 4px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 10px;
  font-weight: 700;
}

.live-room__user {
  color: #2563eb;
  font-weight: 600;
}

.live-room__join {
  margin: 0;
  padding: 0 12px 6px;
  font-size: 11px;
  color: #94a3b8;
}

.live-room__input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px 10px;
  border-top: 1px solid #e2e8f0;
}

.live-room__input input {
  flex: 1;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 12px;
}

.live-room__host {
  padding: 16px 12px;
  color: #475569;
  font-size: 13px;
  line-height: 1.6;
}

.live-room__host p {
  margin: 0 0 8px;
}
</style>
