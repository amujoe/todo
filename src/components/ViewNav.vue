<script setup>
defineProps({ view: String })
const emit = defineEmits(['change', 'data'])
</script>

<template>
  <div class="nav-shell"><div class="nav-inner">
    <nav class="nav arco-nav" aria-label="时间视图">
      <a-tabs :active-key="view" type="capsule" @change="emit('change', $event)">
        <a-tab-pane key="today" title="今天" />
        <a-tab-pane key="week" title="本周" />
        <a-tab-pane key="month" title="本月" />
      </a-tabs>
    </nav>
    <a-button class="data-button" type="text" @click="emit('data')">数据备份</a-button>
  </div></div>
</template>
