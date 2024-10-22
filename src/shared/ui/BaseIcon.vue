<script lang="ts" setup>
import icons from '../utils/icons';

const props = defineProps<{
  name: string;
  width?: string;
  height?: string;
}>();


const width = props.width ?? '100%';
const height = props.height ?? '100%';

</script>

<template>
  <div :style="{ width, height }" v-html="icons[props.name]"></div>
</template>

<style scoped></style>
