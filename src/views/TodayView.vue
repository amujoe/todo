<script setup>
import { computed } from 'vue'
import { activeOn, eventSort } from '../date.js'
import EntryCard from '../components/EntryCard.vue'
const props = defineProps({ entries: Array, today: String })
const emit = defineEmits(['add', 'edit', 'toggle'])
const current = computed(() => props.entries.filter(e => activeOn(e, props.today)).sort(eventSort))
const tasks = computed(() => current.value.filter(e => e.kind === 'task'))
const notes = computed(() => current.value.filter(e => e.kind === 'note'))
</script>

<template>
  <div class="page-head"><div><h1>今天</h1><div class="subline">把注意力留给今天。</div></div></div>
  <template v-for="section in [{ title: '任务', kind: 'task', items: tasks }, { title: '标记', kind: 'note', items: notes }]" :key="section.kind">
    <h2 class="section-title">{{ section.title }}<span class="count">{{ section.items.length }}</span><a-button class="section-add" type="outline" size="small" @click="emit('add', { date: today, kind: section.kind })"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>新增{{ section.title }}</a-button></h2>
    <div class="list">
      <div v-if="!section.items.length" class="empty">今天还没有{{ section.title }}。</div>
      <EntryCard v-for="entry in section.items" :key="entry.id" :entry="entry" :today="today" @edit="emit('edit', $event)" @toggle="emit('toggle', $event)" />
    </div>
  </template>
</template>
