<script lang="ts" setup>
import PostCard from '../../shared/ui/ThePostCard.vue'
import { usePostsStore } from '@/stores/postsStore';
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';

interface Popup {
  id: number
  title: string
}

const store = usePostsStore();
const show: Ref<boolean> = ref(false);
const popupInfo = ref<Popup | null>(null);

const deletePost = (): void => {
  if (!popupInfo.value) return
  store.deletePost(popupInfo.value.id);
  closePopup();
};

const showPopupDelete = (id: number, title: string): void => {
  if (!popupInfo.value) return
  show.value = true;
  popupInfo.value = { id, title };
};

const closePopup = (): void => {
  show.value = false;
  popupInfo.value = null;
};

onMounted((): void => { store.getPosts() });

</script>
<template>
  <div class="posts">
    <PostCard @showPopupDelete="showPopupDelete" :post="post" v-for="post in store.posts" :key="post.id" />
    <Transition>
      <div @click.self="closePopup" v-if="show" class="overlay">
        <div class="wrapper-popup">
          <span>Delete</span>
          <h4 v-if="popupInfo" class="title-popup">{{ popupInfo.title }}</h4>
          <p>
            You are about to delete the post. Make sure this is exactly what you
            want to do.
          </p>
          <div class="buttons">
            <button class="btn-delete" @click="deletePost">Delete</button>
            <button class="btn-close" @click="closePopup">Close</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<style scoped>
.posts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding-inline: 10px;
  margin-top: 20px;
}

.title {
  color: var(--black);
}

@media (max-width: 1040px) {
  .posts {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 800px) {
  .posts {
    grid-template-columns: repeat(1, 1fr);
  }
}

.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
}

.wrapper-popup {
  background: var(--white);
  max-width: 400px;
  padding: 10px;
  border-radius: 10px;
}

.title-popup {
  font-weight: 500;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 20px;
}

.btn-delete {
  background: rgba(255, 0, 0, 0.596);
  padding: 5px 10px;
}

.btn-close {
  background: var(--c-3);
  padding: 5px 10px;
}

@keyframes gb-popup-scale-blur {
  0% {
    opacity: 0;
    transform-origin: 50% 50%;
    transform: scale(2, 2);
    filter: blur(90px);
  }

  100% {
    opacity: 1;
    transform-origin: 50% 50%;
    transform: scale(1, 1);
    filter: blur(0px);
  }
}

.v-enter-active {
  animation: gb-popup-scale-blur 0.3s both;
}

.v-leave-active {
  animation: gb-popup-scale-blur 0.3s reverse both;
}
</style>
