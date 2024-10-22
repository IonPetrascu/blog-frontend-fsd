<script lang="ts" setup>
import type { FiltersType } from '@/shared/types';
import { debounce } from '@/shared/utils/debounce'
import { reactive, watch } from 'vue';
import BaseIcon from './BaseIcon.vue';

const filters = reactive<FiltersType>({
  sortBy: 'new',
  searchQuery: ''
})
const delay: number = 1000

const emit = defineEmits<{
  (e: 'fetch', filters: FiltersType): void
}>()

const debouncedFetchPosts = debounce(() => emit('fetch', filters), delay);

const onChangeSelect = (e: Event): void => {
  filters.sortBy = (e.target as HTMLSelectElement).value
}

const clearSearchQuery = (): void => {
  filters.searchQuery = ''
}

watch(filters, () => debouncedFetchPosts(filters))
</script>
<template>
  <div class="header">
    <h2 class="title">
      {{ !filters.searchQuery ? 'All posts' : filters.searchQuery }}
    </h2>
    <div class="filtres">
      <select @change="onChangeSelect" class="select" name="" id="">
        <option value="new">New</option>
        <option value="old">Old</option>
      </select>
      <div class="input-wrap">
        <BaseIcon width="16px" height="16px" name="search" />
        <input v-model="filters.searchQuery" class="input" placeholder="Search...">
        <button v-if="filters.searchQuery.length > 0" @click="clearSearchQuery" class="clear">
          <BaseIcon width="16px" height="16px" name="close" />
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-block: 20px;
  padding-inline: 10px;
}

.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;

}

.filtres {
  display: flex;
  gap: 10px
}

.select {
  outline: none;
  border: 1px solid var(--c-4);
  border-radius: 5px;

}

.input-wrap {
  border: 1px solid var(--c-4);
  display: flex;
  align-items: center;
  padding-inline: 5px;
  border-radius: 5px;
}

.input {
  padding: 5px;
  outline: none;
  border: none;
}

.clear {
  width: 16px;
  height: 16px;
}
</style>
