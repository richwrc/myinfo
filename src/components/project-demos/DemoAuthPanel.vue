<script setup>
import { ref } from 'vue'

const copyHint = ref('')

/** 展示用：Vue Router beforeEach 權限控管 */
const routeGuardSourceCode = `// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/stores/user'

const routes = [
  {
    path: '/',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/admin',
    component: () => import('@/views/AdminView.vue'),
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/403',
    component: () => import('@/views/ForbiddenView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 🔥 全域路由守衛
router.beforeEach((to, from, next) => {
  const user = store.user

  // 未登入
  if (to.meta.requiresAuth && !user) {
    return next('/login')
  }

  // 權限不足
  if (to.meta.role && user.role !== to.meta.role) {
    return next('/403')
  }

  next()
})

export default router
`

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(routeGuardSourceCode)
    copyHint.value = '已複製到剪貼簿'
    setTimeout(() => (copyHint.value = ''), 2000)
  } catch {
    copyHint.value = '複製失敗'
  }
}
</script>

<template>
  <div class="guard-demo">
    <div class="guard-demo__box">
      <strong>Route Guard - Authentication & Authorization</strong>
      <p>
        使用 Vue Router 的 beforeEach 實作全域路由守衛，在頁面切換前檢查登入狀態與角色權限，
        未授權時導向登入頁或顯示錯誤頁面。
      </p>
    </div>

    <details class="guard-demo__code-panel">
      <summary class="guard-demo__summary">
        查看「beforeEach 權限控管」完整範例（可複製）
      </summary>

      <div class="guard-demo__toolbar">
        <button class="guard-demo__btn" @click="copyCode">
          複製程式碼
        </button>
        <span v-if="copyHint" class="guard-demo__hint">
          {{ copyHint }}
        </span>
      </div>

      <pre class="guard-demo__pre">
<code>{{ routeGuardSourceCode }}</code>
      </pre>
    </details>
  </div>
</template>

<style scoped>
.guard-demo {
  margin-top: 12px;
}

.guard-demo__box {
  border: 1px dashed #94a3b8;
  background: #f8fafc;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
}

.guard-demo__box strong {
  display: block;
  color: #4338ca;
  margin-bottom: 4px;
}

.guard-demo__box p {
  font-size: 13px;
  color: #475569;
}

/* code panel */
.guard-demo__code-panel {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  background: #f1f5f9;
}

.guard-demo__summary {
  padding: 10px 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  color: #334155;
}

.guard-demo__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px 8px;
}

.guard-demo__btn {
  font-size: 12px;
  padding: 4px 10px;
  border: 1px solid #cbd5f5;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.guard-demo__btn:hover {
  border-color: #6366f1;
}

.guard-demo__hint {
  font-size: 12px;
  color: #16a34a;
}

.guard-demo__pre {
  margin: 0;
  padding: 12px;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 12px;
  overflow: auto;
  max-height: 300px;
  font-family: monospace;
}
</style>