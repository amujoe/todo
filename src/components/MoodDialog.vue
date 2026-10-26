<script setup>
import { nextTick, ref } from 'vue'
import { DEFAULT_MOOD, MOOD_COLORS } from '../store.js'
const emit = defineEmits(['save', 'toast'])
const dialog = ref(null), input = ref(null), text = ref(''), color = ref(DEFAULT_MOOD)
const canPick = typeof window !== 'undefined' && 'EyeDropper' in window && window.isSecureContext
function open(mood) { text.value = mood?.text || '今天不加班'; color.value = mood?.color || DEFAULT_MOOD; dialog.value.showModal(); nextTick(() => input.value?.focus()) }
function close() { dialog.value.close() }
function save() { emit('save', { text: text.value.trim().slice(0, 60), color: color.value }); close() }
async function pick() { try { color.value = (await new EyeDropper().open()).sRGBHex } catch (err) { if (err.name !== 'AbortError') emit('toast', '吸色不可用，请使用自定义颜色') } }
defineExpose({ open })
</script>

<template>
  <dialog ref="dialog"><form class="dialog-content" @submit.prevent="save">
    <div class="dialog-top"><h2>设置今天的心情</h2><button class="icon-button" type="button" aria-label="关闭" @click="close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="field"><label for="moodInput">心情文字</label><input id="moodInput" ref="input" v-model="text" maxlength="60" placeholder="今天不加班"></div>
    <div class="mood-color-field"><label>颜色</label><div class="swatches"><button v-for="swatch in MOOD_COLORS" :key="swatch" class="swatch" :class="{ selected: color.toLowerCase() === swatch.toLowerCase() }" :style="{ '--swatch': swatch }" type="button" :aria-label="`选择颜色 ${swatch}`" :aria-pressed="color.toLowerCase() === swatch.toLowerCase()" @click="color = swatch" /></div>
      <div class="picker-row"><input id="customMoodColor" v-model="color" type="color" aria-label="自定义颜色"><label for="customMoodColor">自定义颜色</label><button v-if="canPick" type="button" @click="pick">从屏幕吸色</button></div>
      <p class="picker-hint">心情和颜色按日期保存。</p>
    </div>
    <div class="dialog-actions"><button class="secondary" type="button" @click="close">取消</button><button class="primary" type="submit">保存</button></div>
  </form></dialog>
</template>
