<script setup>
import { dateLabel, dayDiff } from '../date.js'
import { STATUS_LABELS } from '../store.js'
const props = defineProps({ entry: { type: Object, required: true }, today: String })
const emit = defineEmits(['edit', 'toggle'])
</script>

<template>
  <div class="item" :class="{ note: entry.kind === 'note', done: entry.done }" :style="{ '--item-color': entry.color }">
    <button v-if="entry.kind === 'task'" class="check" :class="{ done: entry.done }" type="button" :aria-label="entry.done ? '改为进行中' : '标记为已完成'" @click="emit('toggle', entry)"><svg v-if="entry.done" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></button>
    <div class="item-body">
      <button class="item-title" type="button" @click="emit('edit', entry)">{{ entry.title }}</button>
      <span v-if="entry.kind === 'task'" class="status-chip">{{ STATUS_LABELS[entry.status] || '未开始' }}</span>
      <div v-if="entry.detail" class="item-detail">{{ entry.detail }}</div>
      <div class="item-date">{{ entry.start === entry.end ? (entry.start === today ? '今天' : dateLabel(entry.start)) : dateLabel(entry.start) + ' — ' + dateLabel(entry.end) }}</div>
    </div>
    <div v-if="entry.start !== entry.end" class="item-tag">跨 {{ dayDiff(entry.start, entry.end) + 1 }} 天</div>
  </div>
</template>
