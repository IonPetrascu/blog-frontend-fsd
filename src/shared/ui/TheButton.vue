<template>
  <button :class="['button', type]" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps<{
  type?: 'primary' | 'secondary';
}>();

</script>

<style scoped>
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.button.primary {
  background-color: #3498db;
  color: white;
}

.button.secondary {
  background-color: #e7e7e7;
  color: black;
}
</style>
