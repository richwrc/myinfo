<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'

const PAGE_SIZE = 6
const TOTAL_FAKE = 42

/** 可複製：以 JS 做「滑到底再載入」的寫法（Vue 3 + IntersectionObserver） */
const infiniteScrollSourceCode = `// 概念：可視區底部 sentinel 進入畫面 → 再請求／slice 下一批資料 append
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const PAGE_SIZE = 20
const allRows = ref([])        // 假設已由 API 拿到完整列表，或只存 cursor + API
const displayed = ref([])
let cursor = 0
const loading = ref(false)
const finished = ref(false)

const scrollRoot = ref(null)
const sentinel = ref(null)
let observer = null

async function loadNextBatch() {
  if (loading.value || finished.value) return
  loading.value = true
  // 實務上這裡換成 await fetchPage(cursor) 等
  await new Promise((r) => setTimeout(r, 200))
  const chunk = allRows.value.slice(cursor, cursor + PAGE_SIZE)
  displayed.value.push(...chunk)
  cursor += chunk.length
  if (cursor >= allRows.value.length) finished.value = true
  loading.value = false
}

onMounted(async () => {
  allRows.value = await fetchAllOrMock() // 實務：await API；此處可換成假資料陣列
  await loadNextBatch()
  await nextTick()
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) loadNextBatch()
    },
    { root: scrollRoot.value, rootMargin: '120px', threshold: 0 }
  )
  observer.observe(sentinel.value)
})

onUnmounted(() => observer?.disconnect())
`

const copyHint = ref('')

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(infiniteScrollSourceCode)
    copyHint.value = '已複製到剪貼簿'
    setTimeout(() => {
      copyHint.value = ''
    }, 2000)
  } catch {
    copyHint.value = '複製失敗，請手動選取文字'
  }
}

const leagues = ['城市業餘足球聯賽', '週末盃邀請賽', '春季友誼賽', '企業公益盃']
const teamPool = [
  ['青川聯合', '青'],
  ['南港閃電', '南'],
  ['松山競技', '松'],
  ['大安遊騎兵', '大'],
  ['汐止海風', '汐'],
  ['木柵聯盟', '木'],
  ['內湖創新 FC', '內'],
  ['信義先鋒', '信'],
]

function buildFakeRows(count) {
  const rows = []
  for (let i = 0; i < count; i++) {
    const [aName, aAbbr] = teamPool[i % teamPool.length]
    const [bName, bAbbr] = teamPool[(i + 3) % teamPool.length]
    const day = String((i % 28) + 1).padStart(2, '0')
    const hour = 10 + (i % 8)
    rows.push({
      id: `m-${i}`,
      league: `${leagues[i % leagues.length]} · 第 ${i + 1} 場`,
      time: `05-${day} ${String(hour).padStart(2, '0')}:30`,
      teams: [
        { name: aName, abbr: aAbbr },
        { name: bName, abbr: bAbbr },
      ],
      tall: i % 4 === 0,
    })
  }
  return rows
}

const allMatches = ref([])
const displayed = ref([])
const cursor = ref(0)
const loading = ref(false)
const finished = ref(false)

const scrollRootRef = ref(null)
const sentinelRef = ref(null)
let observer = null

const shownCount = computed(() => displayed.value.length)

function loadNextBatch() {
  if (loading.value || finished.value) return
  loading.value = true
  window.setTimeout(() => {
    const next = allMatches.value.slice(cursor.value, cursor.value + PAGE_SIZE)
    displayed.value.push(...next)
    cursor.value += next.length
    if (cursor.value >= allMatches.value.length) {
      finished.value = true
    }
    loading.value = false
  }, 320)
}

