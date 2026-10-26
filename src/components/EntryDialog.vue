<script setup>
import { nextTick, reactive, ref } from 'vue'
import { ENTRY_COLORS, STATUS_LABELS, newId } from '../store.js'
import { validDay } from '../date.js'
const emit = defineEmits(['save', 'delete'])
const dialog = ref(null), titleInput = ref(null), error = ref(''), editingId = ref(null)
const draft = reactive({ kind: 'task', title: '', detail: '', status: 'todo', start: '', end: '', color: ENTRY_COLORS[1] })
function open({ date, kind = 'task', entry = null }) {
  editingId.value = entry?.id || null
  draft.kind = entry?.kind || kind
  draft.title = entry?.title || ''
  draft.detail = entry?.detail || ''
  draft.status = entry?.status || 'todo'
  draft.start = entry?.start || date
  draft.end = entry?.end || date
  draft.color = entry?.color || (draft.kind === 'note' ? ENTRY_COLORS[2] : ENTRY_COLORS[1])
  error.value = ''
  dialog.value.showModal()
  nextTick(() => titleInput.value?.focus())
}
function close() { dialog.value.close() }
function changeKind(kind) { draft.kind = kind; if (!editingId.value) draft.color = kind === 'note' ? ENTRY_COLORS[2] : ENTRY_COLORS[1] }
function save() {
  const title = draft.title.trim()
  if (!title) { error.value = '请填写标题'; return }
  if (!validDay(draft.start) || !validDay(draft.end) || draft.end < draft.start) { error.value = '结束日期不能早于开始日期'; return }
  const status = draft.kind === 'task' && Object.hasOwn(STATUS_LABELS, draft.status) ? draft.status : null
  emit('save', { id: editingId.value || newId(), kind: draft.kind, title: title.slice(0, 100), detail: draft.detail.trim().slice(0, 1000), start: draft.start, end: draft.end, color: draft.color, status, done: status === 'done' }, !!editingId.value)
  close()
}
function remove() { if (editingId.value && confirm('确定删除这条事项吗？')) { emit('delete', editingId.value); close() } }
defineExpose({ open })
</script>

<template>
  <dialog ref="dialog"><form class="dialog-content" novalidate @submit.prevent="save">
    <div class="dialog-top"><h2>{{ editingId ? '编辑事项' : '新增事项' }}</h2><button class="icon-button" type="button" aria-label="关闭" @click="close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="type-row"><button v-for="choice in [{ kind: 'task', label: '任务' }, { kind: 'note', label: '标记' }]" :key="choice.kind" class="type-choice" :class="{ active: draft.kind === choice.kind }" type="button" @click="changeKind(choice.kind)">{{ choice.label }}</button></div>
    <div class="field"><label for="entryTitle">标题</label><input id="entryTitle" ref="titleInput" v-model="draft.title" maxlength="100" required placeholder="写下这件事"></div>
    <div class="field"><label for="entryDetail">详细内容（可选）</label><textarea id="entryDetail" v-model="draft.detail" maxlength="1000" placeholder="补充一点说明" /></div>
    <div v-if="draft.kind === 'task'" class="field"><label for="entryStatus">任务状态</label><select id="entryStatus" v-model="draft.status"><option v-for="(label, value) in STATUS_LABELS" :key="value" :value="value">{{ label }}</option></select></div>
    <div class="date-fields"><div class="field"><label for="entryStart">开始日期</label><input id="entryStart" v-model="draft.start" type="date" required @change="draft.end < draft.start && (draft.end = draft.start)"></div><div class="field"><label for="entryEnd">结束日期</label><input id="entryEnd" v-model="draft.end" type="date" required></div></div>
    <div class="field"><label>事项颜色</label><div class="form-swatches"><button v-for="swatch in ENTRY_COLORS" :key="swatch" class="swatch" :class="{ selected: draft.color === swatch }" :style="{ '--swatch': swatch }" type="button" :aria-label="`选择事项颜色 ${swatch}`" @click="draft.color = swatch" /></div></div>
    <div class="error" role="alert">{{ error }}</div>
    <div class="dialog-actions"><button v-if="editingId" class="danger" type="button" @click="remove">删除</button><button class="secondary" type="button" @click="close">取消</button><button class="primary" type="submit">保存</button></div>
  </form></dialog>
</template>
