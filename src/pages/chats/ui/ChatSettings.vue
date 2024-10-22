<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'deleteChat'): void
}>()

</script>
<template>
  <div class="wrapper">
    <div>
      <button @click="emit('deleteChat')">Delete chat </button>
    </div>
  </div>
</template>
<style scoped></style>