onMounted(async () => {
  allMatches.value = buildFakeRows(TOTAL_FAKE)
  loadNextBatch()
  await nextTick()
  const root = scrollRootRef.value
  const target = sentinelRef.value
  if (!root || !target) return
  observer = new IntersectionObserver(
    (entries) => {
      const hit = entries.some((e) => e.isIntersecting)
      if (hit) loadNextBatch()
    },
    { root, rootMargin: '100px 0px', threshold: 0 },
  )
  observer.observe(target)
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div class="match-demo">
    <p class="match-demo__hint">
      範例：資料量多時，在<strong>此區塊內</strong>往下滑，接近底部會再載入下一批賽事（Intersection Observer + 分批
      append）。
    </p>

    <div ref="scrollRootRef" class="match-demo__scroll" tabindex="0" role="region" aria-label="賽事列表（可捲動載入更多）">
      <article v-for="m in displayed" :key="m.id" class="match-card" role="listitem">
        <header class="match-card__head">
          <div class="match-card__league">
            <span class="match-card__league-mark" aria-hidden="true" />
            <span class="match-card__league-name">{{ m.league }}</span>
          </div>
          <span class="match-card__ball" aria-hidden="true">⚽</span>
        </header>
        <div class="match-card__body">
          <div class="match-card__meta">
            <button type="button" class="match-card__fav" aria-label="收藏">☆</button>
            <time class="match-card__time">{{ m.time }}</time>
            <span class="match-card__pulse" title="即時數據">▮▮▮</span>
          </div>
          <ul class="match-card__teams">
            <li v-for="(t, ti) in m.teams" :key="ti" class="match-card__team">
              <span class="match-card__crest">{{ t.abbr }}</span>
              <span class="match-card__team-name">{{ t.name }}</span>
            </li>
          </ul>
          <p v-if="m.tall" class="match-card__extra">範例加高：戰績／讓球／文字摘要區（讓每張卡高度略不同）。</p>
        </div>
      </article>

      <div ref="sentinelRef" class="match-demo__sentinel" aria-hidden="true" />

      <p v-if="loading" class="match-demo__status">載入下一批…</p>
      <p v-else-if="finished && displayed.length" class="match-demo__status match-demo__status--done">
        已載入全部 {{ shownCount }} 筆（範例上限 {{ TOTAL_FAKE }}）
      </p>
    </div>

    <details class="match-demo__code-panel">
      <summary class="match-demo__code-summary">查看「滑到底再載入」JS 範例（可複製）</summary>
      <div class="match-demo__code-toolbar">
        <button type="button" class="match-demo__copy-btn" @click="copyCode">複製程式碼</button>
        <span v-if="copyHint" class="match-demo__copy-hint">{{ copyHint }}</span>
      </div>
      <pre class="match-demo__pre"><code>{{ infiniteScrollSourceCode }}</code></pre>
    </details>
  </div>
</template>

<style scoped lang="scss">
.match-demo {
  margin-top: 0.65rem;

  &__hint {
    margin: 0 0 0.75rem;
    font-size: 0.82rem;
    color: #64748b;
    line-height: 1.5;
  }

  &__scroll {
    max-height: 380px;
    overflow-y: auto;
    padding-right: 4px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: #f1f5f9;
    padding: 0.5rem;
    outline: none;

    &:focus-visible {
      box-shadow: 0 0 0 2px #fff, 0 0 0 4px #6366f1;
    }
  }

  &__sentinel {
    height: 1px;
    margin-top: -1px;
    pointer-events: none;
  }

  &__status {
    text-align: center;
    font-size: 0.8rem;
    color: #64748b;
    padding: 0.5rem 0 0.25rem;

    &--done {
      color: #059669;
    }
  }

  &__code-panel {
    margin-top: 1rem;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    overflow: hidden;
  }

  &__code-summary {
    cursor: pointer;
    padding: 0.65rem 0.85rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #334155;
    list-style: none;
    user-select: none;

    &::-webkit-details-marker {
      display: none;
    }

    &::before {
      content: '▸ ';
      color: #64748b;
    }
  }

  &__code-panel[open] &__code-summary::before {
    content: '▾ ';
  }

  &__code-toolbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 0.85rem 0.5rem;
  }

  &__copy-btn {
    border: 1px solid #cbd5e1;
    background: #fff;
    color: #475569;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.35rem 0.65rem;
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.15s ease, color 0.15s ease;

    &:hover {
      border-color: #94a3b8;
      color: #1e293b;
    }
  }

  &__copy-hint {
    font-size: 0.75rem;
    color: #059669;
  }

  &__pre {
    margin: 0;
    padding: 0.75rem 0.85rem 0.85rem;
    max-height: 280px;
    overflow: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.72rem;
    line-height: 1.45;
    color: #e2e8f0;
    background: #0f172a;
    border-top: 1px solid #e2e8f0;

    code {
      font-family: inherit;
      white-space: pre;
    }
  }
}

.match-card {
  margin-bottom: 0.65rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(251, 191, 36, 0.25);
  background: linear-gradient(160deg, #1c1917 0%, #292524 55%, #1c1917 100%);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);

  &:last-of-type {
    margin-bottom: 0.35rem;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.55rem 0.75rem;
    background: linear-gradient(90deg, rgba(180, 83, 9, 0.35), rgba(67, 20, 7, 0.6)),
      radial-gradient(circle at 80% 30%, rgba(251, 191, 36, 0.15), transparent 55%);
    border-bottom: 1px solid rgba(245, 158, 11, 0.2);
  }

  &__league {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    min-width: 0;
  }

  &__league-mark {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: conic-gradient(#fbbf24, #f59e0b, #ea580c, #fbbf24);
    box-shadow: 0 0 0 2px rgba(28, 25, 23, 0.6);
  }

  &__league-name {
    font-size: 0.78rem;
    font-weight: 600;
    color: #fffbeb;
    line-height: 1.35;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__ball {
    font-size: 1.35rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
    opacity: 0.95;
  }

  &__body {
    padding: 0.65rem 0.75rem 0.75rem;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.55rem;
  }

  &__fav {
    border: none;
    background: transparent;
    color: #94a3b8;
    font-size: 1rem;
    cursor: default;
    padding: 0;
    line-height: 1;
  }

  &__time {
    flex: 1;
    font-size: 0.8rem;
    color: #e2e8f0;
    letter-spacing: 0.02em;
  }

  &__pulse {
    font-size: 0.65rem;
    letter-spacing: 1px;
    color: #22d3ee;
    line-height: 1;
    opacity: 0.9;
  }

  &__teams {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  &__team {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__crest {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 0.72rem;
    font-weight: 800;
    color: #0f172a;
    background: linear-gradient(145deg, #fef3c7, #fcd34d);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  &__team-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: #f8fafc;
  }

  &__extra {
    margin: 0.6rem 0 0;
    padding-top: 0.55rem;
    border-top: 1px dashed rgba(148, 163, 184, 0.35);
    font-size: 0.72rem;
    line-height: 1.45;
    color: #94a3b8;
  }
}
</style>
