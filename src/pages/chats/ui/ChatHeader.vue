<script lang="ts" setup>
import type { ChatType } from '@/shared/types';

defineProps<{
  activeChat: ChatType
}>();

</script>
<template>
  <div class="chat-header">
    <img v-if="activeChat.user_img" class="chat-img-user" :src="`http://localhost:3000/${activeChat.user_img}`"
      alt="default user img" />
    <img v-else class="chat-img-user" src="@/assets/images/default-user-img.jpg" alt="default image" />

    <div class="chat-info">
      <router-link :to="`/profile/${activeChat.user_id}`">
        <h3 v-if="activeChat.user_name" class="user-name">
          {{ activeChat.user_name }}
        </h3>
      </router-link>

      <span v-if="activeChat.last_message_sent_at" class="latest-online">last seen {{
        activeChat.last_message_sent_at.slice(11, 16) }}</span>
    </div>
    <button class="chat-settings">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8ZM12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14ZM10 18C10 18.5304 10.2107 19.0391 10.5858 19.4142C10.9609 19.7893 11.4696 20 12 20C12.5304 20 13.0391 19.7893 13.4142 19.4142C13.7893 19.0391 14 18.5304 14 18C14 17.4696 13.7893 16.9609 13.4142 16.5858C13.0391 16.2107 12.5304 16 12 16C11.4696 16 10.9609 16.2107 10.5858 16.5858C10.2107 16.9609 10 17.4696 10 18Z"
          fill="#707991" />
      </svg>
    </button>
  </div>
</template>
<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 16px;
}

.chat-img-user {
  width: 40px;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 50%;
}

.chat-info {
  flex-grow: 1;
}

.user-name {
  font-weight: 600;
  font-size: 16px;
  line-height: 125%;
}

.latest-online {
  font-weight: 400;
  font-size: 14px;
  line-height: 129%;
  opacity: 0.5;
}

.chat-settings {
  margin-left: auto;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.chat-settings:hover {
  transform: rotate(90deg);
}
</style>
