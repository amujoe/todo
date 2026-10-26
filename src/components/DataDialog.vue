<script setup>
import { ref } from 'vue'
import { normalize } from '../store.js'
const emit = defineEmits(['import', 'toast'])
const props = defineProps({ data: Object, today: String })
const dialog = ref(null), fileInput = ref(null)
function open() { dialog.value.showModal() }
function close() { dialog.value.close() }
function exportData() {
  const blob = new Blob([JSON.stringify(props.data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url; anchor.download = `time-backup-${props.today}.json`; anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  emit('toast', '备份已下载')
}
async function importData(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  try {
    const incoming = normalize(JSON.parse(await file.text()))
    if (!confirm('导入会替换当前浏览器中的所有 Time 数据，确定继续吗？')) return
    emit('import', incoming); close()
  } catch (err) { emit('toast', '导入失败：' + err.message) }
}
defineExpose({ open })
</script>

<template>
  <dialog ref="dialog"><div class="dialog-content">
    <div class="dialog-top"><h2>数据备份</h2><button class="icon-button" type="button" aria-label="关闭" @click="close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <p class="data-copy">任务和心情自动保存在当前浏览器。换电脑、换浏览器或清理浏览器数据前，请导出备份。</p>
    <div class="data-actions"><button type="button" @click="exportData">导出 JSON 备份<small>下载包含任务、标记和每日心情的文件</small></button><button type="button" @click="fileInput.click()">导入 JSON 备份<small>用备份文件恢复数据</small></button></div>
    <input ref="fileInput" type="file" accept="application/json,.json" hidden @change="importData">
  </div></dialog>
</template>
