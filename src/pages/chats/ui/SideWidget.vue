<script lang="ts" setup>
import type { ChatType } from '@/shared/types';

defineProps<{
  chats: ChatType[]
  activeChatId: number | null
}>();

const emit = defineEmits<{
  (e: 'setActiveChat', id: number): void
}>()

</script>
<template>
  <div class="chat-sidebar">
    <div class="chats-header"></div>
    <div class="chat-list">
      <div v-for="chat in chats" @click="() => emit('setActiveChat', chat.chat_id)" :key="chat.chat_id"
        class="chat-item" :class="{
          active: chat.chat_id === activeChatId,
        }">
        <img v-if="chat.user_img" class="chat-item-img" :src="`http://localhost:3000/${chat.user_img}`"
          :alt="chat.user_name" />
        <img v-else class="chat-item-img" src="@/assets/images/default-user-img.jpg" alt="default image" />

        <div class="chat-item-info">
          <h3>{{ chat.user_name }}</h3>
          <span v-if="chat.last_message_content">{{
            chat.last_message_content
          }}</span>
        </div>
        <div class="chat-item-info-msg">
          <time v-if="chat.last_message_sent_at" class="new-msg-time">{{
            chat.last_message_sent_at.slice(11, 16)
          }}</time>
        </div>
      </div>
      <button class="chat-add">New chat</button>
    </div>
  </div>
</template>
<style scoped>
.chat-sidebar {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--c-1);
  width: 360px;
}

.chats-header {
  height: 56px;
  border-bottom: 1px solid var(--c-1);
}

.chat-list {
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.chat-add {
  height: 40px;
  background: var(--c-1);
  cursor: pointer;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  cursor: pointer;
}

.chat-item.active {
  background: var(--c-4);
}

.chat-item:hover {
  background: var(--c-4);
}

.chat-item-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.chat-item-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.chat-item-info-msg {
  display: flex;
  flex-direction: column;
  margin-left: auto;
  align-items: end;
  gap: 4px;
}

.new-msg-time {
  font-weight: 400;
  font-size: 12px;
  line-height: 133%;
}
</style>
