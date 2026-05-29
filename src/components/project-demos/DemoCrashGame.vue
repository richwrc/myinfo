<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const tab = ref('manual')
const betAmount = ref(10)
const cashOutAt = ref(2)
const balance = ref(1000)
const phase = ref('idle')
const displayMultiplier = ref(1)
const hasBet = ref(false)
const cashedOut = ref(false)
const roundResult = ref(null)
const stakeLocked = ref(0)
const lockedCashOutAt = ref(2)
const history = ref([1.81, 3.36, 27.95, 3.32, 1.12, 2.0, 1.7, 1.52, 5.87])
const chartPoints = ref([])
const headPoint = ref({ x: 0, y: 100 })

const finalCrashAt = ref(2)
const MIN_CASHOUT_MULT = 1.01

let rafId = null
let crashAt = 2
let roundDuration = 4000
let roundStart = 0

const CHART_BOTTOM = 100
const CHART_TOP = 6

const profitOnWin = computed(() => (stakeLocked.value * lockedCashOutAt.value).toFixed(2))
const isRoundLocked = computed(() => phase.value === 'running' && hasBet.value)

const multiplierText = computed(() => {
  if (phase.value === 'idle') return '1.00×'
  if (roundResult.value === 'win') {
    return `${lockedCashOutAt.value.toFixed(2)}×`
  }
  return `${displayMultiplier.value.toFixed(2)}×`
})

const chartVisible = computed(() => phase.value !== 'idle')
const showCrashedBadge = computed(() => phase.value === 'crashed')
const showHeadSpark = computed(() => phase.value === 'crashed')

const pointsToPath = (pts) => {
  if (pts.length < 2) return ''
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
}

const linePath = computed(() => pointsToPath(chartPoints.value))

const areaPath = computed(() => {
  const pts = chartPoints.value
  if (pts.length < 2) return ''
  const line = pointsToPath(pts)
  const last = pts[pts.length - 1]
  return `${line} L ${last.x} ${CHART_BOTTOM} L 0 ${CHART_BOTTOM} Z`
})

const gridLines = [20, 40, 60, 80]

const randomCrashPoint = () => {
  const r = Math.random()
  if (r < 0.35) return 1.05 + Math.random() * 0.45
  if (r < 0.65) return 1.5 + Math.random() * 1.5
  if (r < 0.88) return 3 + Math.random() * 4
  return 6 + Math.random() * 18
}

/** 錄影中 Stake：X/Y 皆依倍率對數比例 → 左下到右上對角線 */
const logRatioFromM = (m) => {
  if (m <= 1 || crashAt <= 1) return 0
  return Math.log(m) / Math.log(crashAt)
}

const pointFromMultiplier = (m) => {
  const ratio = logRatioFromM(m)
  return {
    x: ratio * 100,
    y: CHART_BOTTOM - ratio * (CHART_BOTTOM - CHART_TOP),
  }
}

const multiplierAtTime = (timeProgress) => Math.pow(crashAt, timeProgress)

/** Stake 近似增速：exp(0.00006 * ms)，並限制最長局時 */
const durationForCrash = (target) =>
  Math.round(Math.min(24000, Math.max(2800, Math.log(target) / 0.00006)))

const buildChart = (timeProgress) => {
  const pts = []
  const steps = 80
  const p = Math.min(1, Math.max(0, timeProgress))
  const count = Math.max(2, Math.ceil(steps * p))

  for (let i = 0; i <= count; i++) {
    const t = (i / steps) * p
    const m = multiplierAtTime(t)
    pts.push(pointFromMultiplier(m))
  }

  chartPoints.value = pts
  headPoint.value = pts[pts.length - 1] || { x: 0, y: CHART_BOTTOM }
}

const resetChart = () => {
  chartPoints.value = []
  headPoint.value = { x: 0, y: CHART_BOTTOM }
}

