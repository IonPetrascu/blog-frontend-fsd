<script lang="ts" setup>
import { defineProps, ref } from "vue";
import TheComment from "./TheComment.vue";
import { usePostsStore } from "@/stores/postsStore";
import type { Comment, RespondType, VoteComment } from '../types'
import type { Ref } from "vue";

const props = defineProps<{
  comment: Comment;
  userId?: number;
  userName?: string;
  setRespondComment: (data: RespondType) => void;
  addVoteToComment: (voteData: VoteComment) => void;
}>()

const store = usePostsStore();

const localComment: Ref<Comment> = ref({ ...props.comment });

const handleRespond = () => {
  props.setRespondComment({
    id: localComment.value.id,
    userName: localComment.value.u_name
  })
};


const incrementVote = (is_like: boolean): void => {
  if (is_like) {
    localComment.value.like_count += 1;
  } else {
    localComment.value.dislike_count += 1;
  }
};

const decrementVote = (is_like: boolean): void => {
  if (is_like) {
    localComment.value.like_count -= 1;
  } else {
    localComment.value.dislike_count -= 1;
  }
};

const handleVote = async (is_like: boolean): Promise<void> => {
  const { user_vote, id } = localComment.value;

  if (user_vote === null) {
    incrementVote(is_like);
    localComment.value.user_vote = is_like;
  } else if (user_vote === true && !is_like) {
    decrementVote(true);
    incrementVote(false);
    localComment.value.user_vote = false;
  } else if (user_vote === false && is_like) {
    decrementVote(false);
    incrementVote(true);
    localComment.value.user_vote = true;
  } else {
    decrementVote(is_like);
    localComment.value.user_vote = null;
  }

  try {
    if (user_vote === null) {
      await store.addVote(id, "comment", is_like);
    } else {
      if (is_like === user_vote) {
        await store.deleteVote(id, "comment");
      } else {
        await store.addVote(id, "comment", is_like);
      }
    }
  } catch (error) {
    console.error('Error on vote', error);
  }
};
</script>

<template>
  <div class="wrapper-comment">
    <div class="comment">
      <div class="header-comment">
        <div class="comment-author-info">
          <img v-if="localComment.u_img" class="comment-img" :src="`http://localhost:3000/${localComment.u_img}`"
            alt="" />
          <img v-else class="comment-img" src="@/assets/images/default-user-img.jpg" alt="default user img" />
          <router-link :to="`/profile/${localComment.user_id}`">{{
            localComment.u_name
          }}</router-link>
          <span class="date">{{ localComment.created_at.slice(0, 10) }}</span>
        </div>

        <div class="body-comment">
          <span class="respond-to-person">{{ userName }}</span>
          <p class="comment-text">{{ localComment.content }}</p>
        </div>
      </div>
      <div class="foter-comment">
        <button class="btn-vote" :class="{ active: localComment.user_vote }" @click="() => handleVote(true)">
          <img class="like-img" src="@/assets/icons/like.svg" alt="like" />
          <span> {{ localComment.like_count }}</span>
        </button>
        <button class="btn-vote" :class="{ active: localComment.user_vote === false }" @click="() => handleVote(false)">
          <img class="dislike-img" src="@/assets/icons/like.svg" alt="dislike" />
          <span>{{ localComment.dislike_count }}</span>
        </button>
        <button class="respond-btn" @click="handleRespond">Respond</button>
      </div>
    </div>
    <div class="replie" v-if="localComment.replies.length > 0">
      <TheComment v-for="reply in localComment.replies" :key="reply.id" :comment="reply" :userId="localComment.user_id"
        :setRespondComment="setRespondComment" :userName="localComment.u_name" :addVoteToComment="addVoteToComment" />
    </div>
  </div>
</template>

<style scoped>
.wrapper-comment {
  border-radius: 8px;
}

.comment {
  border: 1px solid var(--black);
  padding: 5px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 10px;
}

.comment-author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.comment-img {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}

.header-comment {
  display: flex;
  flex-direction: column;
  gap: 5px;
  gap: 4px;
  word-wrap: break-word;
}

.body-comment {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}

.foter-comment {
  display: flex;
  gap: 10px;
}

.respond-btn :hover {
  color: var(--orange);
}

.btn-vote {
  background: transparent;
  display: flex;
  align-items: center;
  gap: 3px;
}

.btn-vote span {
  font-size: 14px;
}

.btn-vote.active {
  color: var(--orange);
}

.respond-to-person {
  color: blue;
  font-weight: 600;
}

.like-img,
.dislike-img {
  width: 15px;
}

.dislike-img {
  transform: rotate(180deg);
}

.date {
  margin-left: auto;
}
</style>
