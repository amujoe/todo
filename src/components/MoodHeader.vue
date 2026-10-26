<script setup>
import { computed } from 'vue'
import { formatDate } from '../date.js'
import { DEFAULT_MOOD } from '../store.js'

const props = defineProps({ today: String, mood: Object })
const emit = defineEmits(['settings'])
const current = computed(() => props.mood || { text: '今天不加班', color: DEFAULT_MOOD })
</script>

<template>
  <header class="mood-header" :style="{ '--mood': current.color }">
    <div class="mood-inner">
      <button class="settings-button" type="button" aria-label="设置今天的心情和颜色" title="设置心情和颜色" @click="emit('settings')">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.3 2.7h3.4l.5 2.1c.5.2 1 .4 1.5.7l1.9-1.1L20 6.8l-1.1 1.9c.3.5.5 1 .7 1.5l2.1.5v3.4l-2.1.5c-.2.5-.4 1-.7 1.5l1.1 1.9-2.4 2.4-1.9-1.1c-.5.3-1 .5-1.5.7l-.5 2.1h-3.4l-.5-2.1c-.5-.2-1-.4-1.5-.7l-1.9 1.1L4 17.2l1.1-1.9c-.3-.5-.5-1-.7-1.5L4 6.8l2.4-2.4 1.9 1.1c.5-.3 1-.5 1.5-.7l.5-2.1Z"/><circle cx="12" cy="12" r="3.1"/></svg>
      </button>
      <svg class="brand" viewBox="0 0 224 88" role="img" aria-label="Time">
        <path d="M3 16 C23 18 40 9 65 8 M34 14 C42 34 52 60 67 79 M81 38 C80 49 82 63 84 73 M102 72 C101 64 101 52 103 47 C107 39 116 40 120 49 C123 57 122 66 123 72 C125 60 129 45 136 44 C146 42 149 57 151 72 M162 54 C170 53 182 48 184 41 C187 34 180 29 174 33 C164 37 160 50 163 60 C166 70 175 73 188 72 C200 72 212 71 224 68"/>
        <circle cx="79" cy="22" r="3.8"/>
      </svg>
      <div class="mood-line"><button class="mood-text" type="button" title="点击设置心情" @click="emit('settings')">{{ current.text || '写一句今天的心情' }}</button></div>
      <time class="header-date" :datetime="today">{{ formatDate(today, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }) }}</time>
    </div>
  </header>
</template>
