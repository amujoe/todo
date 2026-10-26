<script setup>
import { dateLabel, dayDiff } from '../date.js'
import { STATUS_LABELS } from '../store.js'
const props = defineProps({ entry: { type: Object, required: true }, today: String })
const emit = defineEmits(['edit', 'toggle'])
</script>

<template>
  <div class="item" :class="{ note: entry.kind === 'note', done: entry.done }" :style="{ '--item-color': entry.color }">
    <a-button v-if="entry.kind === 'task'" class="check" :class="{ done: entry.done }" shape="circle" :aria-label="entry.done ? '改为进行中' : '标记为已完成'" @click="emit('toggle', entry)"><svg v-if="entry.done" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></a-button>
    <div class="item-body">
      <a-button class="item-title" type="text" @click="emit('edit', entry)">{{ entry.title }}</a-button>
      <a-tag v-if="entry.kind === 'task'" class="status-chip" :color="entry.done ? 'green' : 'blue'">{{ STATUS_LABELS[entry.status] || '未开始' }}</a-tag>
      <div v-if="entry.detail" class="item-detail">{{ entry.detail }}</div>
      <div class="item-date">{{ entry.start === entry.end ? (entry.start === today ? '今天' : dateLabel(entry.start)) : dateLabel(entry.start) + ' — ' + dateLabel(entry.end) }}</div>
    </div>
    <div v-if="entry.start !== entry.end" class="item-tag">跨 {{ dayDiff(entry.start, entry.end) + 1 }} 天</div>
  </div>
</template>
