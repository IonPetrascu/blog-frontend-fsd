<script lang="ts" setup>
import BaseIcon from './BaseIcon.vue';

const props = defineProps({
  filters: Object,
  currentPage: Number,
  totalPages: Number
})

const emit = defineEmits(['setPage'])

const prevPage = () => {
  if (props?.filters?.page > 1) {
    emit('setPage', props.filters?.page - 1)
  }
};

const nextPage = () => {
  if (props?.filters?.page < props.totalPages) {
    emit('setPage', props.filters?.page + 1)
  }

};
</script>
<template>
  <div class="navigation">
    <button class="btn next" @click="prevPage" :disabled="filters.page === 1">
      <BaseIcon width="30px" height="30px" name="arrow" />
    </button>
    <button class="btn prev" @click="nextPage" :disabled="filters.page >= totalPages">
      <BaseIcon width="30px" height="30px" name="arrow" />
    </button>
  </div>
</template>
<style scoped>
.navigation {
  display: flex;
  height: 100px;
  align-items: center;
  justify-content: center;
  gap: 20px
}


.btn {
  background: var(--c-3);
  border-radius: 5px;
  width: 30px;
  height: 30px;
}

.btn.next {
  transform: rotate(-90deg);
}

.btn.prev {
  transform: rotate(90deg);
}


.btn:hover:not(:disabled) {
  scale: 1.05;
  background: var(--rose);
}

.btn:disabled {
  cursor: default;
  background: var(--gray);
  transform: scale(none);
}
</style>
