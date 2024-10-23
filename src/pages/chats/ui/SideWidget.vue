<script lang="ts" setup>
import type { ChatType } from '@/shared/types';
import { ref, computed } from 'vue';
import type { Ref } from 'vue';

const props = defineProps<{
  chats: ChatType[]
  activeChatId: number | null
}>();

const searchUser: Ref<string> = ref('')

const filteredListOfUsers = computed(() => {
  return props.chats.filter((chat) => chat?.user_name.toLocaleLowerCase()?.includes(searchUser.value.toLocaleLowerCase()))
})

const emit = defineEmits<{
  (e: 'setActiveChat', id: number): void,
  (e: 'handleNewUsers'): void
}>()

</script>
<template>
  <div class="chat-sidebar">
    <div class="chats-header">
      <input class="input-users" v-model="searchUser" type="text">
    </div>
    <button @click="() => emit('handleNewUsers')" class="chat-add">New chat</button>
    <div class="chat-list">
      <div v-for="chat in filteredListOfUsers" @click="() => emit('setActiveChat', chat.chat_id)" :key="chat.chat_id"
        class="chat-item" :class="{
          active: chat.chat_id === activeChatId,
        }">
        <img v-if="chat.user_img" class="chat-item-img" :src="`http://localhost:3000/upload/images/${chat.user_img}`"
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
      <div class="empty-list" v-if="filteredListOfUsers.length === 0">
        The list is empty
      </div>

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
  display: flex;
  align-items: center;
  padding: 5px;
}

.input-users {
  width: 100%;
  height: 30px;
  border-radius: 5px;
  outline: none;
  border: 1px solid var(--c-4);
  padding: 3px;
}

.empty-list {
  text-align: center;
  padding: 10px;
  color: var(--rose);
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

.chat-add:hover {
  background: var(--c-3);
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--c-1);
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