const stopAnim = () => {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

const doCashOut = () => {
  if (!hasBet.value || cashedOut.value || phase.value !== 'running') return
  if (displayMultiplier.value < MIN_CASHOUT_MULT) return
  cashedOut.value = true
  balance.value += stakeLocked.value * lockedCashOutAt.value
}

const finishRound = () => {
  stopAnim()

  if (hasBet.value) {
    roundResult.value = cashedOut.value ? 'win' : 'lose'
  }

  if (cashedOut.value) {
    displayMultiplier.value = lockedCashOutAt.value
    buildChart(Math.log(lockedCashOutAt.value) / Math.log(crashAt))
  } else {
    displayMultiplier.value = crashAt
    buildChart(1)
  }

  phase.value = roundResult.value === 'win' ? 'won' : 'crashed'

  history.value = [Number(crashAt.toFixed(2)), ...history.value].slice(0, 12)

  window.setTimeout(() => {
    phase.value = 'idle'
    displayMultiplier.value = 1
    hasBet.value = false
    cashedOut.value = false
    roundResult.value = null
    stakeLocked.value = 0
    resetChart()
  }, 2200)
}

const animate = (timestamp) => {
  if (!roundStart) roundStart = timestamp
  const elapsed = timestamp - roundStart
  const progress = Math.min(1, elapsed / roundDuration)
  const m = multiplierAtTime(progress)

  displayMultiplier.value = Number(m.toFixed(2))
  buildChart(progress)

  if (
    hasBet.value &&
    !cashedOut.value &&
    displayMultiplier.value >= MIN_CASHOUT_MULT &&
    displayMultiplier.value >= lockedCashOutAt.value
  ) {
    doCashOut()
  }

  if (progress >= 1) {
    finishRound()
    return
  }

  rafId = requestAnimationFrame(animate)
}

const startRound = () => {
  if (phase.value === 'running') return
  if (betAmount.value <= 0 || betAmount.value > balance.value) return

  stopAnim()
  balance.value -= betAmount.value
  stakeLocked.value = betAmount.value
  lockedCashOutAt.value = cashOutAt.value
  hasBet.value = true
  cashedOut.value = false
  roundResult.value = null

  phase.value = 'running'
  displayMultiplier.value = 1
  crashAt = Number(randomCrashPoint().toFixed(2))
  finalCrashAt.value = crashAt
  roundDuration = durationForCrash(crashAt)
  roundStart = 0
  buildChart(0)

  rafId = requestAnimationFrame(animate)
}

const onBetAction = () => {
  if (phase.value === 'idle') startRound()
}

const halfBet = () => {
  betAmount.value = Math.max(0, Number((betAmount.value / 2).toFixed(2)))
}

const doubleBet = () => {
  betAmount.value = Number((betAmount.value * 2).toFixed(2))
}

onUnmounted(stopAnim)
</script>

<template>
  <div class="crash-demo">
    <aside class="crash-demo__side">
      <div class="crash-demo__tabs">
        <button type="button" :class="{ active: tab === 'manual' }" @click="tab = 'manual'">
          {{ t('crashGame.tabManual') }}
        </button>
        <button type="button" :class="{ active: tab === 'auto' }" @click="tab = 'auto'">
          {{ t('crashGame.tabAuto') }}
        </button>
      </div>

      <label class="crash-demo__field">
        <span>{{ t('crashGame.betAmount') }} <em>US${{ balance.toFixed(2) }}</em></span>
        <div class="crash-demo__input-row">
          <input
            v-model.number="betAmount"
            type="number"
            min="0"
            step="0.01"
            :disabled="phase === 'running'"
          />
          <button type="button" @click="halfBet" :disabled="phase === 'running'">½</button>
          <button type="button" @click="doubleBet" :disabled="phase === 'running'">2×</button>
        </div>
      </label>

      <label class="crash-demo__field">
        <span>{{ t('crashGame.cashOutAt') }}</span>
        <input
          v-model.number="cashOutAt"
          type="number"
          min="1.01"
          step="0.01"
          :disabled="phase === 'running'"
        />
      </label>

      <button
        type="button"
        class="crash-demo__bet-btn"
        :disabled="phase === 'running'"
        @click="onBetAction"
      >
        {{ phase === 'running' ? t('crashGame.roundRunning') : t('crashGame.betNext') }}
      </button>

      <p v-show="isRoundLocked" class="crash-demo__locked-hint">
        {{ t('crashGame.autoCashOutHint', { value: lockedCashOutAt.toFixed(2) }) }}
      </p>

      <label class="crash-demo__field crash-demo__field--profit">
        <span>{{ t('crashGame.profitOnWin') }} <em>US$0.00</em></span>
        <input :value="profitOnWin" type="text" readonly />
      </label>
    </aside>

    <section class="crash-demo__main">
      <div class="crash-demo__history">
        <span
          v-for="(item, idx) in history"
          :key="`${item}-${idx}`"
          :class="{ hot: item >= 2, latest: idx === 0 }"
        >
          {{ item.toFixed(2) }}×
        </span>
      </div>

      <div class="crash-demo__stage" :class="[phase, roundResult]">
        <svg
          class="crash-demo__grid"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            v-for="y in gridLines"
            :key="y"
            x1="0"
            :y1="y"
            x2="100"
            :y2="y"
            class="crash-demo__grid-line"
          />
        </svg>

        <svg
          v-show="chartVisible"
          class="crash-demo__chart"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="crashFillGrey" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(177, 186, 195, 0.22)" />
              <stop offset="100%" stop-color="rgba(177, 186, 195, 0)" />
            </linearGradient>
          </defs>
          <path v-if="areaPath" :d="areaPath" fill="url(#crashFillGrey)" />
          <path
            v-if="linePath"
            :d="linePath"
            class="crash-demo__line"
            fill="none"
            stroke="#e4ecef"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle
            v-if="phase === 'running' || phase === 'crashed'"
            :cx="headPoint.x"
            :cy="headPoint.y"
            r="2"
            fill="#fff"
            class="crash-demo__head"
          />
          <circle
            v-if="showHeadSpark"
            :cx="headPoint.x"
            :cy="headPoint.y"
            r="5"
            fill="none"
            stroke="#fff"
            stroke-width="1.2"
            class="crash-demo__spark"
          />
        </svg>

        <div class="crash-demo__overlay">
          <p class="crash-demo__multiplier">{{ multiplierText }}</p>

          <span v-if="showCrashedBadge" class="crash-demo__busted">
            {{ t('crashGame.crashed') }}
          </span>

          <p v-if="roundResult === 'win'" class="crash-demo__toast crash-demo__toast--win">
            {{ t('crashGame.win') }}
          </p>
        </div>
      </div>

      <div class="crash-demo__footer">
        <span>{{ t('crashGame.players') }} 384</span>
        <span class="crash-demo__wagered">{{ t('crashGame.totalWagered') }} 12,450.00</span>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.crash-demo {
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

.crash-demo__side {
  padding: 12px;
  background: #1a2c38;
  border-right: 1px solid #2f4553;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.crash-demo__tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  background: #0f212e;
  border-radius: 8px;
  padding: 4px;
  flex-shrink: 0;
}

.crash-demo__tabs button {
  border: none;
  background: transparent;
  color: #94a3b8;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}

.crash-demo__tabs button.active {
  background: #2f4553;
  color: #fff;
}

.crash-demo__field {
  display: grid;
  gap: 6px;
  flex-shrink: 0;
}

.crash-demo__field--profit {
  margin-top: auto;
}

.crash-demo__field span {
  display: flex;
  justify-content: space-between;
  color: #94a3b8;
  font-size: 12px;
}

.crash-demo__field span em {
  font-style: normal;
  color: #64748b;
}

.crash-demo__field input {
  width: 100%;
  border: 1px solid #2f4553;
  border-radius: 8px;
  background: #0f212e;
  color: #fff;
  padding: 8px 10px;
  box-sizing: border-box;
}

.crash-demo__input-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 4px;
}

.crash-demo__input-row button {
  border: 1px solid #2f4553;
  background: #0f212e;
  color: #cbd5e1;
  border-radius: 6px;
  padding: 0 8px;
  cursor: pointer;
}

.crash-demo__bet-btn {
  border: none;
  border-radius: 8px;
  background: #1475e1;
  color: #fff;
  font-weight: 700;
  padding: 12px;
  cursor: pointer;
  flex-shrink: 0;
}

.crash-demo__locked-hint {
  margin: 0;
  min-height: 2.6em;
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
  flex-shrink: 0;
}

.crash-demo__bet-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.crash-demo__main {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.crash-demo__history {
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid #2f4553;
  overflow-x: auto;
  scrollbar-width: thin;
  flex-shrink: 0;
}

.crash-demo__history span {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
}

.crash-demo__history span.hot {
  color: #00e701;
}

.crash-demo__history span.latest {
  color: #fff;
}

.crash-demo__stage {
  position: relative;
  min-height: 0;
  overflow: hidden;
  background: #0f212e;
  contain: strict;
}

.crash-demo__grid,
.crash-demo__chart {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

.crash-demo__grid-line {
  stroke: #1a3545;
  stroke-width: 0.6;
  vector-effect: non-scaling-stroke;
}

.crash-demo__line {
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.35));
}

.crash-demo__head {
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.9));
}

