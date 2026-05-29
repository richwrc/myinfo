<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const betAmount = ref(10)
const target = ref(50)
const mode = ref('over')
const lastRoll = ref(null)
const rolling = ref(false)
const balance = ref(1000)

const multiplier = computed(() => {
  const chance = mode.value === 'over' ? (100 - target.value) / 100 : target.value / 100
  if (chance <= 0) return '0.00'
  return (0.99 / chance).toFixed(2)
})

const roll = () => {
  if (rolling.value || betAmount.value <= 0 || betAmount.value > balance.value) return
  rolling.value = true
  balance.value -= betAmount.value

  window.setTimeout(() => {
    const result = Math.floor(Math.random() * 100) + 1
    lastRoll.value = result
    const win =
      mode.value === 'over' ? result > target.value : result < target.value
    if (win) balance.value += betAmount.value * Number(multiplier.value)
    rolling.value = false
  }, 600)
}
</script>

<template>
  <div class="dice-demo">
    <div class="dice-demo__panel">
      <div class="dice-demo__result" :class="{ rolling }">
        <span class="dice-demo__dice" aria-hidden="true">🎲</span>
        <p class="dice-demo__roll-value">
          {{ lastRoll !== null ? lastRoll : '--' }}
        </p>
        <small>{{ t('diceGame.rollLabel') }}</small>
      </div>

      <div class="dice-demo__multiplier">
        <span>{{ t('diceGame.multiplier') }}</span>
        <strong>{{ multiplier }}x</strong>
      </div>

      <div class="dice-demo__mode">
        <button type="button" :class="{ active: mode === 'under' }" @click="mode = 'under'">
          {{ t('diceGame.under') }}
        </button>
        <button type="button" :class="{ active: mode === 'over' }" @click="mode = 'over'">
          {{ t('diceGame.over') }}
        </button>
      </div>

      <label class="dice-demo__slider-label">
        {{ t('diceGame.target') }}: <strong>{{ target }}</strong>
      </label>
      <input v-model.number="target" class="dice-demo__slider" type="range" min="2" max="98" />

      <div class="dice-demo__balance">
        {{ t('diceGame.balance') }}: <strong>{{ balance.toFixed(2) }}</strong>
      </div>

      <div class="dice-demo__bet-row">
        <label>
          {{ t('diceGame.betAmount') }}
          <input v-model.number="betAmount" type="number" min="1" :max="balance" />
        </label>
        <button type="button" class="dice-demo__roll-btn" :disabled="rolling" @click="roll">
          {{ rolling ? t('diceGame.rolling') : t('diceGame.bet') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dice-demo {
  margin-top: 12px;
  display: flex;
}

.dice-demo__panel {
  width: 100%;
  max-width: 320px;
  padding: 14px;
  border-radius: 12px;
  background: #1a2c38;
  color: #e2e8f0;
  border: 1px solid #2f4553;
}

.dice-demo__result {
  text-align: center;
  padding: 16px 10px;
  border-radius: 10px;
  background: #0f212e;
  margin-bottom: 12px;

  &.rolling .dice-demo__dice {
    animation: shake 0.6s ease;
  }
}

.dice-demo__dice {
  font-size: 2rem;
  display: block;
}

.dice-demo__roll-value {
  margin: 8px 0 2px;
  font-size: 2.4rem;
  font-weight: 800;
  color: #fff;
}

.dice-demo__result small {
  color: #94a3b8;
  font-size: 12px;
}

.dice-demo__multiplier {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 13px;
}

.dice-demo__multiplier strong {
  color: #22c55e;
  font-size: 1.2rem;
}

.dice-demo__mode {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.dice-demo__mode button {
  border: 1px solid #2f4553;
  background: #0f212e;
  color: #cbd5e1;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  font-weight: 600;
}

.dice-demo__mode button.active {
  background: #1475e1;
  border-color: #1475e1;
  color: #fff;
}

.dice-demo__slider-label {
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
}

.dice-demo__slider {
  width: 100%;
  margin-bottom: 12px;
  accent-color: #1475e1;
}

.dice-demo__balance {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 10px;
}

.dice-demo__bet-row {
  display: grid;
  gap: 10px;
}

.dice-demo__bet-row label {
  display: grid;
  gap: 4px;
  font-size: 13px;
}

.dice-demo__bet-row input {
  border: 1px solid #2f4553;
  border-radius: 8px;
  background: #0f212e;
  color: #fff;
  padding: 8px 10px;
}

.dice-demo__roll-btn {
  border: none;
  border-radius: 8px;
  background: #00e701;
  color: #0f212e;
  font-weight: 800;
  font-size: 15px;
  padding: 12px;
  cursor: pointer;
}

.dice-demo__roll-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-12deg);
  }
  75% {
    transform: rotate(12deg);
  }
}
</style>
