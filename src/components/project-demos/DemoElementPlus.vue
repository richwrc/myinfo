<script setup>
import { ref } from 'vue'

const copyHint = ref('')

const elementPlusSourceCode = `<!-- Example.vue -->
<template>
  <el-card shadow="never">
    <el-form :model="form" label-width="100px">
      <el-form-item label="帳號">
        <el-input v-model="form.account" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.role" placeholder="請選擇">
          <el-option label="Admin" value="admin" />
          <el-option label="Editor" value="editor" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">送出</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
`

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(elementPlusSourceCode)
    copyHint.value = '已複製到剪貼簿'
    setTimeout(() => (copyHint.value = ''), 2000)
  } catch {
    copyHint.value = '複製失敗'
  }
}
</script>

<template>
  <div class="ep-demo">
    <strong>Element Plus Demo Page</strong>
    <p>展示常見後台表單：Input、Select、Button 的基本組合（示意版）。</p>

    <div class="ep-demo__mock">
      <label>帳號</label>
      <input type="text" placeholder="請輸入帳號" />
      <label>角色</label>
      <select>
        <option>Admin</option>
        <option>Editor</option>
      </select>
      <div class="ep-demo__actions">
        <button class="primary">送出</button>
        <button>重置</button>
      </div>
    </div>

    <details class="ep-demo__code">
      <summary>查看 Element Plus 範例（可複製）</summary>
      <div class="ep-demo__toolbar">
        <button type="button" @click="copyCode">複製程式碼</button>
        <span v-if="copyHint">{{ copyHint }}</span>
      </div>
      <pre><code>{{ elementPlusSourceCode }}</code></pre>
    </details>
  </div>
</template>

<style scoped>
.ep-demo {
  margin-top: 12px;
}
.ep-demo strong {
  color: #4338ca;
}
.ep-demo p {
  margin: 6px 0 10px;
  font-size: 13px;
  color: #475569;
}
.ep-demo__mock {
  border: 1px solid #dbeafe;
  border-radius: 10px;
  padding: 10px;
  background: #f8fbff;
  display: grid;
  gap: 6px;
}
.ep-demo__mock label {
  font-size: 12px;
  color: #334155;
}
.ep-demo__mock input,
.ep-demo__mock select {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 13px;
}
.ep-demo__actions {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}
.ep-demo__actions button {
  border: 1px solid #cbd5e1;
  background: #fff;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
}
.ep-demo__actions .primary {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}
.ep-demo__code {
  margin-top: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  background: #f1f5f9;
}
.ep-demo__code summary {
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
}
.ep-demo__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px 8px;
}
.ep-demo__toolbar button {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  font-size: 12px;
  padding: 4px 10px;
  cursor: pointer;
}
.ep-demo__toolbar span {
  font-size: 12px;
  color: #16a34a;
}
.ep-demo pre {
  margin: 0;
  padding: 10px 12px;
  max-height: 220px;
  overflow: auto;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 12px;
}
</style>
