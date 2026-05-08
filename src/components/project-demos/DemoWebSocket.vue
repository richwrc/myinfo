<script setup>
import { computed, onUnmounted, ref } from 'vue'

const wsUrl = ref('wss://ws.ifelse.io')
const outgoingMessage = ref('Hello WebSocket!')
const logs = ref(['系統初始化完成，請建立 WebSocket 連線。'])
const socket = ref(null)
const readyState = ref(WebSocket.CLOSED)

const stateLabel = computed(() => {
  switch (readyState.value) {
    case WebSocket.CONNECTING:
      return 'Connecting'
    case WebSocket.OPEN:
      return 'Connected'
    case WebSocket.CLOSING:
      return 'Closing'
    default:
      return 'Disconnected'
  }
})

const connected = computed(() => readyState.value === WebSocket.OPEN)

const pushLog = (message) => {
  logs.value.push(message)
  if (logs.value.length > 10) logs.value.shift()
}

const connect = () => {
  if (socket.value && (readyState.value === WebSocket.OPEN || readyState.value === WebSocket.CONNECTING)) return
  try {
    const ws = new WebSocket(wsUrl.value)
    socket.value = ws
    readyState.value = ws.readyState
    pushLog(`嘗試連線：${wsUrl.value}`)

    ws.onopen = () => {
      readyState.value = ws.readyState
      pushLog('連線成功，已進入 OPEN 狀態。')
    }

    ws.onmessage = (event) => {
      pushLog(`收到訊息：${String(event.data)}`)
    }

    ws.onerror = () => {
      pushLog('連線發生錯誤，請確認 WebSocket URL 是否可用。')
    }

    ws.onclose = (event) => {
      readyState.value = ws.readyState
      pushLog(`連線關閉（code: ${event.code}）`)
      socket.value = null
    }
  } catch (error) {
    pushLog(`建立連線失敗：${error instanceof Error ? error.message : '未知錯誤'}`)
  }
}

const sendMessage = () => {
  if (!socket.value || readyState.value !== WebSocket.OPEN) {
    pushLog('尚未連線，無法送出訊息。')
    return
  }
  const payload = outgoingMessage.value.trim()
  if (!payload) {
    pushLog('訊息為空，略過送出。')
    return
  }
  socket.value.send(payload)
  pushLog(`送出訊息：${payload}`)
}

const disconnect = () => {
  if (!socket.value) return
  pushLog('主動中斷連線。')
  socket.value.close(1000, 'Manual close')
}

onUnmounted(() => {
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    socket.value.close(1000, 'Component unmount')
  }
})
</script>

<template>
  <div class="ws-demo">
    <strong>Simple WebSocket Demo</strong>
    <p>真實 WebSocket 連線示範：可連線、送訊息、收訊息、斷線（預設使用公開）。</p>

    <div class="ws-demo__config">
      <label for="ws-url">WebSocket URL</label>
      <input id="ws-url" v-model="wsUrl" type="text" placeholder="wss://ws.ifelse.io" />
    </div>

    <div class="ws-demo__actions">
      <button type="button" @click="connect" :disabled="connected">建立連線</button>
      <button type="button" @click="disconnect" :disabled="!connected">中斷連線</button>
      <span :class="connected ? 'on' : 'off'">{{ stateLabel }}</span>
    </div>

    <div class="ws-demo__send">
      <input v-model="outgoingMessage" type="text" placeholder="輸入要送出的訊息" />
      <button type="button" @click="sendMessage" :disabled="!connected">送出</button>
    </div>

    <ul class="ws-demo__log">
      <li v-for="(line, idx) in logs" :key="idx">{{ line }}</li>
    </ul>

  </div>
</template>

<style scoped>
.ws-demo {
  margin-top: 12px;
}
.ws-demo strong {
  color: #4338ca;
}
.ws-demo p {
  margin: 6px 0 10px;
  font-size: 13px;
  color: #475569;
}
.ws-demo__config {
  display: grid;
  gap: 4px;
  margin-bottom: 8px;
}
.ws-demo__config label {
  font-size: 12px;
  color: #334155;
}
.ws-demo__config input {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  padding: 6px 8px;
  font-size: 12px;
}
.ws-demo__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.ws-demo__actions button {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
}
.ws-demo__actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ws-demo__actions .on {
  color: #166534;
  font-size: 12px;
  font-weight: 700;
}
.ws-demo__actions .off {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}
.ws-demo__send {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.ws-demo__send input {
  flex: 1;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  padding: 6px 8px;
  font-size: 12px;
}
.ws-demo__send button {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
}
.ws-demo__send button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ws-demo__log {
  margin: 0;
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  list-style: none;
  display: grid;
  gap: 6px;
}
.ws-demo__log li {
  font-size: 12px;
  color: #334155;
}
</style>
