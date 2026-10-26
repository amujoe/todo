<script setup>
import CalendarView from '../components/CalendarView.vue'
defineProps({ cursor: String, selectedDay: String, today: String, entries: Array })
const emit = defineEmits(['move', 'reset', 'select', 'add', 'edit', 'toggle'])
</script>
<template><CalendarView mode="month" :cursor="cursor" :selected-day="selectedDay" :today="today" :entries="entries" @move="emit('move', $event)" @reset="emit('reset')" @select="emit('select', $event)" @add="emit('add', $event)" @edit="emit('edit', $event)" @toggle="emit('toggle', $event)" /></template>
