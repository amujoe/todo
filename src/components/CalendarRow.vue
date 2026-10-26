<script setup>
import { computed } from 'vue'
import { addDays, dayDiff, eventSort, formatDate, parseDay } from '../date.js'
const props = defineProps({ start: String, cursor: String, today: String, selectedDay: String, monthMode: Boolean, entries: Array })
const emit = defineEmits(['select', 'edit'])
const end = computed(() => addDays(props.start, 6))
const visible = computed(() => props.entries.filter(e => e.start <= end.value && e.end >= props.start).sort(eventSort))
const rowHeight = computed(() => Math.max(props.monthMode ? 112 : 88, (props.monthMode ? 56 : 29) + visible.value.length * 28) + 'px')
function barStyle(entry, lane) {
  const first = entry.start < props.start ? props.start : entry.start
  const last = entry.end > end.value ? end.value : entry.end
  const rgb = entry.color.slice(1).match(/../g).map(x => parseInt(x, 16))
  return {
    left: `calc(${dayDiff(props.start, first) / 7 * 100}% + 3px)`,
    width: `calc(${(dayDiff(first, last) + 1) / 7 * 100}% - 6px)`,
    top: `${(props.monthMode ? 43 : 15) + lane * 28}px`,
    '--bar': entry.color,
    color: (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 < 148 ? '#fff' : '#171b1a'
  }
}
</script>

<template>
  <div class="cal-row" :style="{ '--row-height': rowHeight }">
    <a-button v-for="i in 7" :key="i" class="day" :class="{ outside: monthMode && addDays(start, i - 1).slice(0, 7) !== cursor.slice(0, 7), today: addDays(start, i - 1) === today, selected: addDays(start, i - 1) === selectedDay }" :aria-label="formatDate(addDays(start, i - 1), { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })" @click="emit('select', addDays(start, i - 1))">
      <span v-if="monthMode" class="day-number">{{ parseDay(addDays(start, i - 1)).getDate() }}</span>
    </a-button>
    <a-button v-for="(entry, lane) in visible" :key="entry.id" class="bar" :style="barStyle(entry, lane)" :title="`${entry.title} · ${entry.start} — ${entry.end}`" @click="emit('edit', entry)">{{ entry.start < start ? '← ' : '' }}{{ entry.done ? '✓ ' : '' }}{{ entry.title }}{{ entry.end > end ? ' →' : '' }}</a-button>
  </div>
</template>
