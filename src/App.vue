<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { addDays, localKey, shiftMonth } from './date.js'
import { createStore, DEFAULT_MOOD } from './store.js'
import MoodHeader from './components/MoodHeader.vue'
import ViewNav from './components/ViewNav.vue'
import MoodDialog from './components/MoodDialog.vue'
import EntryDialog from './components/EntryDialog.vue'
import DataDialog from './components/DataDialog.vue'
import TodayView from './views/TodayView.vue'
import WeekView from './views/WeekView.vue'
import MonthView from './views/MonthView.vue'

const today = ref(localKey(new Date()))
const view = ref('today'), cursor = ref(today.value), selectedDay = ref(today.value)
const moodDialog = ref(null), entryDialog = ref(null), dataDialog = ref(null)
function toast(message) {
  if (message.includes('失败') || message.includes('无法')) Message.error(message)
  else Message.success(message)
}
const { state, persist, replace } = createStore(toast)
const mood = computed(() => state.moods[today.value] || { text: '今天不加班', color: DEFAULT_MOOD })

function changeView(next) { view.value = next; cursor.value = today.value; selectedDay.value = today.value }
function movePeriod(n) { cursor.value = view.value === 'week' ? addDays(cursor.value, 7 * n) : shiftMonth(cursor.value, n); selectedDay.value = cursor.value }
function resetPeriod() { cursor.value = today.value; selectedDay.value = today.value }
function openEntry({ date = today.value, kind = 'task', entry = null } = {}) { entryDialog.value.open({ date, kind, entry }) }
function editEntry(entry) { openEntry({ date: entry.start, kind: entry.kind, entry }) }
function saveEntry(entry, isEdit) {
  if (isEdit) { const index = state.entries.findIndex(e => e.id === entry.id); if (index !== -1) state.entries[index] = entry }
  else state.entries.push(entry)
  persist(); toast(isEdit ? '已更新' : '已添加')
}
function deleteEntry(id) { state.entries = state.entries.filter(e => e.id !== id); persist(); toast('已删除') }
function toggleEntry(entry) { entry.status = entry.done ? 'doing' : 'done'; entry.done = entry.status === 'done'; persist() }
function saveMood(patch) { state.moods[today.value] = { ...mood.value, ...patch }; persist() }
function importData(incoming) { replace(incoming); toast('备份已导入') }
function checkDate() {
  if (document.visibilityState !== 'visible') return
  const now = localKey(new Date())
  if (now !== today.value) { today.value = now; cursor.value = now; selectedDay.value = now }
}
onMounted(() => document.addEventListener('visibilitychange', checkDate))
onUnmounted(() => document.removeEventListener('visibilitychange', checkDate))
</script>

<template>
  <MoodHeader :today="today" :mood="mood" @settings="moodDialog.open(mood)" />
  <ViewNav :view="view" @change="changeView" @data="dataDialog.open()" />
  <main>
    <TodayView v-if="view === 'today'" :entries="state.entries" :today="today" @add="openEntry" @edit="editEntry" @toggle="toggleEntry" />
    <WeekView v-else-if="view === 'week'" :entries="state.entries" :today="today" :cursor="cursor" :selected-day="selectedDay" @move="movePeriod" @reset="resetPeriod" @select="selectedDay = $event" @add="openEntry" @edit="editEntry" @toggle="toggleEntry" />
    <MonthView v-else :entries="state.entries" :today="today" :cursor="cursor" :selected-day="selectedDay" @move="movePeriod" @reset="resetPeriod" @select="selectedDay = $event" @add="openEntry" @edit="editEntry" @toggle="toggleEntry" />
    <div class="footer">Time · 让时间变得清楚一点</div>
  </main>
  <a-button v-if="view !== 'today'" class="fab" type="primary" shape="circle" aria-label="新增事项" @click="openEntry({ date: selectedDay })"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></a-button>
  <MoodDialog ref="moodDialog" @save="saveMood" @toast="toast" />
  <EntryDialog ref="entryDialog" @save="saveEntry" @delete="deleteEntry" />
  <DataDialog ref="dataDialog" :data="state" :today="today" @import="importData" @toast="toast" />
</template>
