<script lang="ts" setup>
import { debounce } from '@/shared/utils/debounce'
import BaseIcon from './BaseIcon.vue';
defineProps({
  filters: Object
})

const emit = defineEmits(['fetch', 'setFiltres'])
const delay: number = 1000

const debouncedSetFilters = debounce((value: string) => {
  emit('setFiltres', { searchQuery: value })
}, delay);

const onChangeSelect = (e: Event): void => {
  const value = (e.target as HTMLSelectElement).value;
  emit('setFiltres', { sortBy: value })
}

const onChangeQuery = (e: Event): void => {
  const value = (e.target as HTMLInputElement).value;
  debouncedSetFilters(value);
}

const clearSearchQuery = (): void => {
  emit('setFiltres', { searchQuery: '' })
}
</script>
<template>
  <div class="header">
    <h2 class="title">
      {{ !filters?.searchQuery ? 'All posts' : `Search ${filters?.searchQuery}` }}
    </h2>
    <div>
      Page {{ filters?.page }}
    </div>
    <div class="filtres">
      <select @change="onChangeSelect" class="select" name="" id="">
        <option value="new">New</option>
        <option value="old">Old</option>
      </select>
      <div class="input-wrap">
        <BaseIcon width="16px" height="16px" name="search" />
        <input @input="onChangeQuery" v-model="filters.searchQuery" class="input" placeholder="Search...">
        <button v-if="filters?.searchQuery.length > 0" @click="clearSearchQuery" class="clear">
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
