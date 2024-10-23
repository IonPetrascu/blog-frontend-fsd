<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'deleteChat'): void
}>()

</script>
<template>
  <div class="wrapper">
    <button class="delete-chat" @click="emit('deleteChat')">Delete chat </button>
  </div>
</template>
<style scoped>
.wrapper {
  padding: 10px;
}

.delete-chat {
  background: var(--c-3);
  padding: 10px;
  border-radius: 10px;
}
</style>
