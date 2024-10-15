<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { usePostsStore } from "@/stores/postsStore";
import { useUsersStore } from "@/stores/userStore";
import { VMarkdownView } from "vue3-markdown";
import TheComment from "@/shared/ui/TheComment.vue";
import type { PostFull, Mode, Comment, VoteComment, RespondType } from "@/shared/types";
import type { Ref } from "vue";
import "vue3-markdown/dist/style.css";

const route = useRoute();
const router = useRouter();
const store = usePostsStore();
const userStore = useUsersStore();
const id: number = +route.params.id;
const commentInput: Ref<HTMLInputElement | null> = ref(null);
const respondCommentName: Ref<string | null> = ref(null);
const respondCommentId: Ref<number | null> = ref(null);
const post: Ref<PostFull | null> = ref(null);
const comments: Ref<Comment[]> = ref([]);
const newComment: Ref<string> = ref("");
const commentsKey: Ref<number> = ref(0);
const mode: Ref<Mode> = ref('light');

const loadingPost: Ref<boolean> = ref(false)
const loadingComment: Ref<boolean> = ref(false)

onMounted(async (): Promise<void> => {
  try {
    loadingPost.value = true
    loadingComment.value == true

    post.value = await store.getSinglePost(id);
    comments.value = await store.getComments(id);

    loadingPost.value = false
    loadingComment.value == false
  } catch (error) {
    loadingPost.value = false
    loadingComment.value == false
    console.error(error)
  }
});

watch(
  comments,
  () => {
    commentsKey.value += 1;
  },
  { deep: true }
);

const submitComment = async () => {
  if (!newComment.value.trim()) return;
  try {
    await store.addComment(id, newComment.value, respondCommentId.value);
    comments.value = await store.getComments(id);
  } catch (error) {
    console.error("Error submitting comment:", error);
  } finally {
    respondCommentId.value = null;
    newComment.value = "";
  }

};

const setRespondComment = (data: RespondType) => {
  respondCommentId.value = data.id;
  respondCommentName.value = data.userName;

  if (commentInput.value !== null) {
    commentInput.value.focus();
  }
};

const removeRespondComment = (): void => {
  respondCommentId.value = null;
  respondCommentName.value = null;
};

const addVoteToComment = async ({
  is_like,
  target_id,
  entity_type,
  user_vote,
}: VoteComment): Promise<void> => {
  try {
    if (user_vote === null) {
      await store.addVote(target_id, entity_type, is_like);
    } else {
      if (is_like === user_vote) {
        return await store.deleteVote(target_id, entity_type);
      } else {
        return await store.addVote(target_id, entity_type, is_like);
      }
    }
  } catch (error) {
    console.error("Error processing vote:", error);
  }
};

const clearInput = (): void => { newComment.value = "" }
const goBack = (): void => router.go(-1);

