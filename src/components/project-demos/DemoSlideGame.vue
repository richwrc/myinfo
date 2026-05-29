<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const ROUND_SEC = 7.6
const SLIDE_MS = 2500

const tab = ref('manual')
const betAmount = ref(10)
const targetMultiplier = ref(2)
const balance = ref(1000)
const phase = ref('idle')
const trackX = ref(0)
const history = ref([5.04, 2.77, 1.11, 1.23, 1.0, 2.86, 1.39, 4.63])
const countdown = ref(ROUND_SEC)
const tiles = ref([])
const landedMultiplier = ref(null)
const roundResult = ref(null)
const centerIndex = ref(0)
const enrolled = ref(false)
const stageRef = ref(null)
const trackRef = ref(null)

const TILE_W = 86
const TILE_GAP = 12
const TILE_STEP = TILE_W + TILE_GAP
const POOL = [1.0, 1.07, 1.11, 1.23, 1.26, 1.39, 1.47, 1.77, 2.77, 2.86, 4.63, 5.04]

let countdownTimer = null
let resultTimer = null
let resizeObserver = null

const countdownPct = computed(() => `${((ROUND_SEC - countdown.value) / ROUND_SEC) * 100}%`)

const profitOnWin = computed(() => (betAmount.value * targetMultiplier.value).toFixed(2))

const stageCenter = () => {
  const el = stageRef.value
  if (!el) return 0
  return el.clientWidth / 2
}

/** 讓第 index 張牌中心對齊舞台中線 */
const offsetForIndex = (index) => {
  const tileCenter = index * TILE_STEP + TILE_W / 2
  return stageCenter() - tileCenter
}

const makeTiles = () => {
  tiles.value = Array.from({ length: 32 }, (_, i) => {
    const mult = POOL[Math.floor(Math.random() * POOL.length)]
    return { id: `${Date.now()}-${i}-${mult}`, mult: Number(mult.toFixed(2)) }
  })
}

const syncIdlePosition = () => {
  if (phase.value !== 'idle' || !tiles.value.length) return
  trackX.value = offsetForIndex(centerIndex.value)
}

const enrollBet = () => {
  if (phase.value !== 'idle' || enrolled.value) return
  if (betAmount.value <= 0 || betAmount.value > balance.value) return
  enrolled.value = true
}

const startRound = async () => {
  if (phase.value !== 'idle') return

  phase.value = 'sliding'
  roundResult.value = null
  landedMultiplier.value = null
  countdown.value = 0

  const hasBet = enrolled.value
  if (hasBet) {
    balance.value -= betAmount.value
    enrolled.value = false
  }

  makeTiles()
  await nextTick()

  const landIndex = 11 + Math.floor(Math.random() * 7)
  centerIndex.value = landIndex
  const result = tiles.value[landIndex].mult
  const endX = offsetForIndex(landIndex)
  const startX = endX + TILE_STEP * 10

  const track = trackRef.value
  if (track) track.style.transition = 'none'
  trackX.value = startX

  await nextTick()
  requestAnimationFrame(() => {
    if (track) track.style.transition = ''
    trackX.value = endX
  })

  let ended = false
  const onEnd = () => {
    if (ended) return
    ended = true
    track?.removeEventListener('transitionend', onEnd)
    landedMultiplier.value = result
    phase.value = 'result'
    history.value = [result, ...history.value].slice(0, 12)

    if (hasBet) {
      if (result >= targetMultiplier.value) {
        balance.value += betAmount.value * result
        roundResult.value = 'win'
      } else {
        roundResult.value = 'lose'
      }
    }

    resultTimer = window.setTimeout(() => {
      phase.value = 'idle'
      roundResult.value = null
      landedMultiplier.value = null
      countdown.value = ROUND_SEC
      syncIdlePosition()
    }, 1800)
  }

  if (track) {
    track.addEventListener('transitionend', onEnd, { once: true })
    window.setTimeout(onEnd, SLIDE_MS + 120)
  } else {
    onEnd()
  }
}

const tickCountdown = () => {
  if (phase.value !== 'idle') return

  if (countdown.value <= 0.05) {
    startRound()
    return
  }

  countdown.value = Math.max(0, Number((countdown.value - 0.1).toFixed(1)))
}

const halfBet = () => {
  betAmount.value = Math.max(0, Number((betAmount.value / 2).toFixed(2)))
}

const doubleBet = () => {
  betAmount.value = Number((betAmount.value * 2).toFixed(2))
}

