<script setup>
defineProps({ view: String })
const emit = defineEmits(['change', 'data'])
</script>

<template>
  <div class="nav-shell"><div class="nav-inner">
    <nav class="nav" aria-label="时间视图">
      <button v-for="tab in [{ id: 'today', text: '今天' }, { id: 'week', text: '本周' }, { id: 'month', text: '本月' }]" :key="tab.id" class="tab" :class="{ active: view === tab.id }" :aria-current="view === tab.id ? 'page' : undefined" type="button" @click="emit('change', tab.id)">{{ tab.text }}</button>
    </nav>
    <button class="data-button" type="button" @click="emit('data')">数据备份</button>
  </div></div>
</template>
