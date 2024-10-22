<script lang="ts" setup>
import type { PostSimilar } from '@/shared/types';
import { computed } from 'vue'
import { transformToLocalTime } from '@/shared/utils/dateUtils';

const props = defineProps<{
  post: PostSimilar
}>();
const datePost = computed<string>(() => transformToLocalTime(props.post.created_at));
</script>
<template>
  <div class="post">
    <div class="post-img-wrapper">
      <img v-if="post.img" class="post-img kenburns-bottom-left"
        :src="`http://localhost:3000/upload/images/${post.img}`" :alt="post.title" />
      <img class="post-img" v-else src="@/assets/images/default-post-image.png" alt="default-post-image" />
    </div>
    <div>
      <router-link class="post-title" :to="`/post/${post.id}`">
        {{ post.title }}
      </router-link>
      <ul v-if="post.tags?.length > 0" class="post-tags">
        <li v-for="tag in post.tags.slice(0, 3)" :key="tag">
          <span class="post-tag">#{{ tag }}</span>
        </li>
        <li v-if="post.tags?.length > 3" class="post-tag">other...</li>
      </ul>
      <time class="post-date"> {{ datePost }}</time>
      <p class="description">{{ post.content }}</p>
    </div>
  </div>
</template>
<style scoped>
.post {
  display: flex;
  width: 100%;
  gap: 10px;
}

.post-title {
  font-weight: 500;
}

.post-tags {
  list-style-type: none;
  display: flex;
  gap: 10px;
}

.post-tags {
  color: blue;
}

.post-img {
  width: 150px;
}

.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  max-height: 3em;
}
</style>
