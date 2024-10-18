<script lang="ts" setup>
import { usePostsStore } from '@/stores/postsStore';
import { computed, ref } from 'vue';
import { transformToLocalTime } from '@/shared/utils/dateUtils';
import { useUsersStore } from '@/stores/userStore';
import ThePopup from './ThePopup.vue';
import type { PopupType, PostCard } from '../types';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router';



const props = defineProps<{
  post: PostCard;
}>();

const router = useRouter();
const store = usePostsStore()
const usersStore = useUsersStore()
const popupInfo: Ref<PopupType | null> = ref(null);
const show: Ref<boolean> = ref(false);

const datePost = computed<string>(() => transformToLocalTime(props.post.created_at));
const handleVote = (vote: boolean): void => { store.addVoteToPost(vote, props.post.id, "post") }

const deletePost = (): void => {
  if (!popupInfo.value) return
  store.deletePost(popupInfo.value.id, props.post.img, props.post.video);
  closePopup();
};

const showPopupDelete = (id: number, title: string): void => {
  show.value = true;
  popupInfo.value = { id, title };
};

const closePopup = (): void => {
  show.value = false;
  popupInfo.value = null;
};

const editPost = (): void => {
  const { id, content, title, img, video, tags } = props.post
  const query = {
    id,
    content,
    title,
    img,
    video,
    tags
  }
  router.push({ name: 'post-write', query });
};
</script>
<template>
  <div class="post">
    <button @click="() => showPopupDelete(post.id, post.title)" v-if="post.user_id === usersStore.user?.id"
      class="delete-post-btn">
      <img src="@/assets/icons/close-icon.svg" alt="delete post" />
    </button>
    <button v-if="post.user_id === usersStore.user?.id" @click="editPost" class="edit-post-btn">
      <img class="edit-img" src="../../assets/icons/edit.svg" alt="">
    </button>
    <div class="post-img-wrapper">
      <img v-if="post.img" class="post-img kenburns-bottom-left"
        :src="`http://localhost:3000/upload/images/${post.img}`" :alt="post.title" />
      <img class="post-img" v-else src="@/assets/images/default-post-image.png" alt="default-post-image" />
    </div>
    <div class="post-content">
      <div v-if="post.tags?.length > 0" class="post-tags">
        <li v-for="tag in post.tags.slice(0, 3)" :key="tag">
          <span class="post-tag">#{{ tag }}</span>
        </li>
        <li v-if="post.tags?.length > 3" class="post-tag">other...</li>
      </div>


      <router-link class="post-title" :to="`/post/${post.id}`">
        {{ post.title }}
      </router-link>

      <div class="post-bottom">
        <div class="post-info">
          <img v-if="post.user_img" class="post-author-img"
            :src="`http://localhost:3000/upload/images/${post.user_img}`" :alt="post.user_name" />
          <img v-else class="post-author-img" src="@/assets/images/default-user-img.jpg" :alt="post.user_name" />
          <router-link :to="`/profile/${post.user_id}`" class="post-name">{{
            post.user_name
            }}</router-link>

          <time class="post-date"> {{ datePost }}</time>
        </div>
        <div class="likes-and-comment">
          <div class="likes-btns">
            <button @click="handleVote(true)" class="like-btn">
              <span>{{ post.likes_count }}</span>
              <img v-if="post.user_vote === null || post.user_vote === 0" src="@/assets/icons/like.svg" alt="like" />
              <img v-else src="@/assets/icons/like-active.svg" alt="" />
            </button>
            <button @click="handleVote(false)" class="dislike-btn">
              <span>{{ post.dislikes_count }}</span>

              <img v-if="post.user_vote === null || post.user_vote === 1" class="dislike-img"
                src="@/assets/icons/like.svg" alt="" />
              <img class="dislike-img" v-else src="@/assets/icons/like-active.svg" alt="" />
            </button>
          </div>
          <div>
            <RouterLink :to="`/post/${post.id}`">
              <button class="comment-btn">
                <span>{{ post.comments_count }}</span>
                <img class="comment-img" src="@/assets/icons/comment-icon.svg" alt="" />
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <ThePopup @close-popup="closePopup" @action-of-popup="deletePost" :show="show" :title="popupInfo?.title ?? ''" />
  </div>
</template>
<style scoped>
.post {
  padding: 5px;
  background: var(--white);
  border: 2px solid var(--c-3);
  border-radius: 12px;
  position: relative;
  max-height: 495px;
}

.post-title {
  font-weight: 600;
  font-size: 24px;
  line-height: 117%;
  color: var(--black);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-title:hover {
  color: var(--rose);
}

.post-name,
.post-date {
  font-size: 16px;
  line-height: 150%;
  color: #97989f;
}

.post-date {
  font-weight: 400;
  margin-left: auto;
}

.post-name {
  font-weight: 500;
}

.post-img {
  width: 100%;
  height: 100%;
  object-fit: cover;

  transition: scale 0.4s ease;
}

.post-img:hover {
  scale: 1.1;
}

.post-img-wrapper {
  overflow: hidden;
  border-radius: 12px;
  height: 240px;
}

.post-tag {
  border-radius: 6px;
  padding: 4px 10px;
  width: 97px;
  height: 28px;
  font-weight: 500;
  font-size: 14px;
  line-height: 143%;
  color: #4b6bfb;
}

.post-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 15px;
}

.post-tags {
  display: flex;
  list-style-type: none;
  align-items: center;
  flex-wrap: wrap;
}

.post-bottom {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.post-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.post-author-img {
  width: 25px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  object-fit: cover;
}

.comment-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

.comment-img {
  width: 25px;
  height: 25px;
}

.likes-and-comment {
  display: flex;
  gap: 20px;
}

.likes-btns {
  display: flex;
  align-items: center;
  gap: 20px;
}

.likes-btns button {
  display: flex;
  gap: 5px;
  align-items: center;
}

.likes-btns img {
  width: 25px;
  height: 25px;
  opacity: 0.5;
}

.delete-post-btn {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 5px;
  top: 5px;
  border: 2px solid var(--c-4);
  border-radius: 50%;
  overflow: hidden;
  transition: scale 0.4s ease;
  z-index: 1;
}

.edit-post-btn {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 40px;
  top: 5px;
  border: 2px solid var(--c-4);
  border-radius: 50%;
  overflow: hidden;
  transition: scale 0.4s ease;
  z-index: 1;
  padding: 5px;
  background-color: var(--white);

}

.edit-post-btn img {
  width: 100%;
}

.edit-post-btn:hover {
  scale: 1.1;
}

.delete-post-btn img {
  width: 100%;
}

.delete-post-btn:hover {
  scale: 1.1;
}

.dislike-img {
  transform: rotate(180deg);
}

.kenburns-bottom-left {
  animation: kenburns-bottom-left 7s ease-out both infinite alternate;
}

@keyframes kenburns-bottom-left {
  0% {
    transform: scale(1) translate(0, 0);
    transform-origin: 16% 84%;
  }

  100% {
    transform: scale(1.25) translate(-20px, 15px);
    transform-origin: left bottom;
  }
}
</style>
