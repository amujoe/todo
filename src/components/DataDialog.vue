<script setup>
import { ref } from 'vue'
import { Modal } from '@arco-design/web-vue'
import { normalize } from '../store.js'
const emit = defineEmits(['import', 'toast'])
const props = defineProps({ data: Object, today: String })
const visible = ref(false), fileInput = ref(null)
function open() { visible.value = true }
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
    Modal.confirm({ title: '导入备份', content: '导入会替换当前浏览器中的所有 Time 数据，确定继续吗？', okText: '导入并替换', cancelText: '取消', onOk: () => { emit('import', incoming); visible.value = false } })
  } catch (err) { emit('toast', '导入失败：' + err.message) }
}
defineExpose({ open })
</script>

<template>
  <a-modal v-model:visible="visible" title="数据备份" :width="520" modal-class="time-modal" :footer="false">
    <p class="data-copy">任务和心情自动保存在当前浏览器。换电脑、换浏览器或清理浏览器数据前，请导出备份。</p>
    <div class="data-actions">
      <a-button class="data-action" type="outline" long @click="exportData"><span>导出 JSON 备份<small>下载包含任务、标记和每日心情的文件</small></span></a-button>
      <a-button class="data-action" type="outline" long @click="fileInput.click()"><span>导入 JSON 备份<small>用备份文件恢复数据</small></span></a-button>
    </div>
    <input ref="fileInput" type="file" accept="application/json,.json" hidden @change="importData">
  </a-modal>
</template>
