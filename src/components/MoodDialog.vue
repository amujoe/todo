<script setup>
import { nextTick, reactive, ref } from 'vue'
import { DEFAULT_MOOD, MOOD_COLORS } from '../store.js'
const emit = defineEmits(['save', 'toast'])
const visible = ref(false), input = ref(null)
const draft = reactive({ text: '', color: DEFAULT_MOOD })
const canPick = typeof window !== 'undefined' && 'EyeDropper' in window && window.isSecureContext
function open(mood) {
  draft.text = mood?.text || '今天不加班'
  draft.color = mood?.color || DEFAULT_MOOD
  visible.value = true
  nextTick(() => input.value?.focus())
}
function save() {
  emit('save', { text: draft.text.trim().slice(0, 60), color: draft.color })
  visible.value = false
}
async function pick() {
  try { draft.color = (await new EyeDropper().open()).sRGBHex }
  catch (err) { if (err.name !== 'AbortError') emit('toast', '吸色不可用，请使用自定义颜色') }
}
defineExpose({ open })
</script>

<template>
  <a-modal v-model:visible="visible" title="设置今天的心情" :mask-closable="false" :width="520" modal-class="time-modal">
    <a-form :model="draft" layout="vertical">
      <a-form-item field="text" label="心情文字"><a-input ref="input" v-model="draft.text" :max-length="60" placeholder="今天不加班" /></a-form-item>
      <a-form-item field="color" label="颜色">
        <div class="mood-color-control">
          <div class="swatches">
            <a-button v-for="swatch in MOOD_COLORS" :key="swatch" class="swatch" :class="{ selected: draft.color.toLowerCase() === swatch.toLowerCase() }" :style="{ '--swatch': swatch }" shape="circle" :aria-label="`选择颜色 ${swatch}`" :aria-pressed="draft.color.toLowerCase() === swatch.toLowerCase()" @click="draft.color = swatch" />
          </div>
          <div class="picker-row"><a-color-picker v-model="draft.color" :disabled-alpha="true" /><span>自定义颜色</span><a-button v-if="canPick" type="outline" size="small" @click="pick">从屏幕吸色</a-button></div>
          <p class="picker-hint">心情和颜色按日期保存。</p>
        </div>
      </a-form-item>
    </a-form>
    <template #footer><a-button @click="visible = false">取消</a-button><a-button type="primary" @click="save">保存</a-button></template>
  </a-modal>
</template>
