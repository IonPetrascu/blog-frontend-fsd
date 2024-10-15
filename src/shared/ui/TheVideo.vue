<script lang="ts" setup>
defineProps<{
  src: string,

}>()

</script>
<template>
  <video class="video" :src="src" controls>
    Video not found
  </video>
</template>
<style scoped>
.video {
  width: 50%;
  border-radius: 10px;
  margin-top: 50px;
}
</style>