onMounted(() => {
  makeTiles()
  centerIndex.value = 5

  nextTick(() => {
    syncIdlePosition()
    resizeObserver = new ResizeObserver(() => syncIdlePosition())
    if (stageRef.value) resizeObserver.observe(stageRef.value)
  })

  countdownTimer = window.setInterval(tickCountdown, 100)
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
  if (resultTimer) clearTimeout(resultTimer)
  resizeObserver?.disconnect()
})
</script>

<template>
  <div class="slide-demo">
    <aside class="slide-demo__side">
      <div class="slide-demo__tabs">
        <button type="button" :class="{ active: tab === 'manual' }" @click="tab = 'manual'">
          {{ t('slideGame.tabManual') }}
        </button>
        <button type="button" :class="{ active: tab === 'auto' }" @click="tab = 'auto'">
          {{ t('slideGame.tabAuto') }}
        </button>
      </div>

      <label class="slide-demo__field">
        <span>{{ t('slideGame.betAmount') }} <em>US${{ balance.toFixed(2) }}</em></span>
        <div class="slide-demo__input-row">
          <input
            v-model.number="betAmount"
            type="number"
            min="0"
            step="0.01"
            :disabled="phase !== 'idle' || enrolled"
          />
          <button type="button" @click="halfBet" :disabled="phase !== 'idle' || enrolled">½</button>
          <button type="button" @click="doubleBet" :disabled="phase !== 'idle' || enrolled">2×</button>
        </div>
      </label>

      <label class="slide-demo__field">
        <span>{{ t('slideGame.targetMultiplier') }}</span>
        <input
          v-model.number="targetMultiplier"
          type="number"
          min="1"
          step="0.01"
          :disabled="phase !== 'idle' || enrolled"
        />
      </label>

      <button
        type="button"
        class="slide-demo__bet-btn"
        :class="{ 'is-enrolled': enrolled }"
        :disabled="phase !== 'idle' || enrolled"
        @click="enrollBet"
      >
        {{
          enrolled
            ? t('slideGame.enrolled')
            : phase === 'sliding'
              ? t('slideGame.sliding')
              : t('slideGame.bet')
        }}
      </button>

      <label class="slide-demo__field slide-demo__field--profit">
        <span>{{ t('slideGame.profitOnWin') }} <em>US$0.00</em></span>
        <input :value="profitOnWin" type="text" readonly />
      </label>
    </aside>

    <section class="slide-demo__main">
      <div class="slide-demo__history">
        <span
          v-for="(item, idx) in history"
          :key="`${item}-${idx}`"
          :class="{ hot: item >= targetMultiplier, latest: idx === 0 }"
        >
          {{ item.toFixed(2) }}×
        </span>
      </div>

      <div ref="stageRef" class="slide-demo__stage" :class="[phase, roundResult]">
        <div
          ref="trackRef"
          class="slide-demo__track"
          :class="{ 'is-sliding': phase === 'sliding' }"
          :style="{ transform: `translate3d(${trackX}px, -50%, 0)` }"
        >
          <div
            v-for="(tile, idx) in tiles"
            :key="tile.id"
            class="slide-demo__tile"
            :class="{ 'is-center': (phase === 'result' || phase === 'idle') && idx === centerIndex }"
          >
            <div class="slide-demo__hex">
              <span>{{ tile.mult.toFixed(2) }}×</span>
            </div>
          </div>
        </div>

        <div class="slide-demo__indicator" aria-hidden="true">
          <span class="slide-demo__indicator-line" />
          <span class="slide-demo__indicator-dot" />
        </div>

        <p v-if="roundResult === 'win'" class="slide-demo__result slide-demo__result--win">
          {{ t('slideGame.win', { value: landedMultiplier?.toFixed(2) }) }}
        </p>
        <p v-else-if="roundResult === 'lose'" class="slide-demo__result slide-demo__result--lose">
          {{ t('slideGame.lose', { value: landedMultiplier?.toFixed(2) }) }}
        </p>
      </div>

      <div class="slide-demo__footer">
        <span class="slide-demo__bets">{{ t('slideGame.bets') }} 135</span>
        <span v-if="phase === 'idle'" class="slide-demo__countdown">
          {{ t('slideGame.nextRound', { sec: countdown.toFixed(1) }) }}
        </span>
        <span v-else class="slide-demo__countdown">{{ t('slideGame.inProgress') }}</span>
      </div>

      <div class="slide-demo__progress">
        <span class="slide-demo__progress-fill" :style="{ width: countdownPct }" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.slide-demo {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 212px minmax(0, 1fr);
  width: 100%;
  max-width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #2f4553;
  background: #0f212e;
  color: #e2e8f0;
  font-size: 13px;
}

