<script setup>
import { nextTick, reactive, ref } from 'vue'
import { Modal } from '@arco-design/web-vue'
import { ENTRY_COLORS, STATUS_LABELS, newId } from '../store.js'
import { validDay } from '../date.js'
const emit = defineEmits(['save', 'delete'])
const visible = ref(false), titleInput = ref(null), error = ref(''), editingId = ref(null)
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
  visible.value = true
  nextTick(() => titleInput.value?.focus())
}
function changeKind(kind) { draft.kind = kind; if (!editingId.value) draft.color = kind === 'note' ? ENTRY_COLORS[2] : ENTRY_COLORS[1] }
function save() {
  const title = draft.title.trim()
  if (!title) { error.value = '请填写标题'; return }
  if (!validDay(draft.start) || !validDay(draft.end) || draft.end < draft.start) { error.value = '结束日期不能早于开始日期'; return }
  const status = draft.kind === 'task' && Object.hasOwn(STATUS_LABELS, draft.status) ? draft.status : null
  emit('save', { id: editingId.value || newId(), kind: draft.kind, title: title.slice(0, 100), detail: draft.detail.trim().slice(0, 1000), start: draft.start, end: draft.end, color: draft.color, status, done: status === 'done' }, !!editingId.value)
  visible.value = false
}
function remove() {
  if (!editingId.value) return
  Modal.confirm({ title: '删除事项', content: '确定删除这条事项吗？', okText: '删除', cancelText: '取消', okButtonProps: { status: 'danger' }, onOk: () => { emit('delete', editingId.value); visible.value = false } })
}
defineExpose({ open })
</script>

<template>
  <a-modal v-model:visible="visible" :title="editingId ? '编辑事项' : '新增事项'" :mask-closable="false" :width="560" modal-class="time-modal">
    <a-form :model="draft" layout="vertical">
      <a-form-item label="类型"><a-radio-group v-model="draft.kind" type="button" @change="changeKind"><a-radio value="task">任务</a-radio><a-radio value="note">标记</a-radio></a-radio-group></a-form-item>
      <a-form-item field="title" label="标题" required><a-input ref="titleInput" v-model="draft.title" :max-length="100" placeholder="写下这件事" /></a-form-item>
      <a-form-item field="detail" label="详细内容（可选）"><a-textarea v-model="draft.detail" :max-length="1000" :auto-size="{ minRows: 3, maxRows: 6 }" placeholder="补充一点说明" /></a-form-item>
      <a-form-item v-if="draft.kind === 'task'" field="status" label="任务状态"><a-select v-model="draft.status"><a-option v-for="(label, value) in STATUS_LABELS" :key="value" :value="value">{{ label }}</a-option></a-select></a-form-item>
      <div class="date-fields"><a-form-item field="start" label="开始日期" required><a-date-picker v-model="draft.start" format="YYYY-MM-DD" value-format="YYYY-MM-DD" @change="draft.end < draft.start && (draft.end = draft.start)" /></a-form-item><a-form-item field="end" label="结束日期" required><a-date-picker v-model="draft.end" format="YYYY-MM-DD" value-format="YYYY-MM-DD" /></a-form-item></div>
      <a-form-item label="事项颜色"><div class="form-swatches"><a-button v-for="swatch in ENTRY_COLORS" :key="swatch" class="swatch" :class="{ selected: draft.color === swatch }" :style="{ '--swatch': swatch }" shape="circle" :aria-label="`选择事项颜色 ${swatch}`" @click="draft.color = swatch" /></div></a-form-item>
      <a-alert v-if="error" type="error">{{ error }}</a-alert>
    </a-form>
    <template #footer><a-button v-if="editingId" status="danger" class="delete-action" @click="remove">删除</a-button><a-button @click="visible = false">取消</a-button><a-button type="primary" @click="save">保存</a-button></template>
  </a-modal>
</template>