</script>
<template>
  <div v-if="post !== null && !loadingPost" class="post">
    <div>
      <button @click="goBack" class="btn-back">
        <img src="@/assets/images/back.png" alt="back" />
        <span>Back</span>
      </button>
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="img-wrapper">
        <div v-if="post.img" class="post-img bg-pan-bl"
          :style="{ backgroundImage: `url(http://localhost:3000/upload/images/${post.img})` }">
        </div>
        <div class="post-info">
          <router-link :to="`/profile/${post.u_id}`" class="author-wrapper">
            <img v-if="post.u_img" class="post-author-img" :src="`http://localhost:3000/upload/images/${post.u_img}`"
              :alt="post.u_name" /><span class="post-info-author">Author: {{ post.u_name }}</span>
          </router-link>

          <span v-if="post.created_at !== undefined" class="post-info-date">{{
            post.created_at.slice(0, 10)
          }}</span>
        </div>
      </div>
      <VMarkdownView v-if="post?.content" class="description" :mode="mode" :content="post.content"></VMarkdownView>
    </div>
    <form class="form-comment" @submit.prevent="submitComment">
      <router-link :to="`/profile/${userStore.user.id}`">
        <img v-if="userStore.user.img" class="user-img"
          :src="`http://localhost:3000/upload/images/${userStore.user.img}`" :alt="userStore.user.u_name" />
        <img v-else class="user-img" src="@/assets/images/default-user-img.jpg" :alt="post.u_name" />
      </router-link>

      <div class="form-body">
        <div class="input-wrapper">
          <div v-if="respondCommentId !== null" class="response-info">
            <button type="button" class="btn-clear" @click="removeRespondComment">
              <img src="@/assets/icons/close.svg" alt="close" />
            </button>
            {{ respondCommentName }}
          </div>
          <input ref="commentInput" v-model="newComment" type="text" placeholder="Your comment" class="comment-input" />
        </div>
        <div class="btns-wrapper">
          <button v-if="newComment.length > 0" @click="clearInput" type="button" class="btn">
            Cancel
          </button>
          <button type="submit" class="btn" :disabled="!newComment.trim()">Send</button>
        </div>
      </div>
    </form>
    <ul v-if="!loadingComment" :key="commentsKey" class="post-comments">
      <TheComment v-for="comment in comments" :key="comment.id" :comment="comment"
        :setRespondComment="setRespondComment" :addVoteToComment="addVoteToComment" />
    </ul>
    <div v-else>Loading comments...</div>
  </div>
  <div v-else>LOADING...</div>
</template>
<style scoped>
.post {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 20px;
}

.img-wrapper {
  position: relative;
  min-height: 40px;
  overflow: hidden;
}

.post-comments {
  max-width: 800px;
}

.post-title {
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--c-4);
}

.post-description {
  font-size: 1em;
  color: var(--gray);
  margin-bottom: 20px;
  line-height: 1.5;
}

.post-meta {
  margin-top: 20px;
  font-size: 14px;
  color: #777;
}

.post-img {
  width: 100%;
  height: 400px;
  background-size: cover;
}

.post-info {
  display: flex;
  width: 100%;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  padding: 10px 5px;
}

.post-info-date {
  background: var(--white);
  padding: 5px;
  border-radius: 4px;
}

.form-comment {
  display: flex;
  gap: 10px;
  max-width: 800px;
  padding-block: 10px;
}

.user-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.input-wrapper {
  display: flex;
  align-items: center;
}

.form-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btns-wrapper {
  display: flex;
  justify-content: end;
  gap: 20px;
}

.comment-input {
  flex-grow: 1;
  padding: 10px;
  border-radius: 5px;
  border: none;
  border-bottom: 1px solid var(--c-4);
}

.comment-input:focus {
  outline: 1px solid var(--c-4);
}

.btn {
  padding: 5px 10px;
  font-size: 1em;
  border-radius: 10px;
  transform: all 0.4s ease;
}

.btn[type="submit"] {
  background: var(--c-4);
}

.btn[type="button"] {
  background: var(--gray);
}

.btn:hover {
  outline: 1px solid var(--orange);
}

.description {
  margin-block: 20px;
}

.post-author-img {
  width: 30px;
  aspect-ratio: 1/1;
}

.author-wrapper {
  display: flex;
  align-items: center;
  padding-right: 5px;
  background: var(--white);
  gap: 10px;
}

.response-info {
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  background: var(--c-1);
  margin-right: 10px;
}

.btn-clear img {
  width: 20px;
  margin-right: 10px;
}

.btn-back {
  position: sticky;
  display: flex;
  align-items: center;
  background: var(--c-4);
  border-radius: 10px;
  padding: 5px;
  width: 100px;
  z-index: 1;
  top: 40px;
}

.btn-back img {
  width: 25px;
}

.btn-back span {
  margin-left: 10px;
}

.bg-pan-bl {
  animation: bg-pan-bl 10s cubic-bezier(0.5, 0, 0.5, 1) both;
}

@keyframes bg-pan-bl {
  0% {
    background-position: 100% 0%;
  }

  50% {
    background-position: 50% 50%;
  }

  75% {
    background-position: 0% 100%;
  }

  100% {
    background-position: 50% 50%;
  }
}
</style>
