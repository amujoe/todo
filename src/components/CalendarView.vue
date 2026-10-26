<script setup>
import { computed } from 'vue'
import { activeOn, addDays, dateLabel, dayDiff, eventSort, formatDate, monthStart, shiftMonth, weekStart } from '../date.js'
import CalendarRow from './CalendarRow.vue'
import EntryCard from './EntryCard.vue'
const props = defineProps({ mode: String, cursor: String, selectedDay: String, today: String, entries: Array })
const emit = defineEmits(['move', 'reset', 'select', 'add', 'edit', 'toggle'])
const isWeek = computed(() => props.mode === 'week')
const first = computed(() => isWeek.value ? weekStart(props.cursor) : weekStart(monthStart(props.cursor)))
const end = computed(() => isWeek.value ? addDays(first.value, 6) : addDays(shiftMonth(monthStart(props.cursor), 1), -1))
const days = computed(() => isWeek.value ? 7 : Math.ceil((dayDiff(first.value, end.value) + 1) / 7) * 7)
const rows = computed(() => Array.from({ length: days.value / 7 }, (_, i) => addDays(first.value, i * 7)))
const title = computed(() => isWeek.value ? `${formatDate(first.value, { month: 'numeric', day: 'numeric' })} — ${formatDate(addDays(first.value, 6), { month: 'numeric', day: 'numeric' })}` : formatDate(props.cursor, { year: 'numeric', month: 'long' }))
const selectedEntries = computed(() => props.entries.filter(e => activeOn(e, props.selectedDay)).sort(eventSort))
</script>

<template>
  <div class="page-head period">
    <div><div class="eyebrow">{{ isWeek ? '本周视图' : '本月视图' }}</div><h1>{{ title }}</h1><div class="subline">跨天事项连成一条；点击日期可查看和添加。</div></div>
    <div class="period-tools">
      <button class="arrow" type="button" aria-label="上一段时间" @click="emit('move', -1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6L9 12L15 18"/></svg></button>
      <button class="arrow" type="button" aria-label="下一段时间" @click="emit('move', 1)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6L15 12L9 18"/></svg></button>
      <button class="now-btn" type="button" @click="emit('reset')">回到今天</button>
    </div>
  </div>
  <div class="weekday-row" :class="{ 'week-head': isWeek }">
    <template v-if="isWeek">
      <button v-for="(name, i) in ['一', '二', '三', '四', '五', '六', '日']" :key="i" class="week-day" :class="{ today: addDays(first, i) === today, selected: addDays(first, i) === selectedDay }" type="button" @click="emit('select', addDays(first, i))"><span class="week-day-name">周{{ name }}</span><span class="week-day-date">{{ dateLabel(addDays(first, i)) }}</span></button>
    </template>
    <div v-for="name in ['一', '二', '三', '四', '五', '六', '日']" v-else :key="name">{{ name }}</div>
  </div>
  <div class="calendar" :class="{ 'week-calendar': isWeek }">
    <CalendarRow v-for="row in rows" :key="row" :start="row" :cursor="cursor" :today="today" :selected-day="selectedDay" :month-mode="!isWeek" :entries="entries" @select="emit('select', $event)" @edit="emit('edit', $event)" />
  </div>
  <p class="legend">较长的事项排在上方，单日事项排在下方。</p>
  <div class="selected-day">
    <h2>{{ formatDate(selectedDay, { month: 'long', day: 'numeric', weekday: 'long' }) }}</h2>
    <div class="list">
      <EntryCard v-for="entry in selectedEntries" :key="entry.id" :entry="entry" :today="today" @edit="emit('edit', $event)" @toggle="emit('toggle', $event)" />
      <div v-if="!selectedEntries.length" class="empty">这一天没有事项。<button type="button" @click="emit('add', { date: selectedDay, kind: 'task' })">新增事项</button></div>
    </div>
  </div>
</template>
