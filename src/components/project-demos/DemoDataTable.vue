<script setup>
import { computed, ref, watch } from 'vue'

const PAGE_SIZE = 6
const query = ref('')
const statusFilter = ref('all')
const sortBy = ref('updatedAt')
const sortDir = ref('desc')
const currentPage = ref(1)

const tableRows = ref([
  { id: 'M-2026-001', league: '城市業餘足球聯賽', matchName: '青川聯合 vs 南港閃電', status: 'running', updatedAt: '2026-05-04 15:30', odds: 1.82 },
  { id: 'M-2026-002', league: '週末盃邀請賽', matchName: '松山競技 vs 大安遊騎兵', status: 'pending', updatedAt: '2026-05-05 19:00', odds: 2.04 },
  { id: 'M-2026-003', league: '春季友誼賽', matchName: '汐止海風 vs 木柵聯盟', status: 'closed', updatedAt: '2026-05-06 14:00', odds: 1.66 },
  { id: 'M-2026-004', league: '企業公益盃', matchName: '內湖創新 FC vs 信義先鋒', status: 'running', updatedAt: '2026-05-07 16:45', odds: 1.95 },
  { id: 'M-2026-005', league: '城市業餘足球聯賽', matchName: '南港閃電 vs 松山競技', status: 'pending', updatedAt: '2026-05-08 20:10', odds: 2.25 },
  { id: 'M-2026-006', league: '春季友誼賽', matchName: '大安遊騎兵 vs 汐止海風', status: 'closed', updatedAt: '2026-05-09 13:20', odds: 1.73 },
  { id: 'M-2026-007', league: '企業公益盃', matchName: '信義先鋒 vs 木柵聯盟', status: 'running', updatedAt: '2026-05-10 18:40', odds: 1.91 },
  { id: 'M-2026-008', league: '週末盃邀請賽', matchName: '青川聯合 vs 內湖創新 FC', status: 'pending', updatedAt: '2026-05-11 17:25', odds: 2.12 },
  { id: 'M-2026-009', league: '春季友誼賽', matchName: '木柵聯盟 vs 南港閃電', status: 'closed', updatedAt: '2026-05-12 15:00', odds: 1.58 },
  { id: 'M-2026-010', league: '城市業餘足球聯賽', matchName: '松山競技 vs 信義先鋒', status: 'running', updatedAt: '2026-05-13 21:30', odds: 1.99 },
])

const statusMap = {
  pending: '待開賽',
  running: '進行中',
  closed: '已結束',
}

const statusClass = (status) => `is-${status}`

const filteredRows = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  return tableRows.value.filter((row) => {
    const inStatus = statusFilter.value === 'all' || row.status === statusFilter.value
    const inKeyword =
      !keyword ||
      row.id.toLowerCase().includes(keyword) ||
      row.league.toLowerCase().includes(keyword) ||
      row.matchName.toLowerCase().includes(keyword)
    return inStatus && inKeyword
  })
})

const sortedRows = computed(() => {
  const rows = [...filteredRows.value]
  rows.sort((a, b) => {
    const aValue = a[sortBy.value]
    const bValue = b[sortBy.value]
    if (aValue === bValue) return 0
    const result = aValue > bValue ? 1 : -1
    return sortDir.value === 'asc' ? result : -result
  })
  return rows
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / PAGE_SIZE)))
const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return sortedRows.value.slice(start, start + PAGE_SIZE)
})

watch([query, statusFilter, sortBy, sortDir], () => {
  currentPage.value = 1
})

watch(totalPages, (maxPage) => {
  if (currentPage.value > maxPage) currentPage.value = maxPage
})

const setSort = (field) => {
  if (sortBy.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    return
  }
  sortBy.value = field
  sortDir.value = 'asc'
}

const prevPage = () => {
  currentPage.value = Math.max(1, currentPage.value - 1)
}

const nextPage = () => {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1)
}
</script>

<template>
  <section class="table-demo">
    <p class="table-demo__hint">範例：支援篩選、排序、分頁與欄位狀態顯示的資料表。</p>

    <div class="table-demo__toolbar">
      <input v-model="query" class="table-demo__input" type="text" placeholder="搜尋編號 / 聯賽 / 對戰組合" />
      <select v-model="statusFilter" class="table-demo__select">
        <option value="all">全部狀態</option>
        <option value="pending">待開賽</option>
        <option value="running">進行中</option>
        <option value="closed">已結束</option>
      </select>
    </div>

    <div class="table-demo__wrap">
      <table class="table-demo__table">
        <thead>
          <tr>
            <th @click="setSort('id')">場次編號</th>
            <th @click="setSort('league')">聯賽</th>
            <th @click="setSort('matchName')">對戰組合</th>
            <th @click="setSort('status')">狀態</th>
            <th @click="setSort('odds')">賠率</th>
            <th @click="setSort('updatedAt')">更新時間</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in pagedRows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.league }}</td>
            <td>{{ row.matchName }}</td>
            <td>
              <span class="status-pill" :class="statusClass(row.status)">{{ statusMap[row.status] }}</span>
            </td>
            <td>{{ row.odds.toFixed(2) }}</td>
            <td>{{ row.updatedAt }}</td>
          </tr>
          <tr v-if="pagedRows.length === 0">
            <td colspan="6" class="table-demo__empty">查無資料</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-demo__pagination">
      <button type="button" @click="prevPage" :disabled="currentPage === 1">上一頁</button>
      <span>第 {{ currentPage }} / {{ totalPages }} 頁（共 {{ sortedRows.length }} 筆）</span>
      <button type="button" @click="nextPage" :disabled="currentPage === totalPages">下一頁</button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.table-demo {
  margin-top: 0.65rem;

  &__hint {
    margin: 0 0 0.75rem;
    font-size: 0.82rem;
    color: #64748b;
  }

  &__toolbar {
    display: flex;
    gap: 0.6rem;
    margin-bottom: 0.7rem;
    flex-wrap: wrap;
  }

  &__input,
  &__select {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 0.5rem 0.65rem;
    font-size: 0.86rem;
    background: #fff;
    color: #1f2937;
  }

  &__input {
    min-width: 220px;
    flex: 1;
  }

  &__wrap {
    overflow-x: auto;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #fff;
  }

  &__table {
    width: 100%;
    min-width: 760px;
    border-collapse: collapse;
    font-size: 0.84rem;

    th,
    td {
      padding: 0.62rem 0.7rem;
      border-bottom: 1px solid #edf2f7;
      text-align: left;
    }

    th {
      background: #f8fafc;
      color: #334155;
      cursor: pointer;
      user-select: none;
      font-weight: 700;
      white-space: nowrap;
    }

    tbody tr:hover {
      background: #f8fbff;
    }
  }

  &__empty {
    text-align: center !important;
    color: #94a3b8;
    padding: 1rem !important;
  }

  &__pagination {
    margin-top: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.55rem;
    flex-wrap: wrap;
    color: #475569;
    font-size: 0.82rem;

    button {
      border: 1px solid #cbd5e1;
      background: #fff;
      border-radius: 7px;
      padding: 0.3rem 0.65rem;
      font-size: 0.8rem;
      cursor: pointer;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}

.status-pill {
  display: inline-block;
  border-radius: 999px;
  padding: 0.16rem 0.52rem;
  font-size: 0.75rem;
  font-weight: 700;

  &.is-pending {
    background: #fef3c7;
    color: #92400e;
  }

  &.is-running {
    background: #dcfce7;
    color: #166534;
  }

  &.is-closed {
    background: #e2e8f0;
    color: #334155;
  }
}
</style>