.crash-demo__spark {
  animation: spark-burst 0.55s ease-out forwards;
}

.crash-demo__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 2;
}

.crash-demo__multiplier {
  margin: 0;
  font-size: clamp(2.6rem, 9vw, 4rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: #fff;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.45);
}

.crash-demo__stage.idle .crash-demo__multiplier {
  color: #b1bad3;
  text-shadow: none;
}

.crash-demo__stage.running .crash-demo__multiplier {
  color: #fff;
}

.crash-demo__stage.crashed .crash-demo__multiplier {
  text-shadow:
    0 0 22px rgba(233, 17, 60, 0.9),
    0 0 42px rgba(233, 17, 60, 0.55),
    0 3px 10px rgba(233, 17, 60, 0.65);
}

.crash-demo__stage.won .crash-demo__multiplier {
  color: #00e701;
  text-shadow: 0 0 18px rgba(0, 231, 1, 0.45);
}

.crash-demo__stage.won::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 231, 1, 0.05);
  pointer-events: none;
}

.crash-demo__busted {
  margin-top: 0.5rem;
  padding: 5px 18px;
  border-radius: 999px;
  background: #e9113c;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  animation: busted-in 0.25s ease;
}

.crash-demo__overlay {
  gap: 0;
}

.crash-demo__toast {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  animation: toast-in 0.3s ease;
}

.crash-demo__toast--win {
  background: rgba(0, 231, 1, 0.2);
  color: #00e701;
  border: 1px solid rgba(0, 231, 1, 0.4);
}

.crash-demo__footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 14px;
  border-top: 1px solid #2f4553;
  color: #64748b;
  font-size: 11px;
  flex-shrink: 0;
}

.crash-demo__wagered {
  color: #94a3b8;
}

@keyframes busted-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spark-burst {
  0% {
    opacity: 1;
    stroke-width: 2;
  }
  100% {
    opacity: 0;
    stroke-width: 0.4;
  }
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translate(-50%, 8px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 640px) {
  .crash-demo {
    grid-template-columns: 1fr;
    height: auto;
    max-height: none;
  }

  .crash-demo__side {
    border-right: none;
    border-bottom: 1px solid #2f4553;
  }

  .crash-demo__stage {
    height: 260px;
  }

  .crash-demo__main {
    grid-template-rows: auto 260px auto;
  }
}
</style>