.slide-demo__side {
  padding: 12px;
  background: #1a2c38;
  border-right: 1px solid #2f4553;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.slide-demo__tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  background: #0f212e;
  border-radius: 8px;
  padding: 4px;
}

.slide-demo__tabs button {
  border: none;
  background: transparent;
  color: #94a3b8;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}

.slide-demo__tabs button.active {
  background: #2f4553;
  color: #fff;
}

.slide-demo__field {
  display: grid;
  gap: 6px;
}

.slide-demo__field--profit {
  margin-top: auto;
}

.slide-demo__field span {
  display: flex;
  justify-content: space-between;
  color: #94a3b8;
  font-size: 12px;
}

.slide-demo__field span em {
  font-style: normal;
  color: #64748b;
}

.slide-demo__field input {
  width: 100%;
  border: 1px solid #2f4553;
  border-radius: 8px;
  background: #0f212e;
  color: #fff;
  padding: 8px 10px;
  box-sizing: border-box;
}

.slide-demo__input-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 4px;
}

.slide-demo__input-row button {
  border: 1px solid #2f4553;
  background: #0f212e;
  color: #cbd5e1;
  border-radius: 6px;
  padding: 0 8px;
  cursor: pointer;
}

.slide-demo__bet-btn {
  border: none;
  border-radius: 8px;
  background: #1475e1;
  color: #fff;
  font-weight: 700;
  padding: 12px;
  cursor: pointer;
}

.slide-demo__bet-btn.is-enrolled,
.slide-demo__bet-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.slide-demo__bet-btn.is-enrolled {
  background: #2f4553;
}

.slide-demo__main {
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.slide-demo__history {
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid #2f4553;
  overflow-x: auto;
  flex-shrink: 0;
}

.slide-demo__history span {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
}

.slide-demo__history span.hot {
  color: #4391e9;
}

.slide-demo__history span.latest {
  color: #fff;
}

.slide-demo__stage {
  position: relative;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  background: #0f212e;
}

.slide-demo__track {
  position: absolute;
  left: 0;
  top: 50%;
  display: flex;
  gap: 12px;
  will-change: transform;
}

.slide-demo__track.is-sliding {
  transition: transform 2.5s cubic-bezier(0.12, 0.8, 0.2, 1);
}

.slide-demo__tile {
  flex-shrink: 0;
  width: 86px;
  height: 118px;
  border-radius: 10px;
  background: linear-gradient(180deg, #1e3342 0%, #152a36 100%);
  border: 1px solid #2f4553;
  display: grid;
  place-items: center;
  opacity: 0.72;
  transition: opacity 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.slide-demo__tile.is-center {
  opacity: 1;
  border-color: #4391e9;
  box-shadow: 0 0 18px rgba(67, 145, 233, 0.35);
}

.slide-demo__hex {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
  background: #243747;
  border: 2px solid #3d5566;
  font-weight: 700;
  font-size: 12px;
  color: #dfe6ec;
}

.slide-demo__tile.is-center .slide-demo__hex {
  border-color: #4391e9;
  color: #fff;
}

.slide-demo__indicator {
  position: absolute;
  left: 50%;
  top: 12%;
  bottom: 18%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  z-index: 3;
}

.slide-demo__indicator-line {
  flex: 1;
  width: 2px;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

.slide-demo__indicator-dot {
  width: 10px;
  height: 10px;
  margin-top: 4px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.slide-demo__result {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  z-index: 4;
}

.slide-demo__result--win {
  background: rgba(67, 145, 233, 0.2);
  color: #4391e9;
  border: 1px solid rgba(67, 145, 233, 0.45);
}

.slide-demo__result--lose {
  background: rgba(233, 17, 60, 0.15);
  color: #e9113c;
  border: 1px solid rgba(233, 17, 60, 0.35);
}

.slide-demo__footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 14px;
  border-top: 1px solid #2f4553;
  color: #94a3b8;
  font-size: 12px;
  flex-shrink: 0;
}

.slide-demo__bets::before {
  content: '';
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 6px;
  border-radius: 50%;
  background: #00e701;
  vertical-align: middle;
}

.slide-demo__progress {
  height: 3px;
  background: #1a2c38;
  flex-shrink: 0;
}

.slide-demo__progress-fill {
  display: block;
  height: 100%;
  background: #1475e1;
  transition: width 0.1s linear;
}

@media (max-width: 640px) {
  .slide-demo {
    grid-template-columns: 1fr;
    height: auto;
  }

  .slide-demo__side {
    border-right: none;
    border-bottom: 1px solid #2f4553;
  }

  .slide-demo__stage {
    height: 220px;
  }
}
</style>
